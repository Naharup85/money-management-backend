import http from "node:http";
import createApplicationServer from "./app.js";
import { env } from "./common/config/env.js";
import { drizzle } from 'drizzle-orm/node-postgres';
import ApiError from "./common/utility/apiErrors.js";

export const db = drizzle(env.DATABASE_URL);


async function Main() {
   try {
     const server = http.createServer(createApplicationServer());
 
     const PORT = env.PORT || 3000;
     server.listen(PORT, () => {

     })
   } catch (error) {
    throw ApiError.internalServerError("unable to start server");
   }
}

Main();