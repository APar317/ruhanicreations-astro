#!/usr/bin/env python3
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse


class SiteHandler(SimpleHTTPRequestHandler):
    def send_error(self, code, message=None, explain=None):
        if code == 404:
            not_found_file = Path(self.directory) / "404.html"
            if not_found_file.is_file():
                content = not_found_file.read_bytes()
                self.send_response(404, "Not Found")
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(content)))
                self.end_headers()
                self.wfile.write(content)
                return
        super().send_error(code, message, explain)


def main():
    parser = argparse.ArgumentParser(
        description="Serve the site locally and return styled 404 page for missing URLs."
    )
    parser.add_argument("--port", type=int, default=8080, help="Port number (default: 8080)")
    parser.add_argument(
        "--dir", default=".", help="Directory to serve (default: current directory)"
    )
    args = parser.parse_args()

    handler = partial(SiteHandler, directory=args.dir)
    server = ThreadingHTTPServer(("0.0.0.0", args.port), handler)
    print(f"Serving {args.dir} on http://localhost:{args.port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
  main()
