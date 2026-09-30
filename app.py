from http.server import BaseHTTPRequestHandler, HTTPServer
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = int(os.environ.get("PORT", 5000))
HOST = "0.0.0.0"


class Handler(BaseHTTPRequestHandler):

    def do_GET(self):
        path = self.path.split("?", 1)[0]

        if path == "/":
            path = "/index.html"

        safe = os.path.normpath(path.lstrip("/"))
        full = os.path.join(ROOT, safe)

        if not full.startswith(ROOT) or not os.path.isfile(full):
            self.send_error(404)
            return

        ext = os.path.splitext(full)[1]

        types = {
            ".html": "text/html; charset=utf-8",
            ".css": "text/css; charset=utf-8",
            ".js": "application/javascript; charset=utf-8",
            ".json": "application/json",
        }

        self.send_response(200)
        self.send_header(
            "Content-Type",
            types.get(ext, "text/plain; charset=utf-8")
        )
        self.end_headers()

        with open(full, "rb") as f:
            self.wfile.write(f.read())


if __name__ == "__main__":
    print(f"Network Protocol Visualizer running on port {PORT}")
    HTTPServer((HOST, PORT), Handler).serve_forever()