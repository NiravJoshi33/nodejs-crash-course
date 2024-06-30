import http from "http";
import fs from "fs/promises";
import url from "url";
import path from "path";

// Get current working directory & file path
/**
 * commonjs has a built-in `__filename` and `__dirname` variables
 * that contain the path of the current file and the directory of the current file
 * but this is not supported in ESM so we have to use this workaround
 */
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer(async (req, res) => {
  if (req.method === "GET") {
    let filePath;
    if (req.url === "/") {
      filePath = path.join(__dirname, "public", "index.html");
    } else if (req.url === "/about") {
      filePath = path.join(__dirname, "public", "about.html");
    } else {
      throw new Error("404 Not Found");
    }

    const data = await fs.readFile(filePath);
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(data);
  } else {
    res.writeHead(405, { "Content-Type": "text/plain" });
    res.end("Method Not Allowed");
    return;
  }
});

server.listen(8000, () => {
  console.log("Server is running on port 8000");
});
