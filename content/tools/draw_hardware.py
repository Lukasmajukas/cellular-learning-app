"""Draws the unit 8 equipment pictures (simple diagrams, not photos).
Run: python3 content/tools/draw_hardware.py
Writes SVGs to content/photos/drawings/ and WebP files to app/public/photos/.
Needs Node Playwright (Chromium) for SVG to PNG, and ImageMagick `convert` for PNG to WebP."""
import pathlib, subprocess, tempfile

ROOT = pathlib.Path(__file__).resolve().parents[2]
SVG_DIR = ROOT / "content/photos/drawings"
OUT_DIR = ROOT / "app/public/photos"
BG = '<rect width="400" height="240" fill="#eef3f8"/>'
GREY, DARK, LIGHT = "#6b7785", "#34404d", "#c9d3dd"


def wrap(body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">{BG}{body}</svg>'


def connectors(x, y, n, w=100, label=None):
    """A row of n round connectors along the bottom edge of a panel."""
    out, gap = [], w / (n + 1)
    for i in range(n):
        cx = x + gap * (i + 1)
        out.append(f'<circle cx="{cx:.1f}" cy="{y}" r="6" fill="#f2b705" stroke="{DARK}" stroke-width="2"/>')
    return "".join(out)


def panel(ports, low, name):
    # long thin plastic cover standing up, connector row at the bottom
    x, w = 150, 100
    cw = 100 if ports <= 2 else 200
    body = f'<rect x="{x}" y="14" width="{w}" height="176" rx="10" fill="{LIGHT}" stroke="{GREY}" stroke-width="3"/>'
    body += f'<line x1="{x+20}" y1="30" x2="{x+20}" y2="174" stroke="{GREY}" stroke-width="1" stroke-dasharray="4 5"/>'
    body += f'<line x1="{x+w-20}" y1="30" x2="{x+w-20}" y2="174" stroke="{GREY}" stroke-width="1" stroke-dasharray="4 5"/>'
    body += connectors(200 - cw / 2, 206, ports, cw)
    body += f'<text x="200" y="234" text-anchor="middle" font-family="sans-serif" font-size="13" fill="{DARK}">{name}</text>'
    if low:
        body += f'<text x="{200-cw/2-6}" y="210" text-anchor="end" font-family="sans-serif" font-size="12" fill="{DARK}">low {low}</text>'
        body += f'<text x="{200+cw/2+6}" y="210" font-family="sans-serif" font-size="12" fill="{DARK}">mid {ports-low}</text>'
    return wrap(body)


def radio():
    fins = "".join(f'<rect x="{110+i*22}" y="40" width="10" height="130" fill="{GREY}"/>' for i in range(8))
    body = f'<rect x="100" y="34" width="200" height="142" rx="8" fill="{LIGHT}" stroke="{GREY}" stroke-width="3"/>' + fins
    body += f'<circle cx="150" cy="190" r="6" fill="#f2b705" stroke="{DARK}" stroke-width="2"/><circle cx="250" cy="190" r="6" fill="#f2b705" stroke="{DARK}" stroke-width="2"/>'
    body += f'<line x1="150" y1="196" x2="150" y2="214" stroke="{DARK}" stroke-width="2"/><line x1="250" y1="196" x2="250" y2="214" stroke="{DARK}" stroke-width="2"/>'
    body += f'<text x="200" y="232" text-anchor="middle" font-family="sans-serif" font-size="13" fill="{DARK}">Radio unit (finned box, cables go to a panel)</text>'
    return wrap(body)


def mimo():
    dots = "".join(f'<circle cx="{150+c*14}" cy="{40+r*14}" r="4" fill="{GREY}"/>' for r in range(8) for c in range(8))
    body = f'<rect x="130" y="24" width="140" height="130" rx="6" fill="{LIGHT}" stroke="{GREY}" stroke-width="3"/>' + dots
    body += f'<rect x="130" y="154" width="140" height="42" rx="4" fill="{GREY}" stroke="{DARK}" stroke-width="3"/>'
    body += "".join(f'<rect x="{138+i*16}" y="162" width="8" height="26" fill="{LIGHT}"/>' for i in range(8))
    body += f'<text x="200" y="224" text-anchor="middle" font-family="sans-serif" font-size="13" fill="{DARK}">Massive MIMO (radio + many tiny antennas)</text>'
    return wrap(body)


def main():
    files = {
        "form-passive-panel-drawing-01": panel(2, 0, "Passive panel (only cables inside)"),
        "form-radio-unit-drawing-01": radio(),
        "form-massive-mimo-drawing-01": mimo(),
        "ports-hexport-drawing-01": panel(6, 0, "Hexport panel: 6 ports"),
        "ports-nnhh-drawing-01": panel(8, 4, "8-port panel: 4 low + 4 mid"),
    }
    SVG_DIR.mkdir(parents=True, exist_ok=True)
    JS = ("const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();"
          "const p=await b.newPage({viewport:{width:800,height:480}});"
          "for(const [s,o] of JSON.parse(process.argv[1])){await p.goto('file://'+s);"
          "await p.waitForLoadState('load');await p.screenshot({path:o});}await b.close();})()")
    tmp = pathlib.Path(tempfile.mkdtemp())
    jobs = []
    for name, svg in files.items():
        (SVG_DIR / f"{name}.svg").write_text(svg)
        jobs.append([str(SVG_DIR / f"{name}.svg"), str(tmp / f"{name}.png")])
    subprocess.run(["node", "-e", JS, __import__("json").dumps(jobs)], check=True)
    for name in files:
        subprocess.run(["convert", str(tmp / f"{name}.png"), "-quality", "85", str(OUT_DIR / f"{name}.webp")], check=True)
        print("wrote", name)


if __name__ == "__main__":
    main()
