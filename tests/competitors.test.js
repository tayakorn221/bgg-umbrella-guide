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

assert.match(html, /id="rival-models"/, "adds a model-level rival comparison section");
assert.match(css, /\.rival-table/, "styles the rival model comparison table");

for (const model of [
  "NAMIKO PU1",
  "NAMIKO PFU1",
  "Wpc. IZA ZA018",
  "Wpc. IZA ZA021 / ZA029",
  "Wpc. IZA ZA019 / ZA027",
  "UVO 3-Fold Mini",
  "UVO Large 60cm",
  "Knirps US.050 Heat Shield",
  "Knirps U.200 Heat Shield",
  "Knirps T.200",
  "BLUNT Metro UV",
  "BLUNT Classic UV",
  "BLUNT Sport UV",
]) {
  assert.match(html, new RegExp(model.replaceAll(".", "\\.")), `includes ${model}`);
}

for (const evidence of [
  "JIS L 1925",
  "25 m/s",
  "150 km/h",
  "UPF50+",
  "325g",
  "385g",
  "235g",
  "14.5 ซม.",
]) {
  assert.match(html, new RegExp(evidence.replaceAll("+", "\\+")), `keeps evidence ${evidence} visible`);
}
