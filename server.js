import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { readFile } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;
    if (pathname === "/index.html.var") {
      req.url = "/";
    }
    req.url = req.url.replace(/%5b/gi, "[").replace(/%5d/gi, "]");
    // Serve static files from the "Flyers" directory
    if (pathname.startsWith("/flyers")) {
      const filePath = join(__dirname, pathname);
      readFile(filePath, (err, data) => {
        if (err) {
          res.statusCode = 404;
          res.end("File not found");
          return;
        }
        res.statusCode = 200;
        res.end(data);
      });
    } else {
      // Handle all other routes with Next.js
      handle(req, res);
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(
      `> Server listening at http://localhost:${port} as ${
        dev ? "development" : process.env.NODE_ENV
      }`
    );
  });
});
