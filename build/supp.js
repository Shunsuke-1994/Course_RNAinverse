// 補足スライド（任意）
const L = require('./lib');
const { T, F, DATA, REF, frame, txt, bullets, code, cite, card, arrow, line, seqRow, ssRow, numRow, drawStructure, arcs, table, eq, img, notes, charW, pairTable } = L;
const EX = DATA.ex, M = DATA.mutants, E2 = DATA.ex2, ST = DATA.stats, NC = DATA.nussinov_counter;
const SUP = '補足（任意）';
module.exports = function (pres) {
  let n = 0;
  // S1 Nussinov
  {
    const s = frame(pres, { title: '補足1：Nussinov 法（塩基対数の最大化）と熱力学モデルの違い', num: n++, tag: SUP, notes: notes({ time: '任意（本編には含めない）', points: ['Nussinov らの教材モデル：塩基対の数を最大化する。表 N(i,j) は区間 [i,j] の最大塩基対数。漸化式は「i 非対合」「j 非対合」「i–j 対合」「分割」の 4 通り。計算量 O(n³)。', `例：${NC.seq} では最大 ${NC.nussinov_pairs} 対の構造 ${NC.nussinov_ss} が得られるが、その自由エネルギーは +${NC.e_of_nussinov} kcal/mol と不安定。ViennaRNA の MFE 構造は ${NC.mfe_ss}（${NC.mfe_pairs} 対、${NC.mfe} kcal/mol）。`, '塩基対の数ではなく、スタッキングとループの自由エネルギーの和を最小化するのが熱力学モデル（Zuker–Stiegler 1981、ViennaRNA）。', '表は Python で計算（build/compute.py の nussinov 関数、最小ループ 3、G–U を許容）。'], refs: [REF.nussinov, REF.zuker, REF.hofacker] }) });
    eq(s, 'eq_nussinov', 0.55, 1.3, { w: 9.4 });
    txt(s, 'δ_ij = 1（i と j が対合できる、j−i>3）、0（それ以外）', 10.1, 1.3, 2.7, 0.6, { fontSize: 11, color: T.muted });
    const seq = NC.seq, N = NC.table, len = seq.length;
    const rows = [['', ...seq.split('').map((c, i) => ({ text: `${c}`, color: T.base[c], bold: true, align: 'center' }))]];
    for (let i = 0; i < len; i++) rows.push([{ text: `${seq[i]}${i + 1}`, bold: true, color: T.base[seq[i]] }, ...Array.from({ length: len }, (_, j) => ({ text: j > i ? String(N[i][j]) : '', align: 'center', fill: j > i ? (N[i][j] === 0 ? T.white : ['E8F1F2', 'CFE3E6', 'B5D3D8', '9CC3CA', '82B3BC', '69A3AE'][Math.min(5, N[i][j])]) : 'F6F8F9' }))]);
    table(s, rows, 0.55, 2.0, 8.3, { colW: [0.6, ...Array(len).fill(0.48)], size: 8, header: true, rowH: 0.24 });
    card(s, 9.1, 2.0, 3.7, 4.6, '同じ配列で比べる', [{ text: seq, mono: true }, { text: '最大塩基対数の構造', bold: true }, { text: NC.nussinov_ss, mono: true }, { text: `${NC.nussinov_pairs} 対、ΔG = +${NC.e_of_nussinov} kcal/mol（不安定）`, color: T.accent }, { text: 'ViennaRNA の MFE 構造', bold: true }, { text: NC.mfe_ss, mono: true }, { text: `${NC.mfe_pairs} 対、ΔG = ${NC.mfe} kcal/mol` }, { text: '本数が多い ≠ 安定。孤立した塩基対や小さいループはエネルギー的に不利' }], { size: 12, noBullet: true });
    txt(s, '表：N(i, j)（上三角）。右上 N(1,16) が全体の最大塩基対数', 0.55, 6.15, 8.3, 0.4, { fontSize: 11, color: T.muted });
  }
  // S2 thermodynamic DP
  {
    const s = frame(pres, { title: '補足2：ViennaRNA の熱力学的 DP（Zuker 型の漸化式）', num: n++, tag: SUP, notes: notes({ time: '任意', points: ['F_ij：区間 [i,j] の最小自由エネルギー（外部ループ扱い）。C_ij：i と j が対合しているときの最小エネルギー。M, M1：多分岐ループ内部の補助配列。', 'C の 3 項は「ヘアピン H」「内部ループ/バルジ/スタッキング I（k,l を内側の対）」「多分岐ループ（a, b, c は線形近似の定数）」に対応。ループ単位のエネルギー（スライド 16）がここに入る。', '内部ループの大きさを制限（既定 30）して O(n³) 時間、O(n²) 記憶。分配関数版（McCaskill）は min を和、+ を積に置き換えたもの。', '式の記法は Lorenz et al. 2011 / Hofacker et al. 1994 に準拠（簡略化）。'], refs: [REF.hofacker, REF.lorenz, REF.zuker, REF.mccaskill] }) });
    const ks = ['eq_zuker_F', 'eq_zuker_C', 'eq_zuker_M', 'eq_zuker_M1'];
    const cap = ['外部ループ：i が非対合か、i–k の対合で分割', 'i–j が閉じるループ：ヘアピン／内部ループ（スタッキングを含む）／多分岐', '多分岐ループの内部（最初の分岐を含む）', '多分岐ループの内部（ちょうど 1 本の分岐）'];
    let y = 1.3; ks.forEach((k, i) => { const r = eq(s, k, 0.55, y, k === 'eq_zuker_C' ? { w: 8.7 } : (k === 'eq_zuker_M' ? { w: 8.2 } : { h: 0.6 })); txt(s, cap[i], 9.4, y, 3.4, r.h, { fontSize: 12, color: T.muted, valign: 'middle' }); y += r.h + 0.3; });
    card(s, 0.55, y + 0.05, 12.2, 6.75 - y, '読み方', ['H(i,j)：ヘアピンのエネルギー、I(i,j;k,l)：内部ループ（k=i+1, l=j−1 ならスタッキング）、a, b, c：多分岐ループの定数', '短い区間から埋めていく点は Nussinov と同じ。違いは「何を最小化するか」（塩基対数ではなくループ単位の自由エネルギー）', '分配関数（確率）版は min→和、+→積（McCaskill 1990）'], { size: 13 });
  }
  // S3 partition function
  {
    const G = M.G2C;
    const s = frame(pres, { title: '補足3：分配関数と構造確率（McCaskill 1990）', num: n++, tag: SUP, notes: notes({ time: '任意', points: ['分配関数 Z は全構造のボルツマン因子の和。構造 S の確率は exp(−E(S)/RT)/Z。集団の自由エネルギー G_ens = −RT ln Z は MFE より少し低い（例題RNA：−10.26 vs −10.20）。', '塩基対確率 p_ij は (i,j) を含む構造の確率の和。ドットプロット（右上三角）で表示するのが RNAfold -p の慣例（Lorenz 2011 Fig. 1A）。', '集団欠陥 ED(T)：集団からランダムに構造を引いたときに目標 T と食い違う塩基の平均割合。NUPACK などの設計目的関数。例題RNAでは 0.012。', 'ViennaRNA：fold_compound.pf(), bpp(), pr_structure(), ensemble_defect()。'], refs: [REF.mccaskill, REF.lorenz, REF.pyapi] }) });
    eq(s, 'eq_boltz', 0.55, 1.3, { h: 0.7 }); eq(s, 'eq_bpp', 5.2, 1.3, { h: 0.55 }); eq(s, 'eq_G', 8.2, 1.3, { h: 0.5 });
    eq(s, 'eq_ed', 0.55, 2.2, { h: 0.6 }); txt(s, '集団欠陥（ensemble defect）：q_i は i が非対合である確率', 6.2, 2.2, 6.5, 0.6, { fontSize: 13, color: T.muted, valign: 'middle' });
    // native dot plot for G2C
    const dx = 0.7, dy = 3.05, u = 0.2, seq = G.seq;
    txt(s, `ドットプロット：${seq}（2番目を C に変えた配列）`, 0.55, 2.85, 6.0, 0.3, { fontSize: 11, color: T.muted });
    for (let k = 0; k < 16; k++) { txt(s, seq[k], dx + 0.3 + k * u, dy, u, 0.2, { fontFace: F.mono, fontSize: 8, color: T.base[seq[k]], align: 'center', bold: true }); txt(s, seq[k], dx, dy + 0.25 + k * u, 0.25, u, { fontFace: F.mono, fontSize: 8, color: T.base[seq[k]], align: 'center', bold: true, valign: 'middle' }); }
    s.addShape(pres.shapes.RECTANGLE, { x: dx + 0.3, y: dy + 0.25, w: 16 * u, h: 16 * u, fill: { color: T.white }, line: { color: T.line, width: 0.75 } });
    line(s, dx + 0.3, dy + 0.25, dx + 0.3 + 16 * u, dy + 0.25 + 16 * u, { color: T.line, width: 0.5 });
    G.bpp.forEach(([i, j, p]) => { const sz = Math.max(0.03, Math.sqrt(p) * u * 0.9); s.addShape(pres.shapes.RECTANGLE, { x: dx + 0.3 + (j - 1) * u + (u - sz) / 2, y: dy + 0.25 + (i - 1) * u + (u - sz) / 2, w: sz, h: sz, fill: { color: T.primary }, line: { color: T.primary } }); });
    const pt = pairTable(G.ss); for (let i = 0; i < 16; i++) if (pt[i] > i) { const sz = u * 0.9; s.addShape(pres.shapes.RECTANGLE, { x: dx + 0.3 + i * u + (u - sz) / 2, y: dy + 0.25 + pt[i] * u + (u - sz) / 2, w: sz, h: sz, fill: { color: T.accent }, line: { color: T.accent } }); }
    txt(s, '右上：塩基対確率 p_ij（面積 ∝ p）　左下：MFE 構造の塩基対', dx, dy + 0.25 + 16 * u + 0.05, 4.2, 0.35, { fontSize: 10, color: T.muted });
    card(s, 5.2, 3.0, 7.6, 3.7, '例題RNAと G2C 変異体の比較', [], {});
    const rows = [['', '例題RNA', 'G2C 変異体'], ['MFE 構造', { text: EX.ss, mono: true }, { text: G.ss, mono: true }], ['MFE (kcal/mol)', EX.mfe.toFixed(2), G.e.toFixed(2)], ['G_ens = −RT ln Z', EX.G.toFixed(2), G.G.toFixed(2)], ['P(MFE 構造)', EX.p_mfe.toFixed(3), G.p_mfe.toFixed(3)], ['集団欠陥 ED(MFE構造)', EX.ensemble_defect.toFixed(3), '—'], ['最大の p_ij', '1.000 (2,15)', '0.998 (5,12)']];
    table(s, rows.map((r, i) => r.map(c => typeof c === 'object' ? c : { text: c, bold: i === 0 })), 5.4, 3.65, 7.2, { colW: [2.4, 2.4, 2.4], size: 12, zebra: true });
    txt(s, 'ViennaRNA: fc.pf(), fc.bpp(), fc.pr_structure(T), fc.ensemble_defect(T)。RNAfold -p の出力（ドットプロット・mountain plot）は Lorenz et al. 2011 Fig. 1A を参照', 5.4, 6.05, 7.2, 0.6, { fontSize: 11, color: T.muted });
  }
  // S4 RNAinverse implementation
  {
    const s = frame(pres, { title: '補足4：RNAinverse の実装詳細（v2.7.2 inverse.c）', num: n++, tag: SUP, notes: notes({ time: '任意', points: ['以下は src/ViennaRNA/inverse/inverse.c（v2.7.2 タグと master で同一）を読んで確認した内容。', '論文（Hofacker et al. 1994 第4節）との対応：構造距離は論文では任意（第5節の木編集距離など）だが実装は塩基対距離（TDIST=0）。論文の「正しく対合していない位置に限定」オプションは実装では既定（w1/w2 リスト）。論文は改善なしで停止して新しい初期配列からやり直すと述べるが、ライブラリ関数は距離を返して終了し、繰り返しは CLI の -R や呼び出し側が行う。同点時のエネルギー差（cost2）による判定は論文には記載がない。部分構造から順に解く流れ（Fig. 5）は aux_struct/WALK に対応。', 'make_start：目標の各塩基対 (i,j) について、start の文字が対合できなければ片側（乱数で選択、小文字側は固定）を対合可能な文字に置換。', 'aux_struct と WALK：目標構造をステム単位（連続塩基対の最外対を [ ] で印）に分け、ヘアピンを閉じるステムから外側へ、部分構造ごとに adaptive_walk を実行。give_up=1 なら部分構造で失敗した時点で打ち切り。', 'adaptive_walk（MFE モード）：予測構造と目標のペアテーブルを比較し、w1 = 食い違う位置（非対合または対の 3′ 側）、w2 = その隣接位置。各リストをシャッフルし w1→w2 の順に試す。非対合位置は symbolset（AUGC）の他の文字、対合位置は pairset（AU, UA, GC, CG, GU, UG のうち pair 行列で許されるもの）を順に試し、cost（塩基対距離）が下がった最初の変異を採用。', '同点処理：cost が同じで cost2 = E(target) − E_mfe が小さくなる変異を string2 に記憶し、改善がなければ採用（nc2 をカウント）。改善も同点も無ければ停止。', '返り値：MFE モードは最後に走らせた部分構造の塩基対距離（0 なら成功）。ドキュメントの「エネルギー差」という記述はソースと一致しない。', 'pf モード（inverse_pf_fold）：cost = E(target) − F_ens − final_cost = −RT ln P(target) − final_cost。dangles は一時的に 2 に固定。候補位置は固定されていない非対合位置と対の 5′ 側すべて（シャッフル）。分割探索はしない。', 'Python API：inverse_fold(start, target) は [配列, cost] を返す。引数 start の Python 文字列は C 側で上書きされる。N は置換されない（CLI の RNAinverse.c が行う処理）。give_up, symbolset, final_cost は RNA.cvar で設定可能。'], refs: [REF.src, REF.inv, REF.hofacker] }) });
    const left = ['初期配列の整合化（make_start）：目標の各塩基対が対合できない文字なら片側を置換。小文字側は固定', '部分構造の利用（aux_struct / WALK）：ステム単位に分け、ヘアピン側から外側へ順に adaptive_walk。give_up=1 で早期打ち切り', '変異位置：予測と目標が食い違う位置（非対合または対の 3′ 側）→ その隣接位置の順。各リストは乱数で並べ替え', '変異の種類：非対合位置は AUGC の他の文字、対合位置は許される塩基対（AU/UA/GC/CG/GU/UG）をペアごとに置換'];
    const right = ['評価：cost = 予測構造と目標の塩基対距離（bp_distance）。改善した最初の変異を採用（first improvement）', '同点時：cost2 = E(目標構造) − E_MFE が小さくなる変異を記憶し、改善がなければ採用', '停止：cost = 0 で成功。改善も同点改善も無ければ停止し、cost（>0）を返す', 'pf モード：cost = E(目標) − G_ens = −RT ln P(目標)。dangles=2 固定、分割探索なし、全非固定位置が候補'];
    card(s, 0.55, 1.3, 6.0, 4.0, 'MFE モード（inverse_fold）', left, { size: 13 });
    card(s, 6.8, 1.3, 6.0, 4.0, '評価・同点・停止・pf モード', right, { size: 13 });
    card(s, 0.55, 5.45, 12.2, 1.25, 'Python API の注意（2.7.2 で確認）', ['inverse_fold(start, target) → [配列, cost]。引数 start の文字列オブジェクトが C 側で上書きされる（控えを取る）', 'N は置換されない（CLI のみの処理）。小文字は固定。RNA.cvar.give_up / symbolset / final_cost で挙動を変更可'], { size: 12, fill: T.accentSoft, titleColor: T.accent });
  }
  // S5 MFE vs probability objective
  {
    const s = frame(pres, { title: '補足5：MFE 目的と確率目的の違い', num: n++, tag: SUP, notes: notes({ time: '任意', points: ['MFE 目的（inverse_fold）：予測構造 = 目標 になれば終了。目標構造の確率は問わないため、P(T) は 0.5〜0.94 とばらつく（seed 1〜5）。40 回試行では 0.23〜0.82。', '確率目的（inverse_pf_fold）：−RT ln P(T) を下げ続ける。結果は G–C の多い配列（GC 94%）で P(T) ≈ 0.976 に収束。局所最適で停止するため P(T) は 1 にならない。', 'どちらが良いかは用途次第：GC の多い配列は安定だが合成・転写・二量体化などで扱いにくい場合がある。', '別の目的関数：集団欠陥 ED（NUPACK）。ViennaRNA には fc.ensemble_defect がある。'], refs: [REF.inv, REF.src, 'Zadeh J.N. et al. (2011) NUPACK. J Comput Chem 32:170–173'] }) });
    eq(s, 'eq_inverse', 0.55, 1.3, { h: 0.55 }); txt(s, 'MFE 目的：予測構造と目標の距離を 0 にする', 5.6, 1.3, 7.0, 0.55, { fontSize: 14, color: T.muted, valign: 'middle' });
    eq(s, 'eq_inverse_pf', 0.55, 2.0, { h: 0.6 }); txt(s, '確率目的：目標構造の確率を最大化', 9.4, 2.0, 3.4, 0.6, { fontSize: 14, color: T.muted, valign: 'middle' });
    const rows = [['目的', 'seed', '設計配列', 'ΔG', 'GC', 'P(T)']].concat(E2.runs.map(r => [{ text: 'MFE' }, { text: String(r.seed), align: 'center' }, { text: r.seq, mono: true }, { text: r.e.toFixed(1), align: 'right' }, { text: Math.round(r.gc * 100) + '%', align: 'right' }, { text: r.p_target.toFixed(3), align: 'right', bold: true }])).concat(E2.pf_runs.map(r => [{ text: '確率' }, { text: String(r.seed), align: 'center' }, { text: r.seq, mono: true }, { text: r.e.toFixed(1), align: 'right' }, { text: Math.round(r.gc * 100) + '%', align: 'right', color: T.accent }, { text: r.p_target.toFixed(3), align: 'right', bold: true, color: '009E73' }]));
    table(s, rows, 0.55, 2.85, 8.0, { colW: [0.9, 0.7, 2.9, 0.9, 0.9, 1.7], size: 12, zebra: true });
    card(s, 8.8, 2.85, 4.0, 3.85, '読み方', ['MFE 目的は d = 0 で止まるため P(T) が低い候補も混じる', '確率目的は G–C を増やして P(T) ≈ 0.98 に到達（GC 94%）', 'GC が多い配列は安定だが、合成・転写・二量体化で扱いにくいことがある', '目的関数の選択が設計結果を決める', '原論文 Fig. 7（tRNA-Phe）でも -Fm は 0.03〜0.09、-Fp は 0.84〜0.86 と同じ傾向'], { size: 12 });
  }
  // S6 constraints & temperature
  {
    const s = frame(pres, { title: '補足6：固定塩基などの制約と温度', num: n++, tag: SUP, notes: notes({ time: '任意', points: ['小文字の位置は固定される（make_start でも adaptive_walk でも変異されない）。ループを gaaa に固定した 3 例はすべて成功。', 'Python API では N などのワイルドカードは置換されない：N を含む初期配列を渡すと N がそのまま残る（表の例）。A/C/G/U で初期配列を作る。', '温度：fold_compound(seq, md) の md.temperature で確率計算の温度を変えられる。設計そのものを別温度で行うには RNA.cvar.temperature（旧 API のグローバル）を設定する。', '同じ配列でも温度が上がると目標構造の確率は下がる。例題RNAは 60 ℃ でも 0.84 だが、設計配列（seed=4）は 0.21 まで落ち、MFE 構造も変わる。'], refs: [REF.inv, REF.pyapi, REF.src] }) });
    const rows1 = [['seed', '初期配列（小文字 = 固定）', '設計配列', 'd', 'P(T)']].concat(DATA.fixed_runs.map(r => [{ text: String(r.seed), align: 'center' }, { text: r.start, mono: true }, { text: r.seq, mono: true }, { text: String(r.bpd), align: 'right' }, { text: r.p_target.toFixed(3), align: 'right' }]));
    txt(s, 'A. 小文字で塩基を固定（ループを gaaa に）', 0.55, 1.25, 7.0, 0.35, { fontSize: 15, bold: true, color: T.primary });
    table(s, rows1, 0.55, 1.65, 7.6, { colW: [0.6, 2.7, 2.7, 0.5, 1.1], size: 12, zebra: true });
    txt(s, 'B. N は置換されない（Python API）', 0.55, 3.35, 7.0, 0.35, { fontSize: 15, bold: true, color: T.primary });
    code(s, `RNA.inverse_fold("${DATA.n_wildcard_example.start}", target)\n# → ${DATA.n_wildcard_example.result}   ループの N がそのまま残る`, 0.55, 3.75, 7.6, 0.95, { size: 12 });
    txt(s, 'C. 温度と目標構造の確率 P(T)', 0.55, 4.85, 7.0, 0.35, { fontSize: 15, bold: true, color: T.primary });
    const te = E2.temperature_ex; const rows2 = [['配列', '25 ℃', '37 ℃', '50 ℃', '60 ℃'], [{ text: te.seq + '（例題）', mono: true }, te.p25.toFixed(2), te.p37.toFixed(2), te.p50.toFixed(2), te.p60.toFixed(2)]].concat(E2.temperature.slice(0, 4).map(r => [{ text: r.seq, mono: true }, r.p25.toFixed(2), r.p37.toFixed(2), r.p50.toFixed(2), { text: r.p60.toFixed(2), color: r.p60 < 0.3 ? T.accent : T.ink }]));
    table(s, rows2.map((r, i) => r.map((c, j) => typeof c === 'object' ? c : { text: c, align: j ? 'right' : 'left', bold: i === 0 })), 0.55, 5.25, 7.6, { colW: [3.6, 1.0, 1.0, 1.0, 1.0], size: 11, zebra: true });
    card(s, 8.5, 1.25, 4.3, 5.45, 'コード', [{ text: '# 固定：小文字', mono: true }, { text: 'start = start[:6]+"gaaa"+start[10:]', mono: true }, { text: '# 確率計算の温度', mono: true }, { text: 'md = RNA.md(); md.temperature = 60', mono: true }, { text: 'fc = RNA.fold_compound(seq, md)', mono: true }, { text: '# 設計の温度（旧APIのグローバル）', mono: true }, { text: 'RNA.cvar.temperature = 60', mono: true }, { text: '# 早期打ち切り', mono: true }, { text: 'RNA.cvar.give_up = 1', mono: true }, { text: 'GC 含量や反復回避などの制約は RNAinverse にはない。別ツール（NUPACK, RNAblueprint など）や自作の後処理で対応する' }], { size: 11, noBullet: true });
  }
  // S7 environment & troubleshooting
  {
    const s = frame(pres, { title: '補足7：実習環境とトラブル対応', num: n++, tag: SUP, notes: notes({ time: '任意（事前配布用）', points: ['uv で環境を分離し、PyPI の viennarna 2.7.2 を入れる。Python 3.13 で動作確認（macOS 15、Windows 11 は事務局で確認）。それ以外の構成は未検証。Windows では同じ seed でも演習2の設計配列が資料と異なる（d = 0 と inverse_pf_fold の P(T) は一致）。', '確認：uv run python -c "import RNA; print(RNA.__version__)" で 2.7.2。', '乱数：RNA.init_rand(seed) で固定。乱数生成の実装は OS によって異なる可能性があり、同じ seed でも配列が変わりうる（この資料の数値は macOS 15 で計測）。', 'Python 文字列の上書き：inverse_fold は start の文字列を書き換える。控えは start.encode().decode() で取る。', '動かない場合は TA・グループの画面共有で参加する。'], refs: [REF.uv, REF.pypi, REF.pyapi] }) });
    code(s, `# 事前準備（配布手順の要約）
uv init viennarna-course --python 3.13
cd viennarna-course
uv add viennarna==2.7.2
uv run python -c "import RNA; print(RNA.__version__)"   # 2.7.2

# 当日の動作確認
uv run python exercises/ex1_fold.py`, 0.55, 1.3, 7.2, 3.0, { size: 13 });
    const rows = [['症状', '原因の候補', '対応'], ['ModuleNotFoundError: RNA', '別の Python を起動している', 'uv run python を使う／仮想環境を有効化'], ['バージョンが 2.7.2 でない', '別環境の ViennaRNA', 'uv add viennarna==2.7.2 で入れ直す'], ['同じ seed で配列が違う', 'OS ごとの乱数実装の差', '数値の一致は求めない。d と P(T) の傾向を比べる'], ['start が設計配列に変わっている', 'inverse_fold が start を上書き', '控え start.encode().decode() を使う'], ['unequal length のエラー', '配列長と構造長の不一致', 'len() で確認。括弧の対応も確認'], ['N が残る', 'Python API は N を置換しない', 'A/C/G/U で初期配列を作る']];
    table(s, rows, 0.55, 4.45, 12.2, { colW: [3.4, 3.6, 5.2], size: 12, zebra: true });
    card(s, 8.0, 1.3, 4.8, 3.0, '検証済み・未検証', ['検証済み：macOS 15（Python 3.13.4、uv 0.12）、Windows 11（Python 3.13.15、事務局確認）、viennarna 2.7.2', 'Windows では同じ seed でも設計配列が変わる（d = 0 なら成功）', '未検証：他の macOS/Linux 構成', '動かない参加者は TA・グループの画面で結果比較に参加'], { size: 12, fill: T.accentSoft, titleColor: T.accent });
  }
  // S8 references
  {
    const s = frame(pres, { title: '補足8：参考文献・URL', num: n++, tag: SUP, notes: notes({ time: '任意', points: ['一次資料（公式ドキュメント・原論文・ソース）を優先して参照した。各スライドのノートに参照箇所を記載。'], refs: Object.values(REF) }) });
    const refs = [`本講習の資料・演習スクリプト（資料 ${L.VERSION}）: ${L.REPO}`, REF.vrna, REF.pyapi, REF.inv, REF.src, REF.hofacker, REF.lorenz, REF.zuker, REF.mccaskill, REF.nussinov, REF.turner, REF.green, REF.geary, 'Hammer S., Tschiatschek B., Flamm C., Hofacker I.L., Findeiß S. (2017) RNAblueprint. Bioinformatics 33:2850–2852', 'Zadeh J.N. et al. (2011) NUPACK: analysis and design of nucleic acid systems. J Comput Chem 32:170–173', REF.pypi, REF.uv];
    bullets(s, refs, 0.55, 1.3, 12.2, 5.5, { size: 12, gap: 3 });
  }
  return n;
};
