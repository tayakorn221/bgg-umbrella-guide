# BGG Umbrella Buyer Guide

เว็บ buyer guide ภาษาไทยสำหรับเทียบร่ม BGG กับแบรนด์คู่แข่ง โดยโฟกัสเรื่องกันแดด/UV, กันฝน, ลม, น้ำหนัก, ราคา และความคุ้มค่าจริงในตลาดไทย

เว็บที่เผยแพร่แล้ว: [tayakorn221.github.io/bgg-umbrella-guide](https://tayakorn221.github.io/bgg-umbrella-guide/)

## สรุปล่าสุด

ข้อมูลล่าสุดในหน้าเว็บอัปเดตวันที่ **17 ส.ค. 2026**

ข้อสรุปหลักตอนนี้ไม่ใช่ “BGG ดีที่สุดทุกด้าน” แต่เป็น:

- **BGG AT0070** คือ **value pick ไทย**: คุ้มสำหรับคนที่อยากได้ร่มกันแดด/UV ที่ซื้อในไทยง่าย ราคาไม่เกินพัน และสเปกสมดุล
- **UVO** คือ **UV-evidence winner**: หลักฐานเรื่องผ้า UV แน่นกว่า เพราะ official ระบุ JIS L 1925, UV cut 100%, UPF50+ และผลทดสอบระดับผ้า
- **Wpc. IZA** เป็นคู่แข่งที่จริงจัง: แพงกว่า BGG แต่ราคาไทยไม่ได้หนีมาก และไลน์ parasol/UV ชัดกว่า
- **Waterfront** สู้ได้จริงในไทย: มี official store บน Shopee ไทย และบางรุ่นราคาชนหรือถูกกว่า BGG
- **Knirps / BLUNT** เป็น benchmark งานโครงและความพรีเมียม มากกว่าตัวเลือกคุ้มราคา

## รุ่นและแบรนด์ที่เทียบ

### BGG

- AT0060 Air Umbrella Auto
- AT0068 Quick-fold Fast Dry Auto
- AT0070 Air Auto Pro24
- AT0072 Storm Breaker
- AT0077 Big Size
- FM1158 Air 2 Plus
- FM1161 Anchor Folding
- WA107565 Huge Size

### คู่แข่ง

- NAMIKO
- INGU
- Pharmular
- Thai Sun Sport
- LAMPTAN
- Raindeer
- Wpc. / Wpc. IZA / UVO
- Waterfront
- Knirps
- BLUNT

## สิ่งที่หน้าเว็บพยายามตอบ

- ถ้าเน้นกันแดด/UV จริงจัง ควรซื้อรุ่นไหน
- AT0068 กัน UV เพราะผ้า 190T หรือไม่
- AT0070 คุ้มกว่า AT0060/AT0068 แค่ไหน
- แบรนด์นอกอย่าง UVO, Wpc., Waterfront, Knirps, BLUNT สู้ BGG ได้ไหม
- แบรนด์ไทยหรือแบรนด์ขายในไทยตัวไหนควรเข้ารอบ
- ราคาไทยทำให้คำแนะนำเปลี่ยนหรือไม่

## Caveat สำคัญ

ราคาในเว็บเป็น snapshot จากวันที่ระบุเท่านั้น และเป็นราคาก่อนค่าส่ง, voucher ส่วนบุคคล, ภาษีนำเข้า หรือโปรเฉพาะบัญชี

ค่า UV/UPF ที่แบรนด์อ้างหลายกรณีเป็น **ค่าทดสอบระดับผ้า** ไม่ใช่ผลกัน UV ทั้งคันในทุกมุมใช้งานจริง แสง UV ยังเข้าจากด้านข้างและสะท้อนจากพื้นได้ โดยเฉพาะเวลาเดินกลางแดดจัด

## โครงสร้างไฟล์

- `index.html` - เนื้อหาเว็บและตารางเปรียบเทียบ
- `styles.css` - layout, responsive design, cards, tables, badges
- `script.js` - ปุ่มสลับโจทย์ซื้อเร็วและคะแนนรุ่น BGG
- `tests/competitors.test.js` - test กัน regression ของเนื้อหา, ราคา, source links, accessibility และ dynamic verdict

## ใช้งานในเครื่อง

เปิดไฟล์ `index.html` ใน browser ได้โดยตรง

หรือรัน local server:

```bash
python -m http.server 8766
```

แล้วเปิด:

```text
http://localhost:8766/
```

## รัน test

```bash
npm test
```

ตรวจ syntax ของ JavaScript:

```bash
node --check script.js
```

## GitHub Pages

โปรเจกต์นี้เป็น static site และตั้งใจให้ serve จาก repository root บน branch `main`

หลัง push ขึ้น GitHub แล้ว URL หลักคือ:

```text
https://tayakorn221.github.io/bgg-umbrella-guide/
```

ถ้าต้องการบังคับ refresh หลัง deploy ให้ใส่ query string ตาม commit เช่น:

```text
https://tayakorn221.github.io/bgg-umbrella-guide/?v=<commit>
```

## สถานะของเว็บ

เว็บนี้ทำไว้เป็น buyer guide ส่วนตัวสำหรับแชร์เพื่อน ไม่ใช่หน้าขายสินค้า และไม่ได้รับรองว่าแบรนด์ใดดีที่สุดแบบถาวร เพราะราคา, stock, รุ่นสินค้า และข้อมูลทดสอบสามารถเปลี่ยนได้
