const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const html = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("styles.css", "utf8");
const script = fs.readFileSync("script.js", "utf8");

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const attrPattern = (name, value) => new RegExp(`${name}="${escapeRegExp(value)}"`);
const parseHexColor = (hex) => {
  const raw = hex.replace("#", "");
  return [0, 2, 4].map((offset) => Number.parseInt(raw.slice(offset, offset + 2), 16) / 255);
};
const linearize = (channel) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
const relativeLuminance = (hex) => {
  const [red, green, blue] = parseHexColor(hex).map(linearize);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};
const contrastRatio = (foreground, background) => {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (lighter + 0.05) / (darker + 0.05);
};

assert.match(html, /id="competitors"/, "adds a competitors section anchor");

for (const brand of ["NAMIKO", "Wpc.", "UVO", "Knirps", "BLUNT", "Waterfront", "INGU", "Pharmular", "Thai Sun Sport", "LAMPTAN", "Raindeer"]) {
  assert.match(html, new RegExp(brand.replace(".", "\\.")), `mentions ${brand}`);
}

for (const expected of ["AT0060", "AT0070", "AT0072", "AT0077"]) {
  assert.match(html, new RegExp(expected), `keeps BGG matchup ${expected} visible`);
}

assert.match(css, /\.competitor-grid/, "styles the competitor comparison grid");
assert.match(css, /\.competitor-card/, "styles each competitor card");

assert.match(html, /<meta property="og:image" content="https:\/\/[^"]+">/, "adds an absolute Open Graph image for sharing");
assert.match(html, /<meta property="og:url" content="https:\/\/tayakorn221\.github\.io\/bgg-umbrella-guide\/">/, "sets the canonical Pages URL for Open Graph shares");
assert.match(html, /<meta name="twitter:card" content="summary_large_image">/, "uses a large image Twitter/X preview card");
assert.match(html, /<meta name="twitter:image" content="https:\/\/[^"]+">/, "adds an absolute Twitter/X preview image");

assert.doesNotMatch(html, /<aside\b[^>]*class="verdict-panel"/, "keeps the dynamic verdict from creating a nested complementary landmark");
assert.match(html, /class="verdict-panel"[^>]*role="region"/, "keeps the dynamic verdict as a labelled region");
assert.match(html, /class="verdict-panel"[^>]*aria-labelledby="verdict-title"/, "labels the dynamic verdict region");

const quickActions = html.match(/<div class="quick-actions"[\s\S]*?<\/div>/)?.[0] ?? "";
const modeButtonBlocks = quickActions.match(/<button class="mode-button[^"]*"[\s\S]*?<\/button>/g) ?? [];
assert.equal(modeButtonBlocks.length, 5, "renders one mode button per buying mode");

for (const mode of ["sun", "carry", "rain", "wind", "value"]) {
  const button = modeButtonBlocks.find((block) => block.includes(`data-mode="${mode}"`)) ?? "";
  assert.ok(button, `renders ${mode} mode button`);
  assert.match(button, attrPattern("aria-pressed", mode === "sun" ? "true" : "false"), `sets initial aria-pressed for ${mode}`);
}

function makeElement(dataset = {}) {
  const classNames = new Set();
  const listeners = {};
  const attributes = {};

  return {
    attributes,
    dataset,
    textContent: "",
    value: "",
    addEventListener(eventName, handler) {
      listeners[eventName] = handler;
    },
    classList: {
      toggle(className, force) {
        if (force) {
          classNames.add(className);
        } else {
          classNames.delete(className);
        }
      },
      contains(className) {
        return classNames.has(className);
      },
    },
    dispatch(eventName) {
      listeners[eventName]?.();
    },
    setAttribute(name, value) {
      attributes[name] = value;
    },
  };
}

{
  const buttonElements = ["sun", "carry", "rain", "wind", "value"].map((mode) => makeElement({ mode }));
  const cardElements = ["at0060", "at0068", "at0070"].map((model) => makeElement({ model }));
  const keyedElements = {
    "#verdict-title": makeElement(),
    "#verdict-body": makeElement(),
    "#meter-at0060": makeElement(),
    "#meter-at0068": makeElement(),
    "#meter-at0070": makeElement(),
  };

  vm.runInNewContext(script, {
    document: {
      querySelector(selector) {
        return keyedElements[selector];
      },
      querySelectorAll(selector) {
        if (selector === ".mode-button") {
          return buttonElements;
        }

        if (selector === ".product-card") {
          return cardElements;
        }

        return [];
      },
    },
    window: {},
  });

  const sunButton = buttonElements.find((button) => button.dataset.mode === "sun");
  const rainButton = buttonElements.find((button) => button.dataset.mode === "rain");

  assert.equal(sunButton.attributes["aria-pressed"], "true", "marks the default sun mode as pressed");
  assert.equal(rainButton.attributes["aria-pressed"], "false", "marks inactive modes as not pressed");

  rainButton.dispatch("click");

  assert.equal(rainButton.attributes["aria-pressed"], "true", "updates aria-pressed when a new mode is selected");
  assert.equal(sunButton.attributes["aria-pressed"], "false", "clears aria-pressed from the previous mode");
}

