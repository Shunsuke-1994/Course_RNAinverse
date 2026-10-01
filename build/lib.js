// 共通テーマ・描画ヘルパー (pptxgenjs)
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));
const EQ = JSON.parse(fs.readFileSync(path.join(__dirname, 'fig', 'equations.json'), 'utf8'));

// 資料のバージョン・公開先・出力ファイル名（ここだけ変えれば全体に反映）
const VERSION = 'v2.0';
const REPO = 'https://github.com/Shunsuke-1994/Course_RNAinverse';
const REPO_SHORT = 'github.com/Shunsuke-1994/Course_RNAinverse';
const NAMES = { main: `ViennaRNA_講習_${VERSION}`, install: `ViennaRNA_講習_事前準備_インストール手順_${VERSION}` };

const T = {
  ink: '1F2A30', primary: '0F4C5C', primaryDark: '0A3540', accent: 'E36414', accentSoft: 'FBE9DC',
  muted: '5C6B73', light: 'EEF3F4', line: 'C9D3D6', white: 'FFFFFF', code: 'F6F8F9', tint: 'D9E7EA',
  base: { A: 'E69F00', C: '56B4E9', G: '009E73', U: 'CC79A7', N: '9AA8AE' },
  loop: { hairpin: 'E36414', stack: '9AA8AE', bulge: '8E44AD', interior: 'C2185B', multiloop: 'E69F00', exterior: '5C6B73' },
  pair: '0F4C5C', backbone: 'A7B4BA',
};
const F = { jp: 'Meiryo', mono: 'Consolas' };
const W = 13.333, H = 7.5;

