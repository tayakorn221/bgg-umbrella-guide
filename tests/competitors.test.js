const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("styles.css", "utf8");

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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

const rivalSection = html.match(/<section id="rival-models"[\s\S]*?<\/section>/)?.[0] ?? "";
assert.ok(rivalSection, "keeps a rival model comparison section");

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

const rivalCards = rivalSection.match(/<a class="rival-link-card"[\s\S]*?<\/a>/g) ?? [];
assert.equal(rivalCards.length, 13, "shows one linked photo card per rival model");

for (const card of rivalCards) {
  assert.match(card, /data-rival-card/, "marks rival photo cards for visual checks");
  assert.match(card, /href="https?:\/\//, "links each rival photo card to a source page");
  assert.match(card, /target="_blank"/, "opens rival source links in a new tab");
  assert.match(card, /rel="noreferrer"/, "uses noreferrer for external rival source links");
  assert.match(card, /<img\b[^>]+src="https?:\/\//, "uses a real product image on each rival card");
  assert.match(card, /<img\b[^>]+alt="[^"]{8,}"/, "gives each rival image useful alt text");
  assert.match(card, /loading="lazy"/, "lazy-loads rival product images");
}

for (const source of [
  "https://www.ofm.co.th/product/namiko-",
  "https://www.homepro.co.th/p/888172000011",
  "https://www.wpc-store.com/c/iza/za018",
  "https://www.wpc-store.com/c/iza/za029",
  "https://www.wpc-store.com/c/iza/za027",
  "https://www.wpc-store.com/c/uvo/uvo2-fp3",
  "https://www.wpc-store.com/c/uvo/uvo-lp60s",
  "https://knirps.com/950050hs-us-050",
  "https://knirps.com/952200hs-u-200",
  "https://knirps.com/953201-t-200",
  "https://bluntumbrellas.com/products/blunt-metro",
  "https://bluntumbrellas.com/products/blunt-classic",
  "https://bluntumbrellas.com/products/blunt-sport",
]) {
  assert.match(rivalSection, new RegExp(escapeRegExp(source)), `links rival source ${source}`);
}

assert.match(css, /\.rival-gallery/, "styles the rival product photo gallery");
assert.match(css, /\.rival-link-card/, "styles each rival product link card");

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