const productImageBlocks = html.match(/<div class="product-image">[\s\S]*?<\/div>/g) ?? [];
assert.equal(productImageBlocks.length, 3, "renders the three primary BGG product images");

for (const imageBlock of productImageBlocks) {
  assert.match(imageBlock, /<img\b[^>]+loading="lazy"/, "lazy-loads below-fold BGG product images");
  assert.match(imageBlock, /<img\b[^>]+decoding="async"/, "decodes below-fold BGG product images asynchronously");
}

const modeButtonRule = css.match(/\.mode-button\s*{(?<body>[\s\S]*?)}/)?.groups?.body ?? "";
assert.ok(modeButtonRule, "keeps a base mode button rule");
assert.doesNotMatch(modeButtonRule, /transition:[^;]*background-color/, "does not animate active button background during ARIA state changes");

assert.match(css, /\.top-nav a\s*{[\s\S]*?min-height:\s*44px;/, "keeps top navigation touch targets at least 44px tall");
assert.match(css, /\.top-nav a\s*{[\s\S]*?display:\s*inline-flex;/, "uses flexible top navigation touch targets");

const pressedButtonRule = css.match(/\.mode-button\[aria-pressed="true"\]\s*{(?<body>[\s\S]*?)}/)?.groups?.body ?? "";
assert.ok(pressedButtonRule, "styles the pressed mode button from its ARIA state");
const readPressedButtonColor = (property) => pressedButtonRule.match(new RegExp(`(?:^|\\n)\\s*${property}:\\s*(#[0-9a-fA-F]{6});`))?.[1] ?? "";
const activeText = readPressedButtonColor("color");
const activeBackground = readPressedButtonColor("background");
assert.ok(activeText, "uses a static text color that accessibility tooling can evaluate");
assert.ok(activeBackground, "uses a static background color that accessibility tooling can evaluate");
assert.ok(contrastRatio(activeText, activeBackground) >= 4.5, "keeps the pressed mode button above WCAG AA contrast");

assert.doesNotMatch(html, /lucide@latest/, "pins the Lucide CDN dependency");
assert.match(html, /lucide@1\.30\.0\/dist\/umd\/lucide\.min\.js/, "uses the pinned Lucide web package");

assert.match(html, /id="rival-models"/, "adds a model-level rival comparison section");
assert.match(html, /id="thai-rivals"/, "adds a Thai challenger comparison section");
assert.match(css, /\.rival-table/, "styles the rival model comparison table");
assert.match(css, /\.thai-rivals/, "styles the Thai challenger comparison section");

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
  "BLUNT Sport / Sport UV",
  "Waterfront COKAGE+ 2-Way",
  "Waterfront ZENTENKOU 55cm",
  "Waterfront POKEFLAT QUICK",
  "INGU Umbrella UPF 50+",
  "Pharmular UV Umbrella",
  "Thai Sun Sport SSR0023",
  "LAMPTAN Umbrella Fan",
]) {
  assert.match(html, new RegExp(escapeRegExp(model)), `includes ${model}`);
}

const rivalCards = rivalSection.match(/<a class="rival-link-card"[\s\S]*?<\/a>/g) ?? [];
assert.equal(rivalCards.length, 20, "shows one linked photo card per rival model");

