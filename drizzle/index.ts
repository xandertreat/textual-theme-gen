import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const URL = process.env.DB_URL;
if (!URL) throw new Error("DB_URL is not defined");
const sqlite = new Database(URL, { fileMustExist: false, timeout: 10_000 });

// DB settings
sqlite.exec("PRAGMA journal_mode = WAL;"); // concurrent readers
sqlite.exec("PRAGMA synchronous = NORMAL;"); // fsync once per transaction
sqlite.exec("PRAGMA temp_store = MEMORY;"); // temp B-trees in RAM
sqlite.exec("PRAGMA cache_size = -32768;"); // 32 MiB page cache
sqlite.exec("PRAGMA mmap_size = 300000000;"); // 300 MiB zero-copy mmap
sqlite.exec("PRAGMA busy_timeout = 10000;"); // 10 s writer grace period
sqlite.exec("PRAGMA foreign_keys = OFF;"); // check in code, not DB
sqlite.exec("PRAGMA journal_size_limit = 67108864;"); // 64 MiB WAL cap

const db = drizzle(sqlite, {
	schema,
	logger: false,
});

export default db;
