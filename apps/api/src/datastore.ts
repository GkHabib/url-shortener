import { promises as fs } from "node:fs";
import path from "node:path";

export interface UrlRecord {
	id: string;
	url: string;
	createdAt: string; // ISO timestamp
}

const DATA_PATH = path.resolve(__dirname, "../data/urls.json");

async function ensureDataFile() {
	try {
		await fs.access(DATA_PATH);
	} catch {
		await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
		await fs.writeFile(DATA_PATH, JSON.stringify([]));
	}
}

export async function readAll(): Promise<UrlRecord[]> {
	await ensureDataFile();
	const raw = await fs.readFile(DATA_PATH, "utf-8");
	return JSON.parse(raw) as UrlRecord[];
}

export async function writeAll(records: UrlRecord[]) {
	await fs.writeFile(DATA_PATH, JSON.stringify(records, null, 2));
}

export async function addRecord(record: UrlRecord) {
	const records = await readAll();
	records.push(record);
	await writeAll(records);
}
