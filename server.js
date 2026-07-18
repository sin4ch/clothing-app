import { createServer } from "node:http";
import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";

const port = 8080;
const root = process.cwd();
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const contentTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".avif": "image/avif",
    ".woff2": "font/woff2",
};

const server = createServer(async (request, response) => {
    try {
        if (request.url === "/api/images") {
            const entries = await readdir(join(root, "assets"), { withFileTypes: true });
            const images = entries
                .filter((entry) => entry.isFile() && imageExtensions.has(extname(entry.name).toLowerCase()))
                .map((entry) => entry.name)
                .sort((a, b) => a.localeCompare(b));

            response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            response.end(JSON.stringify(images));
            return;
        }

        const pathname = request.url === "/" ? "/index.html" : decodeURIComponent(request.url);
        const filePath = join(root, pathname);
        const content = await readFile(filePath);

        response.writeHead(200, {
            "Content-Type": contentTypes[extname(filePath).toLowerCase()] ?? "application/octet-stream",
        });
        response.end(content);
    } catch {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Not found");
    }
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
