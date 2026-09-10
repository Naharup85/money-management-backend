import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import fs from 'fs';
import path from 'path';





export default defineConfig({
    out: './drizzle',
    schema: './src/db/schema/',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL,
        
    },

});