// ---------- スライド枠 ----------
function frame(pres, opts) {
  const s = pres.addSlide(); pres._n = (pres._n || 0) + 1; opts = Object.assign({}, opts, { num: pres._n });
  s.background = { color: T.white };
  if (opts.title) {
    s.addText(opts.title, { x: 0.55, y: 0.28, w: 12.2, h: 0.75, fontFace: F.jp, fontSize: 28, bold: true, color: T.primary, margin: 0, valign: 'middle', isTextBox: true });
  }
  const tag = (opts.tag || 'ViennaRNA 講習 2026-10-08') + `　資料 ${VERSION}`;
  s.addText(tag, { x: 0.55, y: 7.05, w: 6, h: 0.3, fontFace: F.jp, fontSize: 11, color: T.muted, margin: 0, isTextBox: true });
  if (opts.num !== undefined) s.addText(String(opts.num), { x: 12.0, y: 7.05, w: 0.8, h: 0.3, fontFace: F.jp, fontSize: 11, color: T.muted, align: 'right', margin: 0, isTextBox: true });
  if (opts.notes) s.addNotes(opts.notes);
  return s;
}
// 録画切替などの案内スライド (濃色)
function sectionSlide(pres, opts) {
  const s = pres.addSlide(); pres._n = (pres._n || 0) + 1; opts = Object.assign({}, opts, { num: pres._n });
  s.background = { color: T.primary };
  s.addShape(pres.shapes.OVAL, { x: 0.9, y: 2.55, w: 1.5, h: 1.5, fill: { color: opts.stop ? T.accent : '2E8B57' }, line: { color: T.white, width: 2 } });
  s.addText(opts.stop ? '■' : '●', { x: 0.9, y: 2.55, w: 1.5, h: 1.5, fontFace: F.jp, fontSize: 40, color: T.white, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
  s.addText(opts.title, { x: 2.9, y: 2.2, w: 9.8, h: 1.0, fontFace: F.jp, fontSize: 36, bold: true, color: T.white, margin: 0, valign: 'middle', isTextBox: true });
  s.addText(opts.body, { x: 2.9, y: 3.3, w: 9.8, h: 2.2, fontFace: F.jp, fontSize: 22, color: 'E6EEF0', margin: 0, valign: 'top', isTextBox: true, paraSpaceAfter: 6 });
  if (opts.num !== undefined) s.addText(String(opts.num), { x: 12.0, y: 7.05, w: 0.8, h: 0.3, fontFace: F.jp, fontSize: 11, color: 'B7C8CC', align: 'right', margin: 0, isTextBox: true });
  if (opts.notes) s.addNotes(opts.notes);
  return s;
}

// 右上の区分バッジ（必須／時間があれば／補足扱い など）
function badge(s, text, o = {}) {
  const w = o.w || 2.4, x = 13.333 - 0.55 - w;
  s.addText(text, { x, y: 0.06, w, h: 0.3, fontFace: F.jp, fontSize: 12, bold: true, color: T.white, align: 'center', valign: 'middle', margin: 0, isTextBox: true, shape: s._pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.08, fill: { color: o.color || T.primary } });
}

// ---------- テキスト ----------
function txt(s, str, x, y, w, h, o = {}) {
  s.addText(str, Object.assign({ x, y, w, h, fontFace: F.jp, fontSize: 24, color: T.ink, margin: 0, valign: 'top', isTextBox: true }, o));
}
function bullets(s, items, x, y, w, h, o = {}) {
  const size = o.size || 24;
  const runs = items.map((it, k) => {
    const isObj = typeof it === 'object';
    const text = isObj ? it.text : it;
    const opt = { bullet: isObj && it.sub ? { indent: 18 } : true, fontSize: isObj && it.sub ? size - 4 : size, breakLine: k < items.length - 1, paraSpaceAfter: o.gap || 8, color: (isObj && it.color) || o.color || T.ink, bold: isObj && !!it.bold };
    if (isObj && it.sub) opt.indentLevel = 1;
    return { text, options: opt };
  });
  s.addText(runs, { x, y, w, h, fontFace: F.jp, margin: 0, valign: 'top', isTextBox: true, fit: 'shrink' });
}
function code(s, str, x, y, w, h, o = {}) {
  const size = o.size || 18;
  s.addShape(s._pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: T.code }, line: { color: T.line, width: 0.75 } });
  const lines = str.split('\n');
  const runs = [];
  lines.forEach((ln, k) => {
    const isComment = /^\s*#/.test(ln);
    const isOut = /^\s*>>>|^\s*# 出力/.test(ln);
    runs.push({ text: ln.length ? ln : ' ', options: { color: isComment ? T.muted : (o.color || T.ink), breakLine: k < lines.length - 1, fontSize: size, italic: isComment } });
  });
  s.addText(runs, { x: x + 0.12, y: y + 0.08, w: w - 0.24, h: h - 0.16, fontFace: F.mono, margin: 0, valign: 'top', isTextBox: true, lineSpacingMultiple: 1.05 });
}
function cite(s, str, x, y, w, h = 0.35) {
  s.addText(str, { x, y, w, h, fontFace: F.jp, fontSize: 12, color: T.muted, margin: 0, valign: 'bottom', isTextBox: true });
}
function card(s, x, y, w, h, title, body, o = {}) {
  s.addShape(s._pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: o.fill || T.light }, line: { color: o.fill || T.light, width: 0 }, rectRadius: 0.12 });
  if (title) s.addText(title, { x: x + 0.2, y: y + 0.12, w: w - 0.4, h: 0.45, fontFace: F.jp, fontSize: o.titleSize || 20, bold: true, color: o.titleColor || T.primary, margin: 0, valign: 'middle', isTextBox: true });
  if (body && body.length) {
    const runs = body.map((b, k) => ({ text: typeof b === 'string' ? b : b.text, options: { bullet: o.noBullet ? false : true, breakLine: k < body.length - 1, paraSpaceAfter: 4, fontSize: o.size || 18, color: (typeof b === 'object' && b.color) || T.ink, bold: typeof b === 'object' && !!b.bold, fontFace: (typeof b === 'object' && b.mono) ? F.mono : F.jp } }));
    s.addText(runs, { x: x + 0.2, y: y + (title ? 0.62 : 0.15), w: w - 0.4, h: h - (title ? 0.75 : 0.3), fontFace: F.jp, margin: 0, valign: 'top', isTextBox: true, fit: 'shrink' });
  }
}
function arrow(s, x1, y1, x2, y2, o = {}) {
  const x = Math.min(x1, x2), y = Math.min(y1, y2), w = Math.max(Math.abs(x2 - x1), 0.01), h = Math.max(Math.abs(y2 - y1), 0.01);
  const flipH = (x1 < x2) !== (y1 < y2) && Math.abs(y2 - y1) > 0.001 && Math.abs(x2 - x1) > 0.001;
  const opt = { x, y, w, h, line: { color: o.color || T.primary, width: o.width || 2, endArrowType: o.noHead ? undefined : 'triangle' } };
  if (flipH) opt.flipH = true;
  if (x1 > x2 && Math.abs(y2 - y1) <= 0.001) opt.flipH = true; // 左向き水平
  if (y1 > y2 && Math.abs(x2 - x1) <= 0.001) opt.flipV = true; // 上向き垂直
  s.addShape(s._pres.shapes.LINE, opt);
}
function line(s, x1, y1, x2, y2, o = {}) { arrow(s, x1, y1, x2, y2, Object.assign({ noHead: true }, o)); }

