import path from "node:path";

process.env.DATA_PATH = path.resolve(__dirname, "../data/urls.test.json");

import fs from "node:fs/promises";
import { beforeAll, beforeEach, describe, expect, it } from "@jest/globals";
import supertest from "supertest";
import type TestAgent from "supertest/lib/agent";
import { createServer } from "../server";

const TEST_DATA_PATH = process.env.DATA_PATH;

async function resetDataFile() {
	await fs.mkdir(path.dirname(TEST_DATA_PATH), { recursive: true });
	await fs.writeFile(TEST_DATA_PATH, "[]");
}

describe("URL Shortener Server", () => {
	let request: TestAgent;

	beforeAll(async () => {
		await resetDataFile();
		request = supertest(createServer());
	});

	beforeEach(async () => {
		await resetDataFile();
	});

	it("POST /api/shorten - should create a new short URL", async () => {
		const longUrl = "https://example.com/test";
		const res = await request
			.post("/api/shorten")
			.send({ url: longUrl })
			.expect(201)
			.expect("Content-Type", /json/);

		expect(res.body.shortUrl).toMatch(
			/^http:\/\/localhost:5001\/[A-Za-z0-9_-]{8}$/,
		);

		// Verify the record was saved in the JSON file
		const data = JSON.parse(await fs.readFile(TEST_DATA_PATH, "utf-8"));
		expect(data).toHaveLength(1);
		expect(data[0]).toMatchObject({ url: longUrl });
	});

	it("POST /api/shorten - missing url should return 400", async () => {
		await request
			.post("/api/shorten")
			.send({})
			.expect(400)
			.expect("Content-Type", /json/);
	});

	it("GET /:id - existing id should redirect", async () => {
		// First create a record
		const longUrl = "https://example.com/redirect";
		const postRes = await request
			.post("/api/shorten")
			.send({ url: longUrl })
			.expect(201);

		const shortUrl = postRes.body.shortUrl;
		const id = shortUrl.split("/").pop();

		// Now test redirect
		const res = await request.get(`/${id}`).expect(302);

		expect(res.headers.location).toBe(longUrl);
	});

	it("GET /:id - non-existent id should return 404", async () => {
		await request.get("/unknownid").expect(404);
	});

	it("GET /status - legacy health endpoint if implemented should return 200", async () => {
		// Depending on implementation, this may or may not exist
		const res = await request.get("/status");
		if (res.status === 200) {
			expect(res.ok).toBe(true);
		} else {
			expect(res.status).toBe(404);
		}
	});

	it("GET /message/:name - legacy message endpoint if implemented should respond correctly", async () => {
		const name = "jared";
		const res = await request.get(`/message/${name}`);
		if (res.status === 200) {
			expect(res.body).toEqual({ message: `hello ${name}` });
		} else {
			expect(res.status).toBe(404);
		}
	});
});
