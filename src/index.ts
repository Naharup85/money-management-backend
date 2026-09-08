import http from "node:http";
import createApplicationServer from "./app.js";
import "dotenv/config";


async function Main() {
    const server = http.createServer(createApplicationServer());

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
}

Main();