// ---------- 配列・構造の等幅表示 ----------
function charW(size) { return size * 0.55 / 72; }   // Consolas の概略幅 (inch)
function seqRow(s, seq, x, y, o = {}) {
  const size = o.size || 26, hl = o.highlight || {};
  const runs = seq.split('').map((c, i) => {
    const pos = i + 1; const base = c.toUpperCase();
    const opt = { color: o.plain ? T.ink : (T.base[base] || T.ink), bold: true, fontSize: size };
    if (hl[pos]) { opt.highlight = hl[pos]; }
    if (o.dim && o.dim.includes(pos)) opt.color = T.line;
    return { text: c, options: opt };
  });
  s.addText(runs, { x, y, w: seq.length * charW(size) + 0.3, h: size / 72 * 1.5, fontFace: F.mono, margin: 0, valign: 'middle', isTextBox: true, charSpacing: 0 });
}
function ssRow(s, ss, x, y, o = {}) {
  const size = o.size || 26, hl = o.highlight || {};
  const runs = ss.split('').map((c, i) => {
    const pos = i + 1;
    const opt = { color: c === '.' ? T.muted : (o.color || T.primary), bold: true, fontSize: size };
    if (hl[pos]) opt.highlight = hl[pos];
    return { text: c, options: opt };
  });
  s.addText(runs, { x, y, w: ss.length * charW(size) + 0.3, h: size / 72 * 1.5, fontFace: F.mono, margin: 0, valign: 'middle', isTextBox: true });
}
function numRow(s, n, x, y, o = {}) {
  // 番号は小さい文字なので、1 つずつ該当する塩基の列の中央に置く（同じ文字数で並べると列がずれる）
  const size = o.size || 26; const ticks = o.ticks || [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50].filter(t => t <= n);
  const cw = charW(size), h = size / 72 * 1.4;
  ticks.forEach(t => s.addText(String(t), { x: x + (t - 0.5) * cw - 0.3, y, w: 0.6, h, fontFace: F.mono, fontSize: size * 0.6, color: T.muted, align: 'center', margin: 0, valign: 'middle', isTextBox: true }));
}
function label(s, str, x, y, w, o = {}) {
  s.addText(str, Object.assign({ x, y, w, h: 0.4, fontFace: F.jp, fontSize: 16, color: T.muted, margin: 0, valign: 'middle', isTextBox: true }, o));
}

