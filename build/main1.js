// 本編 スライド 1–14
const L = require('./lib');
const { VERSION, REPO_SHORT, T, F, DATA, REF, frame, sectionSlide, badge, txt, bullets, code, cite, card, arrow, line, seqRow, ssRow, numRow, label, drawStructure, arcs, table, eq, img, notes, charW, pairTable } = L;
const EX = DATA.ex, M = DATA.mutants;

module.exports = function (pres, opts = {}) {
  // 1 表紙
  {
    const s = pres.addSlide(); pres._n = 1; s.background = { color: T.primary };
    txt(s, 'ViennaRNA：RNA構造解析ソフトウェア', 0.8, 1.5, 8.0, 1.4, { fontSize: 40, bold: true, color: T.white, valign: 'middle' });
    txt(s, '二次構造の予測から inverse folding（配列設計）までを体験する', 0.8, 2.9, 8.4, 0.6, { fontSize: 19, color: 'DCE9EC' });
    txt(s, '分子ロボティクス夏の学校 2026\n講師：角 俊輔\n2026年10月8日（木）19:00–21:00（日本時間・Zoom）', 0.8, 4.3, 8.4, 1.6, { fontSize: 20, color: T.white, paraSpaceAfter: 6 });
    txt(s, '使用ソフトウェア：ViennaRNA 2.7.2（Python から import RNA）', 0.8, 5.85, 8.0, 0.45, { fontSize: 16, color: 'B7C8CC' });
    txt(s, `資料 ${VERSION}`, 0.8, 0.9, 4.0, 0.4, { fontSize: 16, color: 'B7C8CC' });
    txt(s, `資料・演習スクリプト：${REPO_SHORT}`, 0.8, 6.3, 8.4, 0.45, { fontSize: 16, color: T.white });
    txt(s, 'ここからダウンロードしてそのまま使えます（Code → Download ZIP、または git clone）', 0.8, 6.75, 8.4, 0.4, { fontSize: 14, color: 'DCE9EC' });
    drawStructure(s, EX.seq, EX.ss, EX.coords, { x: 9.3, y: 1.4, w: 3.4, h: 4.6 }, { r: 0.2, font: 14, pairColor: 'B7C8CC', numberEvery: 0, ends: false });
    txt(s, EX.seq, 9.3, 6.1, 3.4, 0.4, { fontFace: F.mono, fontSize: 16, color: 'DCE9EC', align: 'center' });
    s.addNotes(notes({ time: '1分', points: ['講習名・講師・日時の確認。録画は説明部分のみ行うことを最初に伝える。', '右の図は本日繰り返し使う16塩基のRNA（GGCGCAGAAAUGCGCC）。', '続く4枚は事前配布したインストール手順の再掲、その次の1枚は GitHub（資料の入手と Issues での質問）の案内。当日は動作確認のみ（演習1の準備で行う）。', 'スライド・演習スクリプトは GitHub で公開している（表紙下の URL）。資料の版は表紙と各ページ下に表示。'], refs: [REF.vrna, REF.pypi] }));
  }
  if (opts.afterCover) opts.afterCover(pres);
  // 2 到達目標
  {
    const s = frame(pres, { title: '今日の到達目標', num: 2, notes: notes({ time: '3分', points: ['最重要の到達点は「RNA設計で何ができるかを広く知り、基本操作を体験する」こと。', 'アルゴリズムの証明や実装の理解は主目的ではない（補足スライドで扱う）。', '同じ16塩基のRNAを予測→変異→設計→再予測と繰り返し使い、入力と出力の関係を追う。'], questions: ['RNAという言葉から何を思い浮かべますか（mRNA・ワクチン・センサーなど）。'], refs: [REF.vrna] }) });
    const items = [
      ['知る', ['RNA設計で「できること」の見取り図', 'スイッチ・ナノ構造などの実例', '予測と設計で何が分かり、何が分からないか']],
      ['読む', ['dot-bracket 表記で構造を読む', '自由エネルギーの意味と大きさ', 'MFE構造と構造集団（確率）の違い']],
      ['動かす', ['RNA.fold で構造を予測する', '一塩基を変えて結果を比べる', 'RNA.inverse_fold で配列を設計し再予測・比較する']],
    ];
    items.forEach(([t, b], k) => card(s, 0.55 + k * 4.1, 1.35, 3.9, 3.7, t, b, { size: 19, titleSize: 24 }));
    card(s, 0.55, 5.3, 12.2, 1.45, null, [{ text: '主目的ではないこと：動的計画法の証明、ソフトウェアの実装の理解、長いコードの手入力。必要な式と数値だけを扱い、細部は補足スライドとノートで支えます。', color: T.muted }], { size: 18, noBullet: true, fill: T.white });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.55, y: 5.3, w: 12.2, h: 1.45, fill: { type: 'none' }, line: { color: T.line, width: 1 } });
  }
  // 3 120分の進め方
  {
    const s = frame(pres, { title: '120分の進め方：説明と実習の時間配分', num: 3, notes: notes({ time: '2分', points: ['説明55分・実習55分・質疑10分。実習中もスライドは表示したままにする。', '説明部分は録画、質疑・グループ演習は録画停止。切替はスライドで案内する。', '演習は4グループ（各5〜6人）で、提出担当者が画面共有しながら進める。TAが各グループを支援する。環境が動かない人もグループの画面で参加できる。', '演習スライドには右上に「必須」「時間があれば」を表示してある。演習2は 2C まで届けば十分。', '補足扱いのスライド（DP、元論文、探索トレース）は本編では要点のみ話す。'], refs: [] }) });
    const rows = [['時刻', '内容', '分', '録画'],
      ['19:00–19:12', '到達目標とRNA設計の応用例', '12', '●'],
      ['19:12–19:30', '二次構造・エネルギー・MFE・DP（動的計画法）の直感', '18', '●'],
      ['19:30–19:45', '演習1：構造予測と配列変更', '15', '停止'],
      ['19:45–20:00', 'inverse folding と RNAinverse の仕組み', '15', '●'],
      ['20:00–20:40', '演習2：配列設計・再予測・候補比較（グループ）', '40', '停止'],
      ['20:40–20:50', '応用への展開・まとめ・提出課題', '10', '●'],
      ['20:50–21:00', '質疑応答', '10', '停止']];
    table(s, rows.map(r => r.map((c, i) => ({ text: c, align: i === 2 ? 'right' : (i === 3 ? 'center' : 'left') }))), 0.55, 1.35, 8.6, { colW: [1.9, 5.2, 0.7, 0.8], size: 17, zebra: true });
    card(s, 9.5, 1.35, 3.3, 2.0, '内訳', ['説明・まとめ 55分', '実習 55分', '質疑 10分'], { size: 18 });
    card(s, 9.5, 3.55, 3.3, 3.1, '進め方', ['同じ16塩基RNAを使い続ける', '短いコードを実行し、配列や目標構造だけを書き換える', '演習はグループで、提出担当者の画面共有で進める', '演習には「必須」「時間があれば」の表示あり'], { size: 14 });
  }
  // 4 応用の見取り図
  {
    const s = frame(pres, { title: 'RNA設計の応用：センサー、発現制御、触媒、ナノ構造', num: 4, notes: notes({ time: '4分', points: ['共通の考え方：配列が決まると（環境のもとで）構造が決まり、構造が機能を生む。設計はこの逆向き。', '4分野の例を紹介。今日扱うのは単一RNAの二次構造レベル（次の2枚で実例）。', 'アプタマー：標的分子に結合するRNA。リボスイッチ：代謝物結合で発現を変える天然RNA。リボザイム：触媒活性を持つRNA。'], questions: ['どの応用に興味がありますか。'], refs: [REF.green, REF.geary] }) });
    const q = [['センサー', ['アプタマー：小分子やタンパク質に結合', '結合で構造が変わり、蛍光や翻訳を切り替える'], 'E36414'],
      ['発現制御', ['リボスイッチ（天然）、toehold switch（人工）', '入力RNAの有無で翻訳ON/OFF'], '0F4C5C'],
      ['触媒', ['リボザイム：RNA自身が反応を触媒', 'ハンマーヘッド型、自己切断・連結'], '009E73'],
      ['ナノ構造', ['RNA origami：1本鎖が転写中に折れてタイルに', '分子の足場、細胞内で遺伝的に発現可能'], '7570B3']];
    q.forEach(([t, b, c], k) => { const x = 0.55 + (k % 2) * 4.3, y = 1.35 + Math.floor(k / 2) * 2.55; card(s, x, y, 4.15, 2.35, t, b, { size: 17, titleColor: c, titleSize: 22 }); });
    // 右側: 配列→構造→機能 の流れ
    const rx = 9.4; card(s, rx, 1.35, 3.4, 5.25, '共通の考え方', [], {});
    const chain = ['配列（A/C/G/U の並び）', '二次構造（どこが対合するか）', '立体構造・相互作用', '機能（結合・切替・触媒・形）'];
    chain.forEach((c, k) => { const y = 2.1 + k * 1.1; s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: rx + 0.25, y, w: 2.9, h: 0.62, fill: { color: k === 1 ? T.accentSoft : T.white }, line: { color: k === 1 ? T.accent : T.line, width: 1 }, rectRadius: 0.1 }); txt(s, c, rx + 0.35, y, 2.7, 0.62, { fontSize: 14, valign: 'middle', align: 'center' }); if (k < 3) arrow(s, rx + 1.7, y + 0.62, rx + 1.7, y + 1.1, { width: 1.5 }); });
    txt(s, '今日はこの層（二次構造）で予測と設計を行う', rx + 0.25, 6.05, 2.9, 0.5, { fontSize: 12, color: T.accent, align: 'center' });
  }
  // 5 toehold switch
  {
    const s = frame(pres, { title: '応用例：RNAスイッチ（toehold switch）は入力で働きを変える', num: 5, notes: notes({ time: '4分', points: ['スイッチRNAはヘアピンでRBS（リボソーム結合部位）と開始コドンAUGを隠し、翻訳をOFFにしている。', 'トリガーRNAが5′側の一本鎖部分（toehold）に結合し、鎖置換でヘアピンが開くと翻訳がONになる。', 'Green et al. 2014：168個の第1世代スイッチのON/OFF比平均は約43、改良版13個の平均は406。26個の直交（クロストーク<12%）セット。', '本スライドの左図は本講習用の模式図（塩基配列は実物ではない）。右下の図は論文のPMC著者原稿版に掲載の図の一部（図番号は誌面版と異なる可能性があるため、引用時は誌面版で確認）。'], questions: ['ONとOFFの2つの構造を「両方」設計する必要があるのはなぜか。'], refs: [REF.green, 'PMC版 https://pmc.ncbi.nlm.nih.gov/articles/PMC4265554/'] }) });
    const sc = DATA.schem.toehold; const n = sc.ss.length; const seqBlank = ' '.repeat(n);
    const hl = {}; for (let i = 1; i <= n; i++) hl[i] = i <= 8 ? T.accent : (i >= 19 && i <= 24 ? '009E73' : (i >= 35 ? '9AA8AE' : (i >= 31 && i <= 33 ? 'E69F00' : T.primary)));
    txt(s, 'OFF：スイッチRNA単独', 0.55, 1.25, 4.0, 0.4, { fontSize: 16, bold: true, color: T.primary });
    drawStructure(s, seqBlank, sc.ss, sc.coords, { x: 0.55, y: 1.7, w: 4.2, h: 3.9 }, { r: 0.11, font: 8, highlight: hl, numberEvery: 0, ends: false, pw: 1.5 });
    // 凡例
    const leg = [[T.accent, 'toehold（一本鎖）'], [T.primary, 'ステム'], ['009E73', 'RBS（ループ内に隠す）'], ['E69F00', 'AUG（ステム内）'], ['9AA8AE', '下流の遺伝子']];
    leg.forEach(([c, t], k) => { s.addShape(pres.shapes.OVAL, { x: 0.65, y: 5.75 + k * 0.26, w: 0.18, h: 0.18, fill: { color: c }, line: { color: c } }); txt(s, t, 0.9, 5.7 + k * 0.26, 3.5, 0.26, { fontSize: 11, color: T.muted, valign: 'middle' }); });
    // ON state cartoon
    txt(s, 'ON：トリガーRNAが結合して開く', 5.0, 1.25, 4.5, 0.4, { fontSize: 16, bold: true, color: T.primary });
    const x0 = 5.0, y1 = 2.4, y2 = 3.05, u = 0.19;
    for (let i = 0; i < 22; i++) { s.addShape(pres.shapes.OVAL, { x: x0 + i * u, y: y1, w: 0.16, h: 0.16, fill: { color: '8E44AD' }, line: { color: '8E44AD' } }); }
    txt(s, 'トリガーRNA', x0, y1 - 0.32, 2.0, 0.3, { fontSize: 11, color: '8E44AD' });
    for (let i = 0; i < 34; i++) { const c = i < 8 ? T.accent : (i >= 19 && i <= 24 ? '009E73' : (i >= 31 && i <= 33 ? 'E69F00' : T.primary)); s.addShape(pres.shapes.OVAL, { x: x0 + i * u, y: y2, w: 0.16, h: 0.16, fill: { color: c }, line: { color: c } }); if (i < 22) line(s, x0 + i * u + 0.08, y1 + 0.16, x0 + i * u + 0.08, y2, { color: T.line, width: 1 }); }
    for (let i = 34; i < 40; i++) s.addShape(pres.shapes.OVAL, { x: x0 + i * u, y: y2, w: 0.16, h: 0.16, fill: { color: '9AA8AE' }, line: { color: '9AA8AE' } });
    txt(s, 'RBS と AUG が露出 → リボソームが結合 → 翻訳 ON', x0, 3.4, 5.0, 0.4, { fontSize: 13, color: T.ink });
    bullets(s, ['スイッチRNA：ヘアピンで RBS と AUG を隠す（OFF）', 'トリガーRNA：toehold に結合し鎖置換で開く（ON）', '設計では OFF 構造と ON 複合体の両方を評価', 'ON/OFF 比：第1世代平均 約43、改良版平均 406', '直交セット：クロストーク12%未満が26系統'], 5.0, 4.0, 4.3, 2.9, { size: 15, gap: 4 });
    img(s, 'papers/green_f1_panelC.png', 9.5, 1.45, 3.3, 1.5);
    cite(s, 'Green, Silver, Collins, Yin (2014) Cell 159:925–939. 図はPMC著者原稿版（PMC4265554）掲載図の一部（第1世代スイッチの設計模式図）', 9.5, 3.0, 3.3, 1.1);
    card(s, 9.5, 4.2, 3.3, 2.5, 'ポイント', ['入力（トリガー）の有無で構造が変わる', '「構造が変わる」を設計するには2状態の評価が要る（本日は単一状態のみ）'], { size: 14 });
  }
  // 6 RNA origami
  {
    const s = frame(pres, { title: '応用例：RNAナノ構造（RNA origami）と分子の配置', num: 6, notes: notes({ time: '3分', points: ['Geary, Rothemund, Andersen (2014)：1本のRNA鎖が転写されながら折れてタイル状構造になる設計（single-stranded RNA origami）。', 'らせんを並べる架橋（クロスオーバー）と、ループ同士が対合するkissing loopという三次モチーフを使う。タイルは最大660塩基、タイルが六角格子に集合する。', '二次構造予測モデル（今日の範囲）はkissing loopのような擬似結び目・三次相互作用を扱わない。それでも各ヘアピン・ステムの設計には二次構造の予測と設計が使われる。', '図は同論文のSupplementary Materials Fig. S4（strand-path diagram）から。'], questions: ['DNAではなくRNAでナノ構造を作る利点は何か（細胞内で転写できる）。'], refs: [REF.geary, 'Supplementary Materials (CaltechAUTHORS) https://authors.library.caltech.edu/records/qh186-q5004'] }) });
    img(s, 'papers/geary_S4_2HAE.png', 0.55, 1.3, 6.4, 2.75);
    cite(s, 'Geary, Rothemund, Andersen (2014) Science 345:799–804, Supplementary Fig. S4 より（2ヘリックスタイル 2H-AE のstrand-path図。色は5′→3′の合成順）', 0.55, 4.05, 6.4, 0.6);
    // own flow
    const steps = ['1本鎖RNAを転写', '転写中に折れる', 'タイル状の構造', '格子に集合（AFMで観察）'];
    steps.forEach((t, k) => { const x = 0.55 + k * 1.62; s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 5.0, w: 1.45, h: 0.9, fill: { color: T.light }, line: { color: T.light }, rectRadius: 0.1 }); txt(s, t, x + 0.05, 5.0, 1.35, 0.9, { fontSize: 12, align: 'center', valign: 'middle' }); if (k < 3) arrow(s, x + 1.45, 5.45, x + 1.62, 5.45, { width: 1.5 }); });
    txt(s, '本講習用の流れ図（模式）', 0.55, 5.95, 6.4, 0.3, { fontSize: 11, color: T.muted });
    bullets(s, ['1本のRNA鎖が転写されながら折れる（cotranscriptional folding）', 'らせんを架橋する crossover と、ループ同士が対合する kissing loop を組み合わせる', 'タイルは最大 660 塩基。六角格子に自己集合', '遺伝子として細胞内で発現できるのがDNAナノ構造との違い', '二次構造予測は個々のステム・ヘアピン設計に使うが、kissing loop などの三次相互作用は別モデルが必要'], 7.3, 1.3, 5.5, 5.2, { size: 17, gap: 8 });
  }
  // 7 今日扱う設計問題
  {
    const s = frame(pres, { title: '今日扱う設計問題：単一RNAの目標二次構造に合う配列を探す', num: 7, notes: notes({ time: '3分', points: ['予測：配列を入れると構造（と自由エネルギー）が返る。設計：目標構造を入れると、それを最安定構造にもつ配列を探す。', '評価器は同じ予測プログラム。設計は予測を何度も呼ぶ探索。', '扱わないこと：複数状態、他の分子との相互作用、三次構造、実験での機能確認。まとめで再度触れる。'], questions: ['予測は答えが一つに決まるが、設計はなぜ複数の答えがあり得るか。'], refs: [REF.inv, REF.pyapi] }) });
    card(s, 0.55, 1.35, 5.9, 2.9, '予測（folding）', [], {});
    txt(s, '配列', 0.85, 2.0, 1.2, 0.4, { fontSize: 16, color: T.muted });
    seqRow(s, EX.seq, 0.85, 2.3, { size: 22 });
    arrow(s, 3.1, 2.95, 3.1, 3.35, { width: 2 });
    txt(s, 'RNA.fold', 3.3, 2.95, 2.5, 0.4, { fontSize: 14, fontFace: F.mono, color: T.accent, valign: 'middle' });
    ssRow(s, EX.ss, 0.85, 3.4, { size: 22 }); txt(s, `${EX.mfe.toFixed(2)} kcal/mol`, 4.2, 3.4, 2.2, 0.5, { fontSize: 16, color: T.muted, valign: 'middle' });
    card(s, 6.9, 1.35, 5.9, 2.9, '設計（inverse folding）', [], {});
    txt(s, '目標構造', 7.2, 2.0, 1.5, 0.4, { fontSize: 16, color: T.muted });
    ssRow(s, EX.ss, 7.2, 2.3, { size: 22 });
    arrow(s, 9.45, 2.95, 9.45, 3.35, { width: 2 });
    txt(s, 'RNA.inverse_fold', 9.65, 2.95, 3.0, 0.4, { fontSize: 14, fontFace: F.mono, color: T.accent, valign: 'middle' });
    seqRow(s, '??????????????? ?'.replace(' ', ''), 7.2, 3.4, { size: 22, plain: true });
    txt(s, '（複数の答え／答えなし）', 10.9, 3.4, 1.9, 0.5, { fontSize: 13, color: T.muted, valign: 'middle' });
    bullets(s, ['入力：目標二次構造 T（dot-bracket）。出力：予測構造が T に一致する配列 x', '評価器は予測プログラムそのもの。「配列を少し変えて再予測」を繰り返す探索', '距離 d(予測構造, T) が 0 になれば成功。0 にならないこともある'], 0.55, 4.5, 8.0, 2.2, { size: 18 });
    card(s, 8.8, 4.5, 4.0, 2.2, '今日は扱わない条件', ['複数の状態（ON/OFF）', '他の分子との相互作用', '三次構造・擬似結び目', '実験での機能確認'], { size: 15, fill: T.accentSoft, titleColor: T.accent });
  }
  // 8 配列と塩基対
  {
    const s = frame(pres, { title: 'RNAの配列と塩基対：A–U、G–C、G–U', num: 8, notes: notes({ time: '2分', points: ['RNAは4種の塩基 A, C, G, U が一本鎖として並ぶ（5′→3′の向き）。', '鎖が折り返して逆平行に並ぶと、向かい合う塩基が対合する。標準はA–U（水素結合2本）とG–C（3本）。G–Uはゆらぎ対で弱いが二次構造予測では許される。', '対合の安定さは水素結合の数だけで決まらない。隣り合う塩基対の重なり（スタッキング）が効く（スライド17）。'], questions: ['G–Cが多い配列は安定になりやすい。それだけで良い設計と言えるか（後で戻る）。'], refs: [REF.turner] }) });
    const bases = [['A', 'アデニン'], ['C', 'シトシン'], ['G', 'グアニン'], ['U', 'ウラシル']];
    bases.forEach(([b, nm], k) => { const x = 0.75 + k * 1.25; s.addText(b, { shape: pres.shapes.OVAL, x, y: 1.5, w: 0.8, h: 0.8, fill: { color: T.base[b] }, line: { color: T.white }, fontFace: F.mono, fontSize: 28, bold: true, color: T.white, align: 'center', valign: 'middle', margin: 0 }); txt(s, nm, x - 0.2, 2.35, 1.2, 0.35, { fontSize: 12, color: T.muted, align: 'center' }); });
    const pairs = [['A', 'U', '水素結合 2本', '標準（Watson–Crick）'], ['G', 'C', '水素結合 3本', '標準・最も安定'], ['G', 'U', 'ゆらぎ対（wobble）', '弱いが許される']];
    pairs.forEach(([a, b, t1, t2], k) => { const y = 3.0 + k * 1.2; s.addText(a, { shape: pres.shapes.OVAL, x: 0.75, y, w: 0.7, h: 0.7, fill: { color: T.base[a] }, line: { color: T.white }, fontFace: F.mono, fontSize: 24, bold: true, color: T.white, align: 'center', valign: 'middle', margin: 0 }); line(s, 1.45, y + 0.35, 2.15, y + 0.35, { color: T.pair, width: 3 }); s.addText(b, { shape: pres.shapes.OVAL, x: 2.15, y, w: 0.7, h: 0.7, fill: { color: T.base[b] }, line: { color: T.white }, fontFace: F.mono, fontSize: 24, bold: true, color: T.white, align: 'center', valign: 'middle', margin: 0 }); txt(s, t1, 3.05, y, 2.6, 0.7, { fontSize: 18, valign: 'middle' }); txt(s, t2, 5.6, y, 2.1, 0.7, { fontSize: 14, color: T.muted, valign: 'middle' }); });
    // antiparallel duplex example
    card(s, 7.8, 1.35, 5.0, 5.35, '逆平行に並んで対合する', [], {});
    const top = 'GGCGCA', bot = 'UGCGCC'; const ux = 8.3, uy = 2.4, u = 0.62;
    txt(s, "5'", ux - 0.4, uy, 0.4, 0.5, { fontSize: 14, valign: 'middle' }); txt(s, "3'", ux + 6 * u + 0.05, uy, 0.4, 0.5, { fontSize: 14, valign: 'middle' });
    txt(s, "3'", ux - 0.4, uy + 1.5, 0.4, 0.5, { fontSize: 14, valign: 'middle' }); txt(s, "5'", ux + 6 * u + 0.05, uy + 1.5, 0.4, 0.5, { fontSize: 14, valign: 'middle' });
    for (let i = 0; i < 6; i++) { const a = top[i], b = bot[5 - i]; s.addText(a, { shape: pres.shapes.OVAL, x: ux + i * u, y: uy, w: 0.5, h: 0.5, fill: { color: T.base[a] }, line: { color: T.white }, fontFace: F.mono, fontSize: 16, bold: true, color: T.white, align: 'center', valign: 'middle', margin: 0 }); s.addText(b, { shape: pres.shapes.OVAL, x: ux + i * u, y: uy + 1.5, w: 0.5, h: 0.5, fill: { color: T.base[b] }, line: { color: T.white }, fontFace: F.mono, fontSize: 16, bold: true, color: T.white, align: 'center', valign: 'middle', margin: 0 }); line(s, ux + i * u + 0.25, uy + 0.5, ux + i * u + 0.25, uy + 1.5, { color: T.pair, width: 2.5 }); }
    txt(s, '例題RNAの1–6番（上）と11–16番（下）。上の鎖は5′→3′、下の鎖は3′→5′に読む。1番のGは16番のCと、6番のAは11番のUと対合する。', 8.1, 4.5, 4.5, 1.2, { fontSize: 14, color: T.ink });
    txt(s, '塩基対の安定さ：水素結合＋隣の塩基対との重なり（スタッキング）', 8.1, 5.75, 4.5, 0.8, { fontSize: 14, color: T.accent });
  }
  // 9 dot-bracket 小問
  {
    const s = frame(pres, { title: 'dot-bracket 表記：配列と構造を対応させて読む', num: 9, notes: notes({ time: '3分', points: ['同じ長さの2行：上が配列、下が構造。"(" は5′側、")" は3′側の対合、"." は非対合。括弧は内側から順に対応する（入れ子）。', '小問の答え：(1) 3番のCは14番のGと対合。(2) ループは7–10番の4塩基（GAAA）。(3) 塩基対は6個。(4) 1番のGは16番のCと対合。', '次のスライドの図で答えを確認する。'], questions: ['小問1〜3を各自30秒で。'], refs: [REF.pyapi] }) });
    card(s, 0.55, 1.35, 12.2, 2.55, null, [], { fill: T.light });
    numRow(s, 16, 0.85, 1.5, { size: 30 }); seqRow(s, EX.seq, 0.85, 1.95, { size: 30 }); ssRow(s, EX.ss, 0.85, 2.55, { size: 30 });
    txt(s, '配列（5′→3′）', 7.3, 1.95, 3.0, 0.55, { fontSize: 16, color: T.muted, valign: 'middle' }); txt(s, '構造（dot-bracket）', 7.3, 2.55, 3.0, 0.55, { fontSize: 16, color: T.muted, valign: 'middle' });
    txt(s, `MFE = ${EX.mfe.toFixed(2)} kcal/mol`, 10.0, 1.95, 2.7, 0.55, { fontSize: 16, color: T.ink, valign: 'middle' });
    txt(s, '読み方：( と ) は対合する2つの塩基、. は対合しない塩基。括弧は内側から順に対応（入れ子）', 0.85, 3.25, 11.6, 0.5, { fontSize: 15, color: T.ink });
    card(s, 0.55, 4.15, 5.9, 2.6, '小問（30秒）', ['3番目の C はどの番号の塩基と対合しているか', 'ループ（対合しない部分）は何番から何番か', '塩基対は何個あるか'], { size: 18 });
    card(s, 6.75, 4.15, 6.0, 2.6, 'ヒント', ['括弧を内側から対応させる：6番の ( と 11番の )', 'その外側：5番と12番、4番と13番、…', '対応する2文字は同じ色の位置で対合できる文字か確かめる（G–C, A–U, G–U）'], { size: 16 });
  }
  // 10 二次構造の要素
  {
    const EL = DATA.elements; const n = EL.seq.length; const pt = pairTable(EL.ss);
    const s = frame(pres, { title: '二次構造の要素：ステム、ヘアピン、バルジ、内部ループ、分岐', num: 10, notes: notes({ time: '3分', points: ['ステム（らせん）：連続した塩基対。ヘアピンループ：1つの塩基対で閉じる非対合領域。バルジ：片側だけに非対合塩基。内部ループ：両側に非対合塩基。多分岐ループ：3本以上のステムが集まる。外部ループ：どの塩基対にも囲まれない末端側。', 'ViennaRNAのエネルギーモデルはこの「ループ」の単位で自由エネルギーを足し合わせる（次々スライド）。', `図の53塩基RNAは RNAinverse で設計した教材用配列（MFE構造が図の通りになることを確認済み。P(構造)=${EL.p}）。`, '前のスライドの小問の答え：3番Cは14番Gと対合、ループは7–10番、塩基対は6個。'], refs: [REF.lorenz, REF.turner] }) });
    const lc = {};
    EL.loops.forEach(Lp => { if (Lp.type === 'exterior') { Lp.positions.forEach(p => { if (pt[p - 1] === -1) lc[p] = T.loop.exterior; }); return; } const [i, j] = Lp.closing; const inner = Lp.inner; for (let p = i + 1; p < j; p++) { if (inner.some(([k, l]) => p >= k && p <= l)) continue; lc[p] = T.loop[Lp.type]; } });
    drawStructure(s, EL.seq, EL.ss, EL.coords, { x: 0.4, y: 1.2, w: 7.6, h: 5.7 }, { r: 0.14, font: 9, colorBy: 'loop', loopColor: lc, numberEvery: 0, numSize: 9, pw: 2 });
    const leg = [['stack', 'ステム（連続した塩基対）'], ['hairpin', 'ヘアピンループ'], ['bulge', 'バルジ（片側のみ非対合）'], ['interior', '内部ループ（両側に非対合）'], ['multiloop', '多分岐ループ（3本のステムが集合）'], ['exterior', '外部ループ（5′/3′末端側）']];
    leg.forEach(([k, t], i) => { const y = 1.5 + i * 0.55; s.addShape(pres.shapes.OVAL, { x: 8.4, y: y + 0.08, w: 0.32, h: 0.32, fill: { color: T.loop[k] }, line: { color: T.white } }); txt(s, t, 8.85, y, 3.9, 0.48, { fontSize: 16, valign: 'middle' }); });
    txt(s, '配列（53塩基）と構造', 8.4, 5.0, 4.0, 0.35, { fontSize: 12, color: T.muted });
    txt(s, EL.seq.slice(0, 27) + '\n' + EL.seq.slice(27) + '\n' + EL.ss.slice(0, 27) + '\n' + EL.ss.slice(27), 8.4, 5.35, 4.4, 1.4, { fontFace: F.mono, fontSize: 12, color: T.ink });
  }
  // 11 自由エネルギーと安定性
  {
    const s = frame(pres, { title: '自由エネルギーと安定性：同じ条件で構造を比較する', num: 11, notes: notes({ time: '3分', points: ['同じ配列がとりうる構造ごとに自由エネルギー ΔG（kcal/mol）を計算できる。負に大きいほど安定。開いた鎖（対合なし）が基準の 0。', '比較は同じ条件（温度37 ℃、Turner 2004 パラメータ、同じプログラム）で行う。数値の絶対値より差に意味がある。', 'MFE（minimum free energy）構造 = 最も低い ΔG の構造。ただし他の構造も一定の割合で存在する（スライド18）。', `右の確率 P は分配関数から計算した各構造の出現確率（合計は 1）。`], questions: ['末端の1対が外れただけで 2.3 kcal/mol 上がるのはなぜか（スタッキング1つ分が失われる）。'], refs: [REF.turner, REF.lorenz] }) });
    const rows = [['構造（同じ配列 ' + EX.seq + '）', 'ΔG (kcal/mol)', '確率 P']].concat(DATA.stability.map(r => [{ text: r.ss, mono: true }, { text: r.e.toFixed(1), align: 'right' }, { text: r.p < 0.001 ? '< 0.001' : r.p.toFixed(3), align: 'right' }]));
    table(s, rows, 0.55, 1.35, 7.6, { colW: [4.6, 1.6, 1.4], size: 16, zebra: true });
    // energy ladder
    const lx = 9.6, ly0 = 1.5, ly1 = 6.4; line(s, lx, ly0, lx, ly1, { color: T.ink, width: 1.5 });
    const toY = e => ly0 + (0 - e) / 11.5 * (ly1 - ly0);
    [0, -2, -4, -6, -8, -10].forEach(e => { line(s, lx - 0.08, toY(e), lx, toY(e), { color: T.ink, width: 1 }); txt(s, String(e), lx - 0.6, toY(e) - 0.15, 0.5, 0.3, { fontSize: 11, color: T.muted, align: 'right' }); });
    txt(s, 'ΔG (kcal/mol)', lx - 0.7, ly0 - 0.45, 1.6, 0.35, { fontSize: 11, color: T.muted });
    DATA.stability.forEach((r, k) => { const y = toY(r.e); const col = k === 0 ? T.accent : T.primary; line(s, lx, y, lx + 0.35, y, { color: col, width: 2 }); txt(s, r.ss, lx + 0.45, y - 0.13, 3.0, 0.28, { fontFace: F.mono, fontSize: 11, color: col }); });
    txt(s, '最安定（MFE）', lx + 0.45, toY(-10.2) + 0.15, 2.0, 0.3, { fontSize: 11, color: T.accent });
    txt(s, '条件：37 ℃、Turner 2004 パラメータ、ViennaRNA 2.7.2', 0.55, 6.55, 8.0, 0.35, { fontSize: 13, color: T.muted });
  }
  // 12 エネルギーモデル
  {
    const s = frame(pres, { title: 'エネルギーモデル：スタッキングとループの寄与', num: 12, notes: notes({ time: '4分', points: ['最近接塩基対（nearest neighbor）モデル：構造をループに分解し、各ループの自由エネルギーを足す。ステム内では隣接する2つの塩基対の「重なり」（スタッキング）が負の寄与、ヘアピンなどのループは正の寄与。', `例題RNA：スタッキング5個（−3.3, −3.4, −2.4, −3.4, −2.1）とヘアピン（+4.4）の合計が −10.2 kcal/mol。値は fold_compound.eval_loop_pt で取得。`, '塩基対の本数が同じでも、塩基対の種類と並びで大きく変わる（右表：6対の同じ形でも −1.2 から −11.7）。', 'パラメータは実験（融解曲線）から決めたもの（Turner 2004）。'], questions: ['G–Cを増やせば安定になる。設計でそれが常に良いとは限らない理由は？（他の構造も安定化しうる／実験上の扱いにくさ）'], refs: [REF.turner, REF.lorenz] }) });
    const st = drawStructure(s, EX.seq, EX.ss, EX.coords, { x: 0.5, y: 1.25, w: 3.6, h: 5.3 }, { r: 0.2, font: 13, numberEvery: 0 });
    // stack labels at midpoints between pair lines
    const pt = pairTable(EX.ss);
    EX.loops.filter(l => l.type === 'stack').forEach(l => { const [i, j] = l.closing; const [k, m] = l.inner[0]; const p1 = st.P(i - 1), p2 = st.P(j - 1), p3 = st.P(k - 1), p4 = st.P(m - 1); const cx = (p1[0] + p2[0] + p3[0] + p4[0]) / 4, cy = (p1[1] + p2[1] + p3[1] + p4[1]) / 4; txt(s, l.energy.toFixed(1), cx - 0.35, cy - 0.12, 0.7, 0.24, { fontSize: 11, bold: true, color: T.primary, align: 'center', valign: 'middle' }); });
    const hp = EX.loops.find(l => l.type === 'hairpin'); { const [i, j] = hp.closing; let cx = 0, cy = 0; for (let p = i; p <= j; p++) { const q = st.P(p - 1); cx += q[0]; cy += q[1]; } cx /= (j - i + 1); cy /= (j - i + 1); txt(s, '+' + hp.energy.toFixed(1), cx - 0.4, cy - 0.12, 0.8, 0.24, { fontSize: 11, bold: true, color: T.accent, align: 'center', valign: 'middle' }); }
    txt(s, 'スタッキング（各 −2.1〜−3.4）', 0.6, 6.55, 3.4, 0.3, { fontSize: 11, color: T.primary });
    // equation + decomposition table
    eq(s, 'eq_energy', 4.4, 1.35, { h: 0.75 });
    txt(s, '構造 S の自由エネルギーは、S をループに分解した各ループの寄与 ΔG(L) の和', 4.4, 2.2, 5.0, 0.6, { fontSize: 14, color: T.muted });
    const rows = [['ループ', '内容', 'ΔG']].concat(EX.loops.filter(l => l.type !== 'exterior').map(l => [l.type === 'stack' ? 'スタッキング' : 'ヘアピン', { text: l.type === 'stack' ? `(${l.closing[0]},${l.closing[1]}) と (${l.inner[0][0]},${l.inner[0][1]})` : `(${l.closing[0]},${l.closing[1]}) が閉じる 4 塩基ループ`, mono: false }, { text: (l.energy > 0 ? '+' : '') + l.energy.toFixed(1), align: 'right' }])).concat([[{ text: '合計', bold: true }, { text: 'MFE', bold: true }, { text: EX.mfe.toFixed(1), align: 'right', bold: true }]]);
    table(s, rows, 4.4, 2.85, 4.6, { colW: [1.5, 2.3, 0.8], size: 13, zebra: true });
    card(s, 9.3, 1.35, 3.5, 5.3, '本数が同じでも違う', [], {});
    DATA.au_compare.forEach((r, k) => { const y = 2.1 + k * 1.45; txt(s, r.seq, 9.5, y, 3.2, 0.4, { fontFace: F.mono, fontSize: 15, bold: true }); txt(s, r.ss, 9.5, y + 0.38, 3.2, 0.35, { fontFace: F.mono, fontSize: 15, color: T.primary }); txt(s, `6 対　ΔG = ${r.e.toFixed(1)} kcal/mol`, 9.5, y + 0.75, 3.2, 0.4, { fontSize: 14, color: k === 1 ? T.accent : T.ink }); });
    txt(s, '同じ形（6対＋4塩基ループ）でも、A–U だけなら −1.2、G–C だけなら −11.7', 9.5, 6.05, 3.2, 0.6, { fontSize: 12, color: T.muted });
  }
  // 13 MFE構造と構造集団
  {
    const G = M.G2C;
    const s = frame(pres, { title: 'MFE構造と構造集団：一つの予測構造だけでは分からないこと', num: 13, notes: notes({ time: '4分', points: ['RNA分子は溶液中で多数の構造を行き来する。各構造 S の出現確率はボルツマン分布 P(S)=exp(−E(S)/RT)/Z（分配関数 Z は全構造の和、McCaskill 1990）。', `例題RNAでは MFE 構造の確率が ${EX.p_mfe}（他の構造は合計約 9%）。2番目のGをCに変えた配列では MFE 構造の確率は ${G.p_mfe} にすぎず、ほぼ同じ確率の構造が複数ある。MFE構造だけを見ると「決まった構造」に見えるが実際は揺らいでいる。`, `塩基対確率 p_ij（個々の塩基対が存在する確率）と、構造全体の確率 P(S) は別物。G2C変異体では p(4,13)=0.997 だが P(MFE構造)=${G.p_mfe}。設計で「目標構造の確率」と言うときは P(T) を指す。`, '弧の太さは塩基対確率。RT = 0.616 kcal/mol（37 ℃）。'], questions: ['確率 0.38 の「予測構造」は信用できるか。どう報告すべきか。'], refs: [REF.mccaskill, REF.lorenz, REF.pyapi] }) });
    const colX = [0.55, 6.75]; const two = [['例題RNA', EX.seq, EX.ss, EX.p_mfe, EX.subopt, EX.bpp], ['2番目を G→C に変えた配列', G.seq, G.ss, G.p_mfe, G.subopt, G.bpp]];
    two.forEach(([t, sq, ss, p, sub, bpp], k) => {
      const x = colX[k]; txt(s, t, x, 1.25, 6.0, 0.4, { fontSize: 18, bold: true, color: k ? T.accent : T.primary });
      const u = charW(24);
      arcs(s, 16, bpp, x + 0.1, 3.05, u, {});
      seqRow(s, sq, x + 0.1, 3.05, { size: 24 }); ssRow(s, ss, x + 0.1, 3.5, { size: 24 });
      txt(s, `MFE 構造の確率 P = ${p.toFixed(3)}`, x + 3.2, 3.5, 2.8, 0.45, { fontSize: 15, valign: 'middle', color: k ? T.accent : T.primary });
      const rows = [['構造', 'ΔG', 'P']].concat(sub.slice(0, 4).map(r => [{ text: r.ss, mono: true }, { text: r.e.toFixed(1), align: 'right' }, { text: r.p.toFixed(3), align: 'right' }]));
      table(s, rows, x, 4.1, 5.9, { colW: [3.6, 1.1, 1.2], size: 13, zebra: true });
    });
    txt(s, '弧の太さ＝塩基対確率 p_ij', 2.2, 1.3, 3.5, 0.35, { fontSize: 12, color: T.muted });
    eq(s, 'eq_boltz', 0.55, 6.15, { h: 0.6 });
    txt(s, '構造全体の確率 P(S) と、個々の塩基対の確率 p_ij は別物：右では p(4,13)=0.997 でも P(MFE構造)=' + G.p_mfe, 5.0, 6.15, 7.8, 0.65, { fontSize: 14, color: T.ink, valign: 'middle' });
  }
  // 14 DP の考え方
  {
    const C = DATA.counts;
    const s = frame(pres, { title: 'DP（動的計画法）の考え方：区間の計算結果を再利用する', num: 14, notes: notes({ time: '1分（補足扱い。本編は要点のみ）', points: ['本編では「候補が多すぎて全部は試せない → 短い区間の答えを使い回して速く解く」の1点だけ伝えて次へ進む。以下は質問が出たとき・時間に余裕があるときの説明。', '構造の候補は配列長とともに爆発的に増える（数値は計算で数えたもの。16塩基の例題RNAで塩基対規則を満たす構造は347通り、任意対合なら30塩基で約2.4億、100塩基で約10^33）。全部を試すのは不可能。', '動的計画法（DP）：短い区間 [i, j] の最良値（最小エネルギー）を表に保存し、長い区間はその組み合わせで求める。区間 [i, j] は「i が非対合」か「i が k と対合し、内側 [i+1, k−1] と外側 [k+1, j] に分かれる」のどちらか。', 'ViennaRNA はこの考え方をループ単位のエネルギーモデルに合わせて拡張（Zuker–Stiegler 型、計算量 O(n³)）。塩基対数を最大化する教材用の Nussinov 法とは別物（補足）。', '「DPを逆向きに解けば設計になる」わけではない（設計は探索問題）。'], refs: [REF.zuker, REF.hofacker, REF.lorenz, REF.nussinov] }) });
    badge(s, '補足扱い：本編は要点のみ', { w: 2.9, color: T.muted });
    card(s, 0.55, 1.35, 4.6, 5.35, '候補の数（列挙は不可能）', [], {});
    const rows = [['配列長', '構造の数'], ['16（例題RNA、対合規則あり）', '347'], ['16（任意の対合）', '5,223'], ['30（任意の対合）', '約 2.4 × 10⁸'], ['50（任意の対合）', '約 1.8 × 10¹⁵'], ['100（任意の対合）', '約 6 × 10³²']];
    table(s, rows.map(r => r.map((c, i) => ({ text: c, align: i ? 'right' : 'left' }))), 0.75, 2.05, 4.2, { colW: [2.6, 1.6], size: 13, zebra: true });
    txt(s, '擬似結び目なし・最小ループ3塩基で数えた値', 0.75, 4.6, 4.2, 0.4, { fontSize: 11, color: T.muted });
    txt(s, '→ 短い区間の答えを使い回す', 0.75, 5.2, 4.2, 0.5, { fontSize: 16, bold: true, color: T.accent });
    // diagram of interval decomposition
    const dx = 5.5, dy = 1.5, u = 0.42; const n = 16;
    txt(s, '区間 [i, j] の最良値は、より短い区間の最良値から決まる', dx, 1.3, 7.3, 0.4, { fontSize: 16, bold: true, color: T.primary });
    const drawRow = (y, marks, caption) => {
      for (let k = 0; k < n; k++) { const m = marks[k] || {}; s.addShape(pres.shapes.RECTANGLE, { x: dx + k * u, y, w: u - 0.04, h: 0.36, fill: { color: m.fill || T.light }, line: { color: T.line, width: 0.5 } }); if (m.t) txt(s, m.t, dx + k * u, y, u - 0.04, 0.36, { fontSize: 10, align: 'center', valign: 'middle', color: T.white, bold: true }); }
      txt(s, caption, dx, y + 0.42, 7.3, 0.4, { fontSize: 13, color: T.ink });
    };
    const i = 3, j = 13;
    const base = {}; for (let k = i; k <= j; k++) base[k] = { fill: T.tint }; base[i] = { fill: T.primary, t: 'i' }; base[j] = { fill: T.primary, t: 'j' };
    drawRow(dy + 0.45, base, '区間 [i, j]（求めたい）');
    const c1 = Object.assign({}, base); c1[i] = { fill: T.muted, t: 'i' }; drawRow(dy + 1.5, c1, '場合1：i が対合しない → [i+1, j] の答えをそのまま使う');
    const c2 = {}; for (let k = i; k <= j; k++) c2[k] = { fill: T.tint }; const kk = 8; c2[i] = { fill: T.accent, t: 'i' }; c2[kk] = { fill: T.accent, t: 'k' }; c2[j] = { fill: T.primary, t: 'j' }; for (let k = i + 1; k < kk; k++) c2[k] = { fill: 'F6C9A8' }; drawRow(dy + 2.95, c2, '場合2：i が k と対合 → 内側 [i+1, k−1] と外側 [k+1, j] の答えを足す（k を全部試す）');
    arcs(s, n, [[i + 1, kk + 1, 1]], dx, dy + 2.95, u, { fixed: true, flat: true, width: 2, color: T.accent });
    txt(s, '短い区間から順に表を埋めると、長さ n の配列の最良構造が n³ 程度の手間で求まる（ViennaRNA はループ単位のエネルギーで同じ考え方を使う）', dx, dy + 4.0, 7.3, 0.9, { fontSize: 14, color: T.ink });
    txt(s, '注意：予測の DP を「逆向きに解く」と設計になるわけではない。設計は予測を評価器に使う探索（次の節）', dx, dy + 4.9, 7.3, 0.7, { fontSize: 13, color: T.accent });
  }
};
