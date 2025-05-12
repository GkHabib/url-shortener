import { log } from "@repo/logger";
import express, {
	type Application,
	type Request,
	type Response,
} from "express";
import { nanoid } from "nanoid";
import { addRecord, readAll, type UrlRecord } from "./datastore";

const BASE_URL =
	process.env.BASE_URL || `http://localhost:${process.env.PORT ?? 5001}`;

export function createServer(): Application {
	const app = express();

	app.use(express.json());

	app.post("/api/shorten", async (req: Request, res: Response) => {
		try {
			const { url: originalUrl } = req.body;
			if (typeof originalUrl !== "string" || !originalUrl.trim()) {
				return res
					.status(400)
					.json({ error: "Missing or invalid `url` in request body." });
			}

			const id = nanoid(8);
			const record: UrlRecord = {
				id,
				url: originalUrl,
				createdAt: new Date().toISOString(),
			};

			await addRecord(record);
			const shortUrl = `${BASE_URL}/${id}`;
			log(`Created short link ${id} → ${originalUrl}`);
			return res.status(201).json({ shortUrl });
		} catch (err) {
			log("Error in POST /api/shorten:", err);
			return res.status(500).json({ error: "Internal server error." });
		}
	});

	app.get("/:id", async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const records = await readAll();
			const match = records.find((r) => r.id === id);

			if (match) {
				log(`Redirecting ${id} → ${match.url}`);
				return res.redirect(match.url);
			}
			return res.status(404).send("Not found");
		} catch (err) {
			log("Error in GET /:id:", err);
			return res.status(500).send("Internal server error");
		}
	});

	app.use((_, res) => {
		res.status(404).send("Not found");
	});

	return app;
}