// ---------- 二次構造図 (図形で描画; 編集可能) ----------
function pairTable(ss) { const st = [], pt = Array(ss.length).fill(-1); ss.split('').forEach((c, i) => { if (c === '(') st.push(i); else if (c === ')') { const j = st.pop(); pt[i] = j; pt[j] = i; } }); return pt; }
function drawStructure(s, seq, ss, coords, box, o = {}) {
  const n = seq.length, pt = pairTable(ss);
  const xs = coords.map(c => c[0]), ys = coords.map(c => -c[1]);
  const minx = Math.min(...xs), maxx = Math.max(...xs), miny = Math.min(...ys), maxy = Math.max(...ys);
  const r = o.r || 0.17; const pad = r + 0.05;
  const sc = Math.min((box.w - 2 * pad) / Math.max(maxx - minx, 1e-6), (box.h - 2 * pad) / Math.max(maxy - miny, 1e-6));
  const ox = box.x + (box.w - (maxx - minx) * sc) / 2 - minx * sc, oy = box.y + (box.h - (maxy - miny) * sc) / 2 - miny * sc;
  const P = i => [ox + xs[i] * sc, oy + ys[i] * sc];
  const cx = (box.x + box.w / 2), cy = (box.y + box.h / 2);
  for (let i = 0; i < n - 1; i++) { const [x1, y1] = P(i), [x2, y2] = P(i + 1); line(s, x1, y1, x2, y2, { color: T.backbone, width: o.bbw || 1.5 }); }
  for (let i = 0; i < n; i++) if (pt[i] > i) { const [x1, y1] = P(i), [x2, y2] = P(pt[i]); line(s, x1, y1, x2, y2, { color: o.pairColor || T.pair, width: o.pw || 2.5 }); }
  const loopColor = o.loopColor || {};
  for (let i = 0; i < n; i++) {
    const [x, y] = P(i); const b = seq[i].toUpperCase();
    let fill = o.colorBy === 'loop' ? (loopColor[i + 1] || T.loop.stack) : (T.base[b] || T.base.N);
    if (o.highlight && o.highlight[i + 1]) fill = o.highlight[i + 1];
    s.addText(seq[i], { shape: s._pres.shapes.OVAL, x: x - r, y: y - r, w: 2 * r, h: 2 * r, fill: { color: fill }, line: { color: T.white, width: 0.75 }, fontFace: F.mono, fontSize: o.font || 13, bold: true, color: T.white, align: 'center', valign: 'middle', margin: 0 });
  }
  const every = o.numberEvery === undefined ? 5 : o.numberEvery;
  if (every) for (let i = 0; i < n; i++) if ((i + 1) % every === 0 || i === 0 || i === n - 1) {
    const [x, y] = P(i); let dx = x - cx, dy = y - cy; const L = Math.hypot(dx, dy) || 1; dx /= L; dy /= L;
    if (o.numOut) { const nb = pt[i] >= 0 ? P(pt[i]) : null; if (nb) { dx = x - nb[0]; dy = y - nb[1]; const L2 = Math.hypot(dx, dy) || 1; dx /= L2; dy /= L2; } }
    s.addText(String(i + 1), { x: x + dx * (r + 0.16) - 0.25, y: y + dy * (r + 0.16) - 0.13, w: 0.5, h: 0.26, fontFace: F.jp, fontSize: o.numSize || 10, color: T.muted, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
  }
  if (o.ends !== false) {
    // 末端が塩基対を組んでいれば相手と反対側、組んでいなければ鎖を延長した向きに置く
    // （図の中心から外向きにすると、両端が上にある構造でタイトルにかぶる）
    const outward = i => { const [x, y] = P(i); const j = pt[i] >= 0 ? pt[i] : (i === 0 ? 1 : n - 2); const [xj, yj] = P(j); const L = Math.hypot(x - xj, y - yj) || 1; return [x, y, (x - xj) / L, (y - yj) / L]; };
    [[0, "5'"], [n - 1, "3'"]].forEach(([i, lab]) => { const [x, y, dx, dy] = outward(i); s.addText(lab, { x: x + dx * (r + 0.22) - 0.25, y: y + dy * (r + 0.22) - 0.15, w: 0.5, h: 0.3, fontFace: F.jp, fontSize: 12, bold: true, color: T.ink, align: 'center', valign: 'middle', margin: 0, isTextBox: true }); });
  }
  return { P, sc, r };
}
// 弧図 (塩基対確率など): 配列行の上に半円
function arcs(s, n, pairs, x, y, unit, o = {}) {
  pairs.forEach(([i, j, p]) => {
    const left = x + (i - 0.5) * unit, right = x + (j - 0.5) * unit, w = right - left;
    const width = o.fixed ? (o.width || 2) : (0.75 + p * 4);
    const hh = o.flat ? w * 0.4 : w;
    s.addShape(s._pres.shapes.ARC, { x: left, y: y - hh / 2, w, h: hh, angleRange: [180, 360], line: { color: o.color || T.primary, width, transparency: o.fixed ? 0 : Math.round((1 - Math.min(1, 0.25 + p)) * 60) }, fill: { type: 'none' } });
  });
}

// ---------- 表 ----------
function table(s, rows, x, y, w, o = {}) {
  const size = o.size || 16;
  const data = rows.map((r, ri) => r.map((c, ci) => {
    const obj = typeof c === 'object' && c !== null ? c : { text: String(c) };
    const opt = { fontFace: obj.mono ? F.mono : F.jp, fontSize: obj.size || size, color: obj.color || T.ink, bold: !!obj.bold || (ri === 0 && o.header !== false), align: obj.align || (o.align && o.align[ci]) || 'left', valign: 'middle', margin: [3, 6, 3, 6] };
    if (ri === 0 && o.header !== false) { opt.fill = { color: T.tint }; opt.color = T.primaryDark; }
    else if (obj.fill) opt.fill = { color: obj.fill };
    else if (o.zebra && ri % 2 === 0) opt.fill = { color: T.light };
    return { text: obj.text, options: opt };
  }));
  const opt = { x, y, w, colW: o.colW, fontFace: F.jp, fontSize: size, border: { type: 'solid', color: T.line, pt: 0.75 }, autoPage: false };
  if (o.rowH) opt.rowH = o.rowH;
  s.addTable(data, opt);
}

// ---------- 画像 ----------
function eq(s, key, x, y, o = {}) {
  const info = EQ[key]; const aspect = info.w / info.h;
  let w = o.w, h = o.h; if (w && !h) h = w / aspect; if (h && !w) w = h * aspect;
  s.addImage({ path: path.join(__dirname, 'fig', key + '.png'), x, y, w, h });
  return { w, h };
}
function img(s, rel, x, y, w, h) { s.addImage({ path: path.join(__dirname, rel), x, y, w, h, sizing: { type: 'contain', w, h } }); }

// ---------- 演習用 4 枠 ----------
function exBoxes(s, b, y, o = {}) {
  const h = o.h || 1.55, w = 2.95, gap = 0.12, x0 = 0.55;
  const items = [['変更する入力', b.input], ['操作', b.ops], ['確認する出力', b.output], ['考える問い', b.question]];
  items.forEach(([t, body], k) => card(s, x0 + k * (w + gap), y, w, h, t, body, { size: o.size || 15, titleSize: 17, fill: k === 3 ? T.accentSoft : T.light, titleColor: k === 3 ? T.accent : T.primary }));
}

// ---------- ノート ----------
function notes(o) {
  const L = [];
  if (o.time) L.push(`【所要時間】${o.time}`);
  if (o.points) { L.push('【説明の要点】'); o.points.forEach(p => L.push('・' + p)); }
  if (o.questions) { L.push('【受講者への問い】'); o.questions.forEach(p => L.push('・' + p)); }
  if (o.extra) { L.push('【補足・注意】'); o.extra.forEach(p => L.push('・' + p)); }
  if (o.refs) { L.push('【参照】'); o.refs.forEach(p => L.push('・' + p)); }
  return L.join('\n');
}
const REF = {
  vrna: 'ViennaRNA 公式 https://www.tbi.univie.ac.at/RNA/',
  pyapi: 'Python API https://viennarna.readthedocs.io/en/latest/api_python.html',
  inv: 'RNAinverse マニュアル https://viennarna.readthedocs.io/en/latest/man/RNAinverse.html',
  invtut: 'RNAinverse チュートリアル (doc/source/tutorial/RNAinverse.rst, GitHub ViennaRNA/ViennaRNA)',
  src: 'ソース: src/ViennaRNA/inverse/inverse.c (v2.7.2, https://github.com/ViennaRNA/ViennaRNA)',
  lorenz: 'Lorenz R. et al. (2011) ViennaRNA Package 2.0. Algorithms Mol Biol 6:26. https://doi.org/10.1186/1748-7188-6-26',
  hofacker: 'Hofacker I.L. et al. (1994) Fast folding and comparison of RNA secondary structures. Monatsh Chem 125:167–188. https://doi.org/10.1007/BF00818163',
  green: 'Green A.A., Silver P.A., Collins J.J., Yin P. (2014) Toehold switches: de-novo-designed regulators of gene expression. Cell 159:925–939. https://doi.org/10.1016/j.cell.2014.10.002 (PMC4265554)',
  geary: 'Geary C., Rothemund P.W.K., Andersen E.S. (2014) A single-stranded architecture for cotranscriptional folding of RNA nanostructures. Science 345:799–804. https://doi.org/10.1126/science.1253920',
  turner: 'Mathews D.H. et al. (2004) PNAS 101:7287–7292 (Turner 2004 パラメータ); Turner & Mathews (2010) NNDB, Nucleic Acids Res 38:D280. https://rna.urmc.rochester.edu/NNDB/',
  mccaskill: 'McCaskill J.S. (1990) Biopolymers 29:1105–1119 (分配関数アルゴリズム)',
  zuker: 'Zuker M., Stiegler P. (1981) Nucleic Acids Res 9:133–148 (熱力学的 DP)',
  nussinov: 'Nussinov R. et al. (1978) SIAM J Appl Math 35:68–82 (塩基対数最大化)',
  pypi: 'PyPI viennarna https://pypi.org/project/ViennaRNA/ (使用: 2.7.2)',
  uv: 'uv https://docs.astral.sh/uv/',
};
module.exports = { VERSION, REPO, REPO_SHORT, NAMES, T, F, W, H, DATA, EQ, REF, frame, sectionSlide, badge, txt, bullets, code, cite, card, arrow, line, seqRow, ssRow, numRow, label, drawStructure, arcs, table, eq, img, exBoxes, notes, charW, pairTable };
