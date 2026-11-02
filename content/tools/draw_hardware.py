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


# Practice phone screen (unit 9): MADE-UP numbers on a drawn screen, not a real phone's. 400 x 320.
# The three white boxes are the tap targets in unit 9 (fractions of the picture): x 0.30, w 0.40, h 0.1375, y 0.19375 / 0.35 / 0.50625.
PHONE_ROWS = [("Cell ID (ECI)", "51207"), ("PCI", "211"), ("Channel (EARFCN)", "66800")]


def phone_screen():
    f = 'font-family="sans-serif"'
    body = f'<rect width="400" height="320" fill="#eef3f8"/>'
    body += f'<rect x="100" y="8" width="200" height="304" rx="26" fill="{DARK}"/>'
    body += '<rect x="112" y="24" width="176" height="272" rx="8" fill="#ffffff"/>'
    body += f'<rect x="112" y="24" width="176" height="26" rx="8" fill="{GREY}"/>'
    body += f'<text x="200" y="42" text-anchor="middle" {f} font-size="13" font-weight="bold" fill="#ffffff">FIELD TEST (practice)</text>'
    for i, (label, value) in enumerate(PHONE_ROWS):
        y = 62 + i * 50
        body += f'<rect x="120" y="{y}" width="160" height="44" rx="6" fill="#f4f7fa" stroke="{LIGHT}" stroke-width="2"/>'
        body += f'<text x="128" y="{y+15}" {f} font-size="11" fill="{GREY}">{label}</text>'
        body += f'<text x="128" y="{y+36}" {f} font-size="20" font-weight="bold" fill="{DARK}">{value}</text>'
    body += f'<text x="200" y="250" text-anchor="middle" {f} font-size="11" fill="{GREY}">made-up numbers</text>'
    body += f'<text x="200" y="266" text-anchor="middle" {f} font-size="11" fill="{GREY}">drawing, not a real phone screen</text>'
    body += f'<rect x="176" y="300" width="48" height="5" rx="2.5" fill="{GREY}"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320">{body}</svg>'


def main():
    files = {
        "form-passive-panel-drawing-01": panel(2, 0, "Passive panel (only cables inside)"),
        "form-radio-unit-drawing-01": radio(),
        "form-massive-mimo-drawing-01": mimo(),
        "ports-hexport-drawing-01": panel(6, 0, "Hexport panel: 6 ports"),
        "ports-nnhh-drawing-01": panel(8, 4, "8-port panel: 4 low + 4 mid"),
        "tool-phone-screen-drawing-01": phone_screen(),
    }
    tall = {"tool-phone-screen-drawing-01"}
    SVG_DIR.mkdir(parents=True, exist_ok=True)
    JS = ("const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();"
          "const p=await b.newPage({viewport:{width:800,height:480}});"
          "for(const [s,o,h] of JSON.parse(process.argv[1])){await p.setViewportSize({width:800,height:h});await p.goto('file://'+s);"
          "await p.waitForLoadState('load');await p.screenshot({path:o});}await b.close();})()")
    tmp = pathlib.Path(tempfile.mkdtemp())
    jobs = []
    for name, svg in files.items():
        (SVG_DIR / f"{name}.svg").write_text(svg)
        jobs.append([str(SVG_DIR / f"{name}.svg"), str(tmp / f"{name}.png"), 640 if name in tall else 480])
    subprocess.run(["node", "-e", JS, __import__("json").dumps(jobs)], check=True)
    for name in files:
        subprocess.run(["convert", str(tmp / f"{name}.png"), "-quality", "85", str(OUT_DIR / f"{name}.webp")], check=True)
        print("wrote", name)


if __name__ == "__main__":
    main()
