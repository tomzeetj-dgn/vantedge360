# Reference viewer for the approved design. Not production code.
# Run from anywhere:  python3 reference/serve.py   then open http://127.0.0.1:8765/Home.dc.html
# The pages load React from cdn.jsdelivr.net and fonts from Google Fonts, so you need internet.
import http.server, socketserver, os
HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, '..', 'assets')
BLOBS = {
  'a681aa0f4ea06d1deb008ed103df9631': 'villa.webp',
  'b39dd639493d55000c30c2368125ae77': 'lounge.webp',
  '38b0ac6bf8ef21f9bc5a2a0204bb1b20': 'restaurant.webp',
  'd528040f3570baa58c50a11c6f17da83': 'suite.webp',
  'd564d53dafde8c44ca03a970d8b0dbaf': 've-emblem-ink.svg',
  '36168458b683c8e8bc3cd63817913d0e': 've-emblem-gold.svg',
  'e1bf14b797dd34c0575d440374002e43': 'map-linework.svg',
  '988c882bf8dede7ba8703328c2947f75': 'planet-restaurant.webp',
  'b245234e8e3de01ddaaba55f4826c580': 'google-trusted-badge.png',
}
CT = {'.webp': 'image/webp', '.svg': 'image/svg+xml', '.png': 'image/png', '.js': 'text/javascript', '.html': 'text/html; charset=utf-8'}
class H(http.server.BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def do_GET(self):
        p = self.path.split('?')[0].split('#')[0]
        if p.startswith('/_blob/'):
            n = BLOBS.get(p[7:]); f = os.path.join(ASSETS, n) if n else None
        else:
            f = os.path.join(HERE, os.path.basename(p) or 'Home.dc.html')
        if not f or not os.path.exists(f):
            self.send_response(404); self.end_headers(); return
        d = open(f, 'rb').read()
        self.send_response(200)
        self.send_header('Content-Type', CT.get(os.path.splitext(f)[1], 'application/octet-stream'))
        self.send_header('Content-Length', str(len(d))); self.end_headers(); self.wfile.write(d)
socketserver.TCPServer.allow_reuse_address = True
print('Reference design: http://127.0.0.1:8765/Home.dc.html')
socketserver.TCPServer(('127.0.0.1', 8765), H).serve_forever()