for (const card of rivalCards) {
  assert.match(card, /data-rival-card/, "marks rival photo cards for visual checks");
  assert.match(card, /href="https?:\/\//, "links each rival photo card to a source page");
  assert.match(card, /target="_blank"/, "opens rival source links in a new tab");
  assert.match(card, /rel="noreferrer"/, "uses noreferrer for external rival source links");
  assert.match(card, /<img\b[^>]+src="https?:\/\//, "uses a real product image on each rival card");
  assert.match(card, /<img\b[^>]+alt="[^"]{8,}"/, "gives each rival image useful alt text");
  assert.match(card, /loading="lazy"/, "lazy-loads rival product images");
  assert.match(card, /<span class="rival-price" data-price-card>[^<]*฿[^<]*<\/span>/, "shows each rival model price in Thai baht");
}

const primaryPriceBadges = html.match(/<p class="price-pill" data-price-card>[^<]*฿[^<]*<\/p>/g) ?? [];
assert.equal(primaryPriceBadges.length, 3, "shows Thai-baht prices on the three primary BGG cards");

const elitePriceBadges = html.match(/<span class="elite-price" data-price-note>[^<]*฿[^<]*<\/span>/g) ?? [];
assert.equal(elitePriceBadges.length, 5, "shows Thai-baht prices on all elite BGG picks");

const rivalPriceCells = rivalSection.match(/<td data-price-cell>[^<]*฿[\s\S]*?<\/td>/g) ?? [];
assert.equal(rivalPriceCells.length, 20, "adds a Thai-baht price column to every rival comparison row");

assert.match(html, /ราคาที่เช็กล่าสุด:\s*15 ส\.ค\. 2026/, "states the price check date");
assert.match(html, /เรตแปลงโดยประมาณ:\s*JPY 1 ≈ ฿0\.208/, "states the JPY conversion rate used for baht prices");
assert.match(html, /EUR 1 ≈ ฿38\.316/, "states the EUR conversion rate used for baht prices");
assert.match(html, /USD 1 ≈ ฿33\.083/, "states the USD conversion rate used for baht prices");

for (const expectedPrice of [
  "฿611",
  "฿687",
  "฿990",
  "฿890",
  "฿590",
  "฿650",
  "ประมาณ ฿1,716",
  "ประมาณ ฿3,937",
]) {
  assert.match(html, new RegExp(escapeRegExp(expectedPrice)), `keeps visible baht price ${expectedPrice}`);
}

assert.match(css, /\.price-pill/, "styles primary model price badges");
assert.match(css, /\.rival-price/, "styles rival model price badges");
assert.match(css, /\.price-context/, "styles the price caveat block");
assert.doesNotMatch(rivalSection, /ราคา [0-9,]+ เยน/, "does not leave rival price notes in yen");

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
  "https://waterfront-umbrella.com/products/cokage_s255-0820_s255-0821",
  "https://item.rakuten.co.jp/waterfront/s355-07/",
  "https://item.rakuten.co.jp/waterfront/pokeflat_u355-1291/",
  "https://shop.line.me/%40inguskin/product/1003316186",
  "https://pharmular.com/product/",
  "https://www.homepro.co.th/p/888125100201",
  "https://www.lamptan.co.th/products/umbrella-fan",
]) {
  assert.match(rivalSection, new RegExp(escapeRegExp(source)), `links rival source ${source}`);
}

assert.match(html, /https:\/\/www\.water-front\.co\.jp\/en\//, "links the Waterfront brand overview");
assert.match(html, /https:\/\/cokageplus\.com\//, "links the COKAGE+ technical overview");
assert.match(html, /5 แบรนด์/, "updates the competitor heading count");
assert.match(html, /30 m\/s/, "includes Waterfront wind-test evidence");
assert.match(html, /61%/, "includes Waterfront COKAGE+ heat-shield evidence");
assert.match(html, /185g/, "includes Waterfront POKEFLAT QUICK weight evidence");
assert.match(html, /99\.98%/, "includes INGU textile UV evidence");
assert.match(html, /460 กรัม/, "includes INGU weight caveat");
assert.match(html, /325 กรัม/, "includes Pharmular weight evidence");
assert.match(html, /124 cm/, "includes Thai Sun Sport coverage evidence");
assert.match(html, /2600 mAh/, "includes LAMPTAN battery evidence");
assert.match(html, /Raindeer[\s\S]*watchlist/, "keeps Raindeer as a watchlist Thai fashion brand instead of overstating lab evidence");

assert.match(css, /\.rival-gallery/, "styles the rival product photo gallery");
assert.match(css, /\.rival-link-card/, "styles each rival product link card");

assert.doesNotMatch(html, /กันแดดเชิงหลักฐานชนะ AT0070/, "avoids overstating UVO as a whole-umbrella UV winner over AT0070");
assert.match(html, /หลักฐานผ้ากัน UV แน่นกว่า AT0070/, "positions UVO as stronger fabric evidence rather than a total-product winner");
assert.match(html, /UVO\/Wpc\. IZA\/Waterfront/, "keeps fabric-state UV caveat near the competitor decision");

const bluntSportRow = html.match(/<tr>\s*<th><a href="https:\/\/bluntumbrellas\.com\/products\/blunt-sport"[\s\S]*?<\/tr>/)?.[0] ?? "";
assert.ok(bluntSportRow, "keeps the BLUNT Sport comparison row");
assert.doesNotMatch(bluntSportRow, /<span class="evidence-chip">UPF50\+<\/span>/, "does not claim BLUNT Sport UV evidence unless the exact UV variant is verified");
assert.doesNotMatch(bluntSportRow, /UV 99%/, "does not claim BLUNT Sport UV percentage from the generic Sport page");
assert.match(bluntSportRow, /ถ้าเลือกสี\/รุ่น UV ให้ดู UPF50\+ ในหน้าสินค้าจริง/, "tells readers to verify the actual BLUNT UV variant before buying");

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
