import http from "node:http";
import createApplicationServer from "./app.js";
import "dotenv/config";
import { drizzle } from 'drizzle-orm/node-postgres';
import ApiError from "./common/utility/apiErrors.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw ApiError.envError('DATABASE_URL is not defined');
  process.exit(1);
}

const db = drizzle(connectionString);


async function Main() {
    const server = http.createServer(createApplicationServer());

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
}

Main();