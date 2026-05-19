"""
Local gallery server: static files + bid API.
Run: python bid_server.py
Then open http://127.0.0.1:8000
"""
import json
import os
from datetime import datetime, timezone
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse

BIDS_FILE = os.path.join('data', 'bids.json')
PORT = 8000


def load_bids():
    if not os.path.exists(BIDS_FILE):
        return []
    with open(BIDS_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_bids(bids):
    os.makedirs(os.path.dirname(BIDS_FILE), exist_ok=True)
    with open(BIDS_FILE, 'w', encoding='utf-8') as f:
        json.dump(bids, f, ensure_ascii=False, indent=2)


class GalleryHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path != '/api/bid':
            self.send_error(404)
            return

        length = int(self.headers.get('Content-Length', 0))
        if length <= 0 or length > 65536:
            self.send_error(400, 'Invalid body')
            return

        try:
            payload = json.loads(self.rfile.read(length).decode('utf-8'))
        except (json.JSONDecodeError, UnicodeDecodeError):
            self.send_error(400, 'Invalid JSON')
            return

        artwork = str(payload.get('artwork', '')).strip()
        name = str(payload.get('name', '')).strip()
        contact = str(payload.get('contact', '')).strip()
        amount = payload.get('amount')
        message = str(payload.get('message', '')).strip()

        if not artwork or not name or not contact:
            self.send_error(400, 'Missing required fields')
            return

        try:
            amount = float(amount)
        except (TypeError, ValueError):
            self.send_error(400, 'Invalid bid amount')
            return

        if amount < 1:
            self.send_error(400, 'Bid must be at least 1')
            return

        bid = {
            'id': datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%f'),
            'submitted_at': datetime.now(timezone.utc).isoformat(),
            'artwork': artwork,
            'name': name,
            'contact': contact,
            'amount': amount,
            'message': message,
        }

        bids = load_bids()
        bids.append(bid)
        save_bids(bids)

        body = json.dumps({'ok': True, 'id': bid['id']}).encode('utf-8')
        self.send_response(201)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        if args and args[0].startswith('POST /api/bid'):
            super().log_message(format, *args)


if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server = ThreadingHTTPServer(('127.0.0.1', PORT), GalleryHandler)
    print(f'Gallery running at http://127.0.0.1:{PORT}')
    print(f'Bids saved to {BIDS_FILE}')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nStopped.')
