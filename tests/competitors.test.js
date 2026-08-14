const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("styles.css", "utf8");

assert.match(html, /id="competitors"/, "adds a competitors section anchor");

for (const brand of ["NAMIKO", "Wpc.", "UVO", "Knirps", "BLUNT"]) {
  assert.match(html, new RegExp(brand.replace(".", "\\.")), `mentions ${brand}`);
}

for (const expected of ["AT0060", "AT0070", "AT0072", "AT0077"]) {
  assert.match(html, new RegExp(expected), `keeps BGG matchup ${expected} visible`);
}

assert.match(css, /\.competitor-grid/, "styles the competitor comparison grid");
assert.match(css, /\.competitor-card/, "styles each competitor card");
