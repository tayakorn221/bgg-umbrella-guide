const recommendations = {
  sun: {
    title: "AT0070 คุ้มในไทย แต่ไม่ชนะทุกด้าน",
    body: "UVO ชนะด้านหลักฐานผ้า แต่ AT0070 ยังเป็น value pick ไทยเพราะราคา ช่องทางซื้อ และสเปก UPF50+ สมดุลกว่าในงบไม่ถึงพัน",
    scores: { at0060: 4.4, at0068: 2.6, at0070: 5 },
    match: "at0070",
  },
  carry: {
    title: "AT0060 เหมาะกับการพกทุกวันที่สุด",
    body: "น้ำหนัก 210 กรัมและพับ 26.5 ซม. ทำให้ถือในกระเป๋าง่ายกว่า AT0068 ชัดเจน ส่วน AT0070 คือทางเลือกถ้าอยากได้เงาใหญ่ขึ้น",
    scores: { at0060: 5, at0068: 2.3, at0070: 4.4 },
    match: "at0060",
  },
  rain: {
    title: "AT0068 เหมาะกับหน้าฝนมากกว่า",
    body: "จุดแข็งคือผ้า 190T high-density, แห้งเร็ว, quick-fold และโครง 8 ก้าน เหมาะกับฝนและการเข้าออกอาคารบ่อย",
    scores: { at0060: 3.2, at0068: 5, at0070: 4.5 },
    match: "at0068",
  },
  wind: {
    title: "ในสามตัวหลัก AT0068 รับโจทย์ลมดีที่สุด",
    body: "น้ำหนักและโครง 8 ก้านช่วยให้เหมาะกับลมกว่า AT0060/AT0070 แต่ถ้าอยากไปสุดเรื่องลม ให้ดู AT0072 Storm Breaker เพิ่ม",
    scores: { at0060: 3, at0068: 4.8, at0070: 3.6 },
    match: "at0068",
  },
  value: {
    title: "AT0060 คุ้มสุดถ้าโจทย์คือกัน UV แบบพกง่าย",
    body: "ได้ UPF50 และน้ำหนักเบาที่สุดในราคามักต่ำกว่า AT0070 แต่ถ้าเพิ่มเงินเพื่อพื้นที่เงาใหญ่ขึ้น AT0070 คุ้มกว่าในระยะยาว",
    scores: { at0060: 4.7, at0068: 3.4, at0070: 4.5 },
    match: "at0060",
  },
};

const buttons = document.querySelectorAll(".mode-button");
const title = document.querySelector("#verdict-title");
const body = document.querySelector("#verdict-body");
const meters = {
  at0060: document.querySelector("#meter-at0060"),
  at0068: document.querySelector("#meter-at0068"),
  at0070: document.querySelector("#meter-at0070"),
};
const cards = document.querySelectorAll(".product-card");

function setMode(mode) {
  const selectedMode = recommendations[mode] ? mode : "sun";
  const recommendation = recommendations[selectedMode];

  buttons.forEach((button) => {
    const isSelected = button.dataset.mode === selectedMode;
    button.classList.toggle("is-active", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });

  title.textContent = recommendation.title;
  body.textContent = recommendation.body;

  Object.entries(recommendation.scores).forEach(([model, score]) => {
    meters[model].value = score;
  });

  cards.forEach((card) => {
    const isMatch = card.dataset.model === recommendation.match;
    card.classList.toggle("is-match", isMatch);
    card.classList.toggle("is-dimmed", !isMatch);
  });
}

buttons.forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

setMode("sun");

if (window.lucide) {
  window.lucide.createIcons({
    attrs: {
      "stroke-width": 1.8,
    },
  });
}
