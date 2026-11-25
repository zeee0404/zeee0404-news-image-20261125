// draw.mjs — renders the newspaper front page for Wednesday 25 November 2026
// and writes it to entry.png (1024x1024) in this directory.
// Run with: node draw.mjs
// The drawing uses @napi-rs/canvas from the shared tools folder. Nothing here
// is random and nothing depends on the clock, so every run paints the same
// bytes. main.ts is the graded program: it copies entry.png to the output
// directory, because the grader runs with the standard library only.
import { createCanvas } from "/home/hatch/workspace/makefun/tools/node_modules/@napi-rs/canvas/index.js";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

const W = 1024;
const H = 1024;
const MARGIN = 34;
const PAGE = W - MARGIN * 2;

const PAPER = "#f6f1e2";
const INK = "#1a1a1a";
const RED = "#9e1b1b";
const BLUE = "#1f4e79";
const GREY = "#5a564a";
const RULE = "#2b2b2b";

const canvas = createCanvas(W, H);
const ctx = canvas.getContext("2d");

// ---------- helpers ----------

function wrap(text, font, maxWidth) {
  ctx.font = font;
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width <= maxWidth || !line) {
      line = test;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function textLines(lines, x, y, lineHeight, align = "left") {
  ctx.textAlign = align;
  for (const line of lines) {
    ctx.fillText(line, x, y);
    y += lineHeight;
  }
  return y;
}

function rule(y, thickness, color = RULE) {
  ctx.fillStyle = color;
  ctx.fillRect(MARGIN, y, PAGE, thickness);
}

function kicker(text, x, y) {
  ctx.fillStyle = RED;
  ctx.font = "bold 15px 'Noto Sans'";
  ctx.textAlign = "left";
  ctx.fillText(text, x, y);
}

function headline(text, x, y, size, maxWidth, lineHeight) {
  ctx.fillStyle = INK;
  const font = `bold ${size}px 'Noto Serif'`;
  const lines = wrap(text, font, maxWidth);
  return textLines(lines, x, y, lineHeight);
}

function deck(text, x, y, maxWidth, size = 15, lineHeight = 20) {
  ctx.fillStyle = INK;
  const font = `${size}px 'Noto Sans'`;
  const lines = wrap(text, font, maxWidth);
  return textLines(lines, x, y, lineHeight);
}

function caption(text, x, y, maxWidth) {
  ctx.fillStyle = GREY;
  ctx.font = "italic 13px 'Noto Sans'";
  const lines = wrap(text, ctx.font, maxWidth);
  textLines(lines, x, y, 16);
}

function frame(x, y, w, h) {
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
}

// ---------- paper ----------

ctx.fillStyle = PAPER;
ctx.fillRect(0, 0, W, H);

// ---------- masthead ----------

ctx.fillStyle = INK;
ctx.font = "bold 66px 'Noto Serif'";
ctx.textAlign = "center";
ctx.fillText("THE WORLD TODAY", W / 2, 92);

ctx.fillStyle = RED;
ctx.font = "bold 22px 'Noto Sans'";
ctx.fillText("W E D N E S D A Y ,  2 5  N O V E M B E R  2 0 2 6", W / 2, 128);

rule(142, 3);
rule(148, 1);

// ---------- lead story: North Korea expels Swiss envoy ----------

const leadY = 178;
kicker("KOREA  ·  DIPLOMACY", MARGIN, leadY);
headline("PYONGYANG ORDERS SWISS ENVOY OUT IN 48 HOURS", MARGIN, leadY + 46, 41, PAGE, 48);

// Lead illustration: government building, flag, and a 48-hour clock.
const lx = MARGIN;
const ly = leadY + 100;
const lw = 440;
const lh = 178;
{
  const sky = ctx.createLinearGradient(lx, ly, lx, ly + lh);
  sky.addColorStop(0, "#c8d4e0");
  sky.addColorStop(1, "#e8ddc0");
  ctx.fillStyle = sky;
  ctx.fillRect(lx, ly, lw, lh);
  // distant skyline
  ctx.fillStyle = "#8d99a8";
  ctx.fillRect(lx + 18, ly + 118, 60, 60);
  ctx.fillRect(lx + 92, ly + 96, 44, 82);
  ctx.fillRect(lx + 330, ly + 104, 52, 74);
  ctx.fillRect(lx + 392, ly + 126, 30, 52);
  // main building
  ctx.fillStyle = "#5d6b7d";
  ctx.fillRect(lx + 150, ly + 72, 150, 106);
  ctx.fillStyle = "#46536a";
  ctx.fillRect(lx + 150, ly + 72, 150, 14);
  // columns
  ctx.fillStyle = "#e8e2d2";
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(lx + 164 + i * 28, ly + 92, 12, 86);
  }
  // windows
  ctx.fillStyle = "#2c3648";
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 4; c++) {
      ctx.fillRect(lx + 186 + c * 28, ly + 96 + r * 26, 14, 16);
    }
  }
  // flagpole and flag
  ctx.fillStyle = INK;
  ctx.fillRect(lx + 222, ly + 18, 4, 56);
  ctx.fillStyle = "#c8102e";
  ctx.beginPath();
  ctx.moveTo(lx + 226, ly + 18);
  ctx.lineTo(lx + 268, ly + 28);
  ctx.lineTo(lx + 226, ly + 40);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(lx + 240, ly + 29, 5, 0, Math.PI * 2);
  ctx.fill();
  // 48-hour clock badge
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(lx + 372, ly + 48, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(lx + 372, ly + 48, 34, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = INK;
  ctx.font = "bold 20px 'Noto Sans'";
  ctx.textAlign = "center";
  ctx.fillText("48", lx + 372, ly + 46);
  ctx.font = "bold 12px 'Noto Sans'";
  ctx.fillText("HOURS", lx + 372, ly + 64);
  // ground
  ctx.fillStyle = "#6f7a52";
  ctx.fillRect(lx, ly + lh - 14, lw, 14);
  frame(lx, ly, lw, lh);
}

const dx = MARGIN + lw + 22;
const dw = PAGE - lw - 22;
deck(
  "North Korea demands the closure of Switzerland's diplomatic office in Pyongyang and tells its chief diplomat to leave within two days, a day after Kim Yo Jong threatened the mission over sanctions on a youth camp.",
  dx,
  ly + 22,
  dw,
  18,
  25,
);
deck(
  "Bern says it will keep talking despite the order. The office only reopened in October.",
  dx,
  ly + 152,
  dw,
  16,
  22,
);
caption("The Swiss office in Pyongyang, opened last month.", lx, ly + lh + 18, lw);

// ---------- divider ----------
rule(leadY + 100 + lh + 34, 1);

// ---------- supporting stories ----------

const stories = [
  {
    kick: "UNITED STATES",
    head: "US SPY AGENCIES HIT BY CYBER BREACH",
    body: "Hackers broke into an unclassified CIA and ODNI network for open-source intelligence. No classified systems were hit.",
    cap: "Washington",
    draw(x, y, w, h) {
      ctx.fillStyle = "#22384f";
      ctx.fillRect(x, y, w, h);
      // laptop
      ctx.fillStyle = "#0f1e2e";
      ctx.fillRect(x + 62, y + 14, 176, 66);
      ctx.fillStyle = "#9fd4ff";
      ctx.fillRect(x + 72, y + 22, 156, 50);
      // warning triangle
      ctx.fillStyle = "#f2b705";
      ctx.beginPath();
      ctx.moveTo(x + 150, y + 28);
      ctx.lineTo(x + 176, y + 64);
      ctx.lineTo(x + 124, y + 64);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#0f1e2e";
      ctx.font = "bold 24px 'Noto Sans'";
      ctx.textAlign = "center";
      ctx.fillText("!", x + 150, y + 60);
      // keyboard base
      ctx.fillStyle = "#3a4c61";
      ctx.beginPath();
      ctx.moveTo(x + 48, y + 80);
      ctx.lineTo(x + 252, y + 80);
      ctx.lineTo(x + 264, y + 92);
      ctx.lineTo(x + 36, y + 92);
      ctx.closePath();
      ctx.fill();
      // binary strings
      ctx.fillStyle = "#7fb3d5";
      ctx.font = "12px 'Noto Sans'";
      ctx.textAlign = "left";
      ctx.fillText("0101 1100", x + 10, y + 16);
      ctx.fillText("1010 0111", x + 10, y + 92);
    },
  },
  {
    kick: "CHINA",
    head: "SHANGHAI VOWS LOYALTY AFTER TOP OFFICIAL'S PROBE",
    body: "Shanghai's party leadership pledges backing for Beijing after Politburo member Chen Jining is put under a graft probe.",
    cap: "Shanghai",
    draw(x, y, w, h) {
      const sky = ctx.createLinearGradient(x, y, x, y + h);
      sky.addColorStop(0, "#f2c14e");
      sky.addColorStop(1, "#e88f4a");
      ctx.fillStyle = sky;
      ctx.fillRect(x, y, w, h);
      // sun
      ctx.fillStyle = "#d94f30";
      ctx.beginPath();
      ctx.arc(x + 232, y + 26, 16, 0, Math.PI * 2);
      ctx.fill();
      // skyline
      ctx.fillStyle = "#3d2b2b";
      ctx.fillRect(x + 10, y + 58, 34, 38);
      ctx.fillRect(x + 52, y + 70, 26, 26);
      ctx.fillRect(x + 210, y + 64, 30, 32);
      ctx.fillRect(x + 248, y + 74, 42, 22);
      // pearl tower
      ctx.fillRect(x + 128, y + 18, 8, 78);
      ctx.beginPath();
      ctx.arc(x + 132, y + 78, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 132, y + 48, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 132, y + 28, 5, 0, Math.PI * 2);
      ctx.fill();
      // windows
      ctx.fillStyle = "#f2c14e";
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(x + 16 + i * 8, y + 66, 4, 5);
        ctx.fillRect(x + 216 + i * 7, y + 72, 4, 5);
      }
      // river
      ctx.fillStyle = "#7a9bb5";
      ctx.fillRect(x, y + h - 12, w, 12);
    },
  },
  {
    kick: "CONGO",
    head: "WHO FLEES EBOLA HOSPITAL AS FIGHTING CLOSES IN",
    body: "Health workers are evacuated from a hospital in DR Congo after sheltering there for three days from fierce fighting.",
    cap: "Ituri province",
    draw(x, y, w, h) {
      ctx.fillStyle = "#cfe0b8";
      ctx.fillRect(x, y, w, h);
      // hills
      ctx.fillStyle = "#7fae6d";
      ctx.beginPath();
      ctx.moveTo(x, y + 78);
      ctx.quadraticCurveTo(x + 90, y + 52, x + 180, y + 76);
      ctx.quadraticCurveTo(x + 250, y + 88, x + 300, y + 72);
      ctx.lineTo(x + 300, y + h);
      ctx.lineTo(x, y + h);
      ctx.closePath();
      ctx.fill();
      // hospital
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x + 78, y + 34, 144, 52);
      ctx.fillStyle = "#c8102e";
      ctx.fillRect(x + 138, y + 38, 24, 7);
      ctx.fillRect(x + 146, y + 32, 8, 20);
      ctx.fillStyle = "#3a5a8c";
      ctx.fillRect(x + 92, y + 66, 26, 20);
      ctx.fillRect(x + 182, y + 66, 26, 20);
      ctx.fillStyle = "#7fb3d5";
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(x + 128 + i * 18, y + 60, 12, 12);
      }
      // ambulance
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x + 216, y + 66, 66, 18);
      ctx.fillStyle = "#c8102e";
      ctx.fillRect(x + 232, y + 70, 14, 4);
      ctx.fillRect(x + 237, y + 66, 4, 12);
      ctx.fillStyle = "#1a1a1a";
      ctx.beginPath();
      ctx.arc(x + 230, y + 88, 6, 0, Math.PI * 2);
      ctx.arc(x + 268, y + 88, 6, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    kick: "SAUDI ARABIA",
    head: "DRONE HITS RIYADH'S TALLEST TOWER; 11 HURT",
    body: "A Houthi drone strikes the 385-metre PIF Tower in the Saudi capital, the second hit on the landmark in less than a week.",
    cap: "Riyadh",
    draw(x, y, w, h) {
      const sky = ctx.createLinearGradient(x, y, x, y + h);
      sky.addColorStop(0, "#dfe9f2");
      sky.addColorStop(1, "#f2e3c2");
      ctx.fillStyle = sky;
      ctx.fillRect(x, y, w, h);
      // tower
      ctx.fillStyle = "#5a6b7f";
      ctx.beginPath();
      ctx.moveTo(x + 128, y + 96);
      ctx.lineTo(x + 138, y + 14);
      ctx.lineTo(x + 162, y + 14);
      ctx.lineTo(x + 172, y + 96);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#7fa0bd";
      for (let r = 0; r < 6; r++) {
        ctx.fillRect(x + 140, y + 22 + r * 12, 20, 5);
      }
      // smoke plume
      ctx.fillStyle = "#8a8a86";
      ctx.beginPath();
      ctx.arc(x + 178, y + 44, 11, 0, Math.PI * 2);
      ctx.arc(x + 196, y + 36, 14, 0, Math.PI * 2);
      ctx.arc(x + 214, y + 46, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#e07b39";
      ctx.beginPath();
      ctx.arc(x + 168, y + 56, 6, 0, Math.PI * 2);
      ctx.fill();
      // drone
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(x + 228, y + 28, 12, 6);
      ctx.fillRect(x + 224, y + 30, 20, 2);
      // smaller buildings
      ctx.fillStyle = "#9aa7b5";
      ctx.fillRect(x + 20, y + 74, 52, 22);
      ctx.fillRect(x + 236, y + 80, 44, 16);
      // ground
      ctx.fillStyle = "#c9b183";
      ctx.fillRect(x, y + h - 6, w, 6);
    },
  },
  {
    kick: "THE GULF",
    head: "IRAN CLAIMS TANKERS HIT MINES; US DENIES IT",
    body: "Tehran says three oil tankers caught fire after striking mines in the Strait of Hormuz. The US says the lanes are clear.",
    cap: "Strait of Hormuz",
    draw(x, y, w, h) {
      const sky = ctx.createLinearGradient(x, y, x, y + h);
      sky.addColorStop(0, "#bcd7ea");
      sky.addColorStop(1, "#e8f0f5");
      ctx.fillStyle = sky;
      ctx.fillRect(x, y, w, h);
      // sea
      ctx.fillStyle = "#2e6b9e";
      ctx.fillRect(x, y + 60, w, h - 60);
      ctx.fillStyle = "#4d8fbf";
      ctx.fillRect(x, y + 64, w, 3);
      ctx.fillRect(x, y + 74, w, 2);
      // tanker
      ctx.fillStyle = "#8c2f26";
      ctx.beginPath();
      ctx.moveTo(x + 48, y + 66);
      ctx.lineTo(x + 252, y + 66);
      ctx.lineTo(x + 238, y + 88);
      ctx.lineTo(x + 62, y + 88);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#d8d3c4";
      ctx.fillRect(x + 196, y + 48, 34, 18);
      ctx.fillStyle = "#3a3a3a";
      ctx.fillRect(x + 208, y + 40, 6, 8);
      // containers
      ctx.fillStyle = "#e8a13c";
      ctx.fillRect(x + 72, y + 54, 30, 12);
      ctx.fillStyle = "#3f7d5a";
      ctx.fillRect(x + 106, y + 54, 30, 12);
      ctx.fillStyle = "#c8102e";
      ctx.fillRect(x + 140, y + 54, 30, 12);
      // flames and smoke
      ctx.fillStyle = "#f28c1e";
      ctx.beginPath();
      ctx.moveTo(x + 176, y + 54);
      ctx.lineTo(x + 184, y + 38);
      ctx.lineTo(x + 192, y + 54);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#6f6f6c";
      ctx.beginPath();
      ctx.arc(x + 186, y + 32, 9, 0, Math.PI * 2);
      ctx.arc(x + 198, y + 24, 11, 0, Math.PI * 2);
      ctx.fill();
      // mines
      ctx.fillStyle = "#1a1a1a";
      ctx.beginPath();
      ctx.arc(x + 262, y + 92, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 34, y + 92, 4, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    kick: "SPORT",
    head: "ENGLAND LEVEL T20 SERIES IN AUSTRALIA",
    body: "England beat Australia by eight wickets in the second T20, chasing 185 to square the five-match series at 1–1.",
    cap: "Second T20I",
    draw(x, y, w, h) {
      ctx.fillStyle = "#4e9b4e";
      ctx.fillRect(x, y, w, h);
      // outfield shading
      ctx.fillStyle = "#5cb05c";
      ctx.beginPath();
      ctx.ellipse(x + 150, y + 54, 140, 42, 0, 0, Math.PI * 2);
      ctx.fill();
      // pitch
      ctx.fillStyle = "#c9a86a";
      ctx.fillRect(x + 118, y + 16, 64, 64);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x + 128, y + 16, 4, 64);
      ctx.fillRect(x + 168, y + 16, 4, 64);
      // stumps
      ctx.fillStyle = "#f2e6b8";
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(x + 140 + i * 7, y + 20, 4, 12);
      }
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(x + 140 + i * 7, y + 68, 4, 12);
      }
      // bat
      ctx.fillStyle = "#d8c49a";
      ctx.save();
      ctx.translate(x + 210, y + 64);
      ctx.rotate(-0.6);
      ctx.fillRect(-6, -24, 12, 32);
      ctx.fillRect(-2, -36, 5, 14);
      ctx.restore();
      // ball
      ctx.fillStyle = "#c8102e";
      ctx.beginPath();
      ctx.arc(x + 92, y + 34, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x + 92, y + 34, 7, -0.6, 0.9);
      ctx.stroke();
    },
  },
];

const gridTop = 502;
const cellW = 300;
const cellGap = 28;
const rowH = 230;
const illH = 96;

stories.forEach((s, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const cx = MARGIN + col * (cellW + cellGap);
  const cy = gridTop + row * rowH;
  if (row === 1) {
    rule(cy - 12, 1);
  }
  s.draw(cx, cy, cellW, illH);
  frame(cx, cy, cellW, illH);
  kicker(s.kick, cx, cy + illH + 20);
  headline(s.head, cx, cy + illH + 40, 18, cellW, 22);
  deck(s.body, cx, cy + illH + 84, cellW, 13.5, 17);
});

// ---------- footer ----------

rule(976, 1);
ctx.fillStyle = GREY;
ctx.font = "13px 'Noto Sans'";
ctx.textAlign = "center";
ctx.fillText("THE WORLD TODAY  ·  WEDNESDAY 25 NOVEMBER 2026  ·  PAGE 1", W / 2, 998);

writeFileSync(join(here, "entry.png"), canvas.toBuffer("image/png"));
console.log("wrote entry.png");
