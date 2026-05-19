# home

This is the project for Ron Mahony's paintings. If you have any questions about images, please contact: xxxxxx.
If you have any questions about the IT techniques, feel free to contact: rosaliu.567@gmail.com.

## Running the gallery with bids

Clicking a painting opens a lightbox with a bid form (name, contact, amount, notes). Submissions are stored in `data/bids.json`.

```bash
python bid_server.py
```

Open http://127.0.0.1:8000 — do not open `index.html` directly from the filesystem, or bid submission will fail.

View bids: `cat data/bids.json`
