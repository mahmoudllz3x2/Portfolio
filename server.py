from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == '__main__':
    port = 5000
    server_address = ('0.0.0.0', port)
    httpd = HTTPServer(server_address, NoCacheHandler)
    print(f'Server running on http://0.0.0.0:{port}')
    httpd.serve_forever()
