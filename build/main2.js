// 本編 スライド 15–36
const L = require('./lib');
const { REPO_SHORT, T, F, DATA, REF, frame, sectionSlide, badge, txt, bullets, code, cite, card, arrow, line, seqRow, ssRow, numRow, label, drawStructure, arcs, table, eq, img, exBoxes, notes, charW, pairTable } = L;
const EX = DATA.ex, M = DATA.mutants, E2 = DATA.ex2, LOW = DATA.low_design, ST = DATA.stats;
const EXCODE = {
  ex1a: `import RNA
print("ViennaRNA", RNA.__version__)      # 2.7.2 と出れば OK

seq = "GGCGCAGAAAUGCGCC"                 # 例題RNA（16 塩基）
ss, mfe = RNA.fold(seq)                  # 構造と最小自由エネルギー
print(seq)
print(ss, f"{mfe:.2f} kcal/mol")`,
  ex1a_out: `ViennaRNA 2.7.2
GGCGCAGAAAUGCGCC
((((((....)))))) -10.20 kcal/mol`,
  ex1b: `import RNA
seq = "GGCGCAGAAAUGCGCC"
pos, new = 4, "A"          # ← ここを変える（位置は 1 始まり）
mut = seq[:pos-1] + new + seq[pos:]
for name, s in [("元の配列", seq), ("変更後  ", mut)]:
    ss, mfe = RNA.fold(s)
    print(name, s, ss, f"{mfe:.2f}")
print("塩基対距離 =", RNA.bp_distance(RNA.fold(seq)[0], RNA.fold(mut)[0]))`,
  ex2a: `import RNA
target = "((((((....))))))"          # 目標構造（例題RNAと同じ形）
seed = 1                             # ← 変えると別の初期配列になる
RNA.init_rand(seed)
start = RNA.random_string(len(target), "ACGU")   # A/C/G/U の乱数配列
start_copy = start.encode().decode() # inverse_fold は start を上書きするので控え
seq, d = RNA.inverse_fold(start, target)
print("初期配列:", start_copy)
print("設計配列:", seq, " 残り距離 d =", d)`,
  ex2b: `ss, mfe = RNA.fold(seq)                 # 設計配列を再予測
print(seq)
print(ss, f"{mfe:.2f}")
print(target, "← 目標")
print("目標との塩基対距離 =", RNA.bp_distance(ss, target))
print("初期配列からの Hamming 距離 =",
      sum(a != b for a, b in zip(start_copy, seq)))`,
  ex2c: `results = []
for seed in range(1, 6):                       # 5 回だけ
    RNA.init_rand(seed)
    start = RNA.random_string(len(target), "ACGU")
    seq, d = RNA.inverse_fold(start, target)
    ss, mfe = RNA.fold(seq)
    results.append((seed, seq, ss, mfe, RNA.bp_distance(ss, target)))
for r in results:
    print(r[0], r[1], r[2], f"{r[3]:.2f}", "d =", r[4])`,
  ex2d: `def target_probability(seq, target):
    fc = RNA.fold_compound(seq)          # 同じモデル条件（37 ℃）
    ss, mfe = fc.mfe()
    fc.exp_params_rescale(mfe)
    fc.pf()                              # 分配関数
    return fc.pr_structure(target)       # 目標構造の確率 P(T)

for seed, seq, ss, mfe, d in results:
    print(seed, seq, f"P(目標) = {target_probability(seq, target):.3f}")`,
};
module.exports = function (pres) {
  // 15 録画停止
  sectionSlide(pres, { stop: true, num: 15, title: '録画を停止します：演習1（15分）', body: '19:30–19:45　構造予測と配列変更（グループ演習）\n提出担当者が画面共有しながら進めます。TA が各グループを支援します。\n自分の環境が動かなくても、グループの画面を見て参加できます。', notes: notes({ time: '30秒', points: ['録画を停止してから演習に入る。', '手順スライド（21–23）は表示したまま。'] }) });
  // 16 演習1 準備
  {
    const s = frame(pres, { title: '演習1の準備：import とバージョン、入力配列の確認', num: 16, notes: notes({ time: '3分', points: ['対話モード（>>>）は使わず、確認用スクリプト exercises/ex0_check.py を実行するだけにしている。', '口頭で一言：「黒い画面に打つのは uv run python ... の1行だけ。下の3行はコンピューターが返した結果」。', 'バージョン 2.7.2 と長さ 16 が出れば準備完了。', 'エラー時：ModuleNotFoundError → 環境が違う（uv run python を付けたか、プロジェクトのフォルダにいるかを確認）。TA が支援。', '万一 python の対話モード（>>> の画面）に入ってしまったら exit() と打って Enter で抜ける。'], extra: ['動かない参加者は TA・グループの画面共有で結果を確認し、比較の議論に参加する。', 'Windows/macOS の細かな環境差は未検証。各自の環境で動いたかどうかをチャットで共有。'], refs: [REF.pyapi, REF.pypi, REF.uv] }) });
    badge(s, '必須', { w: 1.4, color: T.accent });
    txt(s, 'ターミナルに入力する（この 1 行だけ）', 0.55, 1.3, 7.4, 0.35, { fontSize: 14, bold: true, color: T.primary });
    code(s, `uv run python exercises/ex0_check.py`, 0.55, 1.65, 7.4, 0.6, { size: 17 });
    txt(s, 'コンピューターが返す結果（入力しない）', 0.55, 2.45, 7.4, 0.35, { fontSize: 14, bold: true, color: T.primary });
    code(s, `ViennaRNA 2.7.2\n配列: GGCGCAGAAAUGCGCC\n長さ: 16`, 0.55, 2.8, 7.4, 1.25, { size: 17 });
    txt(s, `exercises フォルダが手元にない人：${REPO_SHORT} から入手（Code → Download ZIP、または次の git clone）`, 0.55, 4.08, 7.4, 0.45, { fontSize: 12, color: T.accent });
    code(s, `git clone https://${REPO_SHORT}.git`, 0.55, 4.55, 7.4, 0.45, { size: 13 });
    card(s, 8.2, 1.35, 4.6, 3.6, '確認すること', ['エラーが出ずに 3 行表示される', 'バージョンが 2.7.2（違えば TA に伝える）', '長さが 16', 'exercises フォルダの他のスクリプトも同じ形で実行する'], { size: 16 });
    card(s, 0.55, 5.15, 12.2, 1.55, '動かないとき', ['ModuleNotFoundError: No module named "RNA" → uv run を付け忘れたか、別のフォルダにいる。プロジェクトのフォルダで実行する', '>>> の画面になったら exit() で抜ける。どうしても動かない → グループの画面共有で参加する（結果の読み方は同じ）'], { size: 15, fill: T.accentSoft, titleColor: T.accent });
  }
  // 17 演習1A
  {
    const s = frame(pres, { title: '演習1A：短いRNAを fold し、構造とエネルギーを読む', num: 17, notes: notes({ time: '5分', points: ['RNA.fold(seq) は (構造, MFE) のタプルを返す。エネルギーの単位は kcal/mol。', `期待する出力：((((((....)))))) と −10.20。`, '出力を dot-bracket の読み方で確認：括弧の対応、ループの位置、塩基対の数。', 'つまずきやすい点：配列に T を入れる（U に置き換える、ViennaRNA は T も U として扱うが表示は入力のまま）。全角文字の混入。'], questions: ['予測された構造は、スライド14で読んだ構造と一致するか。'], refs: [REF.pyapi] }) });
    badge(s, '必須', { w: 1.4, color: T.accent });
    code(s, EXCODE.ex1a, 0.55, 1.3, 7.4, 2.7, { size: 14 });
    txt(s, '期待する出力', 8.2, 1.3, 4.6, 0.35, { fontSize: 14, color: T.muted });
    code(s, EXCODE.ex1a_out, 8.2, 1.65, 4.6, 1.4, { size: 16 });
    txt(s, '配布スクリプト：exercises/ex1_fold.py', 8.2, 3.15, 4.6, 0.4, { fontSize: 13, color: T.muted });
    exBoxes(s, { input: ['配列 seq（今回は例題RNAのまま）'], ops: ['RNA.fold(seq) を実行', '構造とエネルギーを表示'], output: ['dot-bracket 構造', 'MFE（kcal/mol）'], question: ['括弧の対応は読めるか', 'ループは何番か', '−10.20 は大きい？（次で比べる）'] }, 4.15, { h: 2.5 });
  }
  // 18 演習1B
  {
    const s = frame(pres, { title: '演習1B：一塩基を変え、構造とエネルギーを比較する', num: 18, notes: notes({ time: '7分', points: ['pos と new を変えて 1 塩基だけ置換し、元と比較する。表の 4 例は特に読みやすい変化：ステム中央（G4A）は塩基対が外れ内部ループができる、ループ（A8C）は構造もエネルギーも不変、G–C→G–U（C3U）は構造同じでエネルギーだけ上がる、末端（G1A）は端の1対が外れる。', '塩基対距離 bp_distance は「片方にだけある塩基対の数」。Hamming距離（文字の違い）とは別（G4A は Hamming 1 だが bp 距離 1、G2C は bp 距離 2）。', '全48通りの一塩基変異の結果はノート末尾に記載。', '答え合わせ：グループで「どこを変えると壊れるか」「どこを変えても変わらないか」を1つずつ報告してもらう。'], questions: ['ステムの真ん中を変えると 5 kcal/mol 以上変わるのに、ループの塩基を変えても変わらないのはなぜか（エネルギーモデルのどの項が効くか）。'], extra: ['全変異の一覧（位置 元→新 構造 ΔG 距離）：'].concat(DATA.all_mutants.map(r => `${r.name}: ${r.ss} ${r.e.toFixed(1)} d=${r.bpd}`)), refs: [REF.pyapi] }) });
    badge(s, '必須', { w: 1.4, color: T.accent });
    code(s, EXCODE.ex1b, 0.55, 1.3, 7.2, 2.75, { size: 14 });
    const pick = ['G4A', 'A8C', 'C3U', 'G1A'];
    const rows = [['変更', '予測構造', 'ΔG', 'bp距離']].concat(pick.map(k => { const r = M[k]; return [{ text: `${r.pos}: ${r.frm}→${r.to}` }, { text: r.ss, mono: true }, { text: r.e.toFixed(1), align: 'right' }, { text: String(r.bpd), align: 'right' }]; }));
    rows.splice(1, 0, [{ text: '（元）' }, { text: EX.ss, mono: true }, { text: EX.mfe.toFixed(1), align: 'right' }, { text: '0', align: 'right' }]);
    table(s, rows, 8.0, 1.3, 4.8, { colW: [1.1, 2.1, 0.8, 0.8], size: 12, zebra: true });
    txt(s, '配布スクリプト：exercises/ex1b_mutate.py（表は期待される結果の例。位置: 元→新）', 8.0, 3.65, 4.8, 0.55, { fontSize: 11, color: T.muted });
    exBoxes(s, { input: ['pos（1〜16）と new（A/C/G/U）', '表の4例から1つ選ぶ'], ops: ['スクリプトを実行', '元と変更後の構造・ΔG を並べる'], output: ['構造は変わったか', 'ΔG はいくつ変わったか', 'bp距離（構造の差）'], question: ['どこを変えると壊れる？', 'どこは変えても平気？', 'Hamming距離1でも構造差が0や2になるのはなぜ？'] }, 4.3, { h: 2.4, size: 14 });
  }
  // 19 録画再開
  sectionSlide(pres, { stop: false, num: 19, title: '録画を再開します：inverse folding の説明', body: '19:45–20:00　目標構造から配列を探す問題と、RNAinverse の探索の仕組み\n演習1で見た「配列を変えると構造とエネルギーが変わる」を、逆向きに使います。', notes: notes({ time: '30秒', points: ['演習1の代表的な気づき（ステム中央は壊れる、ループは変わらない）を一言で回収してから録画再開。'] }) });
  // 20 予測と設計
  {
    const s = frame(pres, { title: '予測と設計：入力と出力の違い', num: 20, notes: notes({ time: '2分', points: ['予測：配列 → 構造。答えは（モデルのもとで）一意に決まる。計算は決定的で、DP により高速。', '設計：構造 → 配列。答えは多数あり得る（演習2では seed ごとに別の配列が出る）。解が見つからないこともある。計算は探索で、乱数に依存。', '評価器は予測そのもの。設計の良し悪しは「予測構造が目標に一致するか」「目標構造の確率が高いか」で測る。'], questions: ['設計で得た配列が「正しい」とはどういう意味か。'], refs: [REF.inv] }) });
    const rows = [['', '予測（fold）', '設計（inverse fold）'], ['入力', '配列 x', '目標構造 T'], ['出力', '構造 S と ΔG', '配列 x（MFE(x) = T になるもの）'], ['答えの数', '一つに決まる', '多数あり得る／見つからないこともある'], ['計算', '動的計画法（決定的、高速）', '予測を繰り返す探索（乱数に依存）'], ['評価', 'エネルギーの最小化', '予測構造と目標の距離 d を最小化']];
    table(s, rows, 0.55, 1.35, 8.4, { colW: [1.3, 3.2, 3.9], size: 18, zebra: true });
    card(s, 9.2, 1.35, 3.6, 5.3, '同じ評価器', ['設計は予測プログラムを何度も呼ぶ', '「少し変えて、再予測して、目標に近づいたか見る」の繰り返し', '目標に届いたら終了。届かなければ「失敗」として距離を返す'], { size: 16 });
    txt(s, '演習1B でやったこと（1 塩基変えて再予測）を、目標に近づく方向へ自動で繰り返すのが設計', 0.55, 5.4, 8.4, 0.8, { fontSize: 17, color: T.accent });
  }
  // 21 設計の難しさ
  {
    const s = frame(pres, { title: '配列設計の難しさ：目標以外の構造との競合', num: 21, notes: notes({ time: '3分', points: [`RNAinverse で得た配列 ${LOW.seq} は MFE 構造が目標に一致する（d=0）。しかし目標構造の確率は ${LOW.p_target}。エネルギーがほぼ同じ別構造（−1.0, −0.9 kcal/mol）が競合している。`, '「MFE が一致した」＝「その構造にほぼ確実に折れる」ではない。設計の良さは目標構造の確率（や集団欠陥）でも評価する（演習2D）。', '弧の図：塩基対確率が分散している＝構造が定まっていない。'], questions: ['この配列を実験に使うなら、どんな追加の評価や改良をするか。'], refs: [REF.mccaskill, REF.pyapi] }) });
    txt(s, `RNAinverse の出力例（MFE 構造は目標に一致）`, 0.55, 1.25, 7.0, 0.4, { fontSize: 16, bold: true, color: T.primary });
    arcs(s, 16, LOW.bpp, 0.65, 3.25, charW(26), {});
    seqRow(s, LOW.seq, 0.65, 3.25, { size: 26 }); ssRow(s, LOW.refold, 0.65, 3.75, { size: 26 });
    txt(s, `ΔG = ${LOW.e.toFixed(1)} kcal/mol　　目標構造の確率 P(T) = ${LOW.p_target}`, 0.65, 4.3, 6.5, 0.45, { fontSize: 16, color: T.accent });
    const rows = [['構造', 'ΔG', 'P']].concat(LOW.subopt.map((r, k) => [{ text: r.ss, mono: true }, { text: r.e.toFixed(1), align: 'right' }, { text: r.p.toFixed(3), align: 'right', bold: k === 0 }]));
    table(s, rows, 7.3, 1.35, 5.5, { colW: [3.4, 1.0, 1.1], size: 14, zebra: true });
    txt(s, '同じ配列がとりうる構造（上位5つ）。目標（1行目）の確率は 23% にすぎない', 7.3, 4.05, 5.5, 0.5, { fontSize: 12, color: T.muted });
    card(s, 0.55, 4.85, 12.2, 1.85, '設計で起こること', ['目標以外の構造がほぼ同じエネルギーで存在すると、MFE が一致しても分子は揺らぐ', 'MFE の一致（d = 0）と高い目標確率は別の条件（演習2D で確かめる）', '対策例：目標構造の確率を目的関数にする（RNAinverse の -Fp、inverse_pf_fold）'], { size: 16 });
  }
  // 22 元論文 (Hofacker et al. 1994)
  {
    const s = frame(pres, { title: '元論文の考え方：Hofacker et al. (1994) の inverse folding', notes: notes({ time: '1分（補足扱い。本編は要点のみ）', points: ['本編では「RNAinverse は 1994 年の論文の方法。少し変えて予測し直し、目標に近づけば採用、を繰り返す」と Fig. 7 の表（MFE 目的と確率目的で P(T) が大きく違う）だけ示して次へ。以下は補足の説明。', 'ViennaRNA の RNAinverse は Hofacker, Fontana, Stadler, Bonhoeffer, Tacker, Schuster (1994) Monatsh. Chem. 125:167–188 の第4節 "Inverse Folding"（pp. 174–177）で提案された発見的手法（heuristic）。', '論文の要点：(1) 候補は「適合配列」（目標の塩基対位置で対合できる文字をもつ配列）のみ。(2) コストは構造距離 f(I)=d(S(I),T)。距離の選び方（第5節の木編集距離など）は性能に大きく影響しないと述べている。現行実装は塩基対距離を使う（inverse.c の TDIST=0）。(3) 全長で最適化せず、ヘアピンから1塩基対ずつ伸ばし、分岐点で部分構造を結合し、最後に全長を扱う（Fig. 5）。理由は「部分構造のエネルギーは加法的」で、全長の fold 回数を減らし局所解に陥りにくくするため。(4) 最適化は最も単純な適応的探索：ランダム変異を試し、コストが下がれば採用。非対合位置は1塩基、対合位置は適合性を保って2塩基を同時に変える。改善する変異が無ければ停止し、新しい初期配列からやり直す。「正しく対合していない位置に限定する」オプションがあり、失敗確率はわずかに増えるが探索空間が大幅に減る（現行実装ではこれが既定の動作）。(5) 分配関数版（-Fp）は目標構造の確率 P(T)=exp(−ΔG(T)/RT)/Q（論文の式6）を最大化。全長で最適化するため遅い。', 'Fig. 7 の実行例：tRNA-Phe のクローバー葉（76 塩基）。-Fm で得た3配列は目標構造の確率が 0.03〜0.09、-Fp では 0.84〜0.86。天然 tRNA-Phe は 0.17（当時のパラメータでの値）。MFE 一致と高い確率が別条件であることを論文自身が示している。', 'Fig. 6：計算時間は配列長のおよそ 3.5 乗（T ≈ 4×10⁻⁶ n^3.5 秒、1994 年の計算機）。', '図は論文の Fig. 5（フローチャート）を引用。配布時は引用元を明記。'], questions: ['論文が「距離の選び方は重要でない」と言えるのはなぜか（成功時は距離 0 で一致するため）。'], refs: [REF.hofacker, REF.src, REF.inv] }) });
    badge(s, '補足扱い：本編は要点のみ', { w: 2.9, color: T.muted });
    img(s, 'papers/hofacker_fig5.png', 0.55, 1.25, 4.1, 4.6);
    cite(s, 'Hofacker et al. (1994) Monatsh. Chem. 125:167–188, Fig. 5「Flow chart of the inverse folding algorithm」', 0.55, 5.9, 4.1, 0.8);
    bullets(s, [
      '候補は「適合配列」だけ：目標の塩基対の位置で対合できる文字をもつ配列',
      'コスト＝構造距離 f(I) = d(S(I), T)。距離の選び方は性能に大きく影響しない（論文）。現行実装は塩基対距離',
      '部分構造から順に：ヘアピン → 1 塩基対ずつ伸ばす → 分岐で結合 → 全長（Fig. 5）。全長の fold 回数を減らし、局所解に陥りにくくする',
      '最適化は最も単純な適応的探索：ランダム変異（非対合は 1 塩基、対合は 2 塩基同時）を、コストが下がれば採用。改善なしで停止し、新しい初期配列からやり直す',
      '「正しく対合していない位置に限定」する選択肢（現行実装の既定）',
      '分配関数版：目標構造の確率 P(T) = exp(−ΔG(T)/RT)/Q を最大化（式 6）。全長で最適化するため遅い',
    ], 4.95, 1.25, 7.85, 4.35, { size: 15, gap: 5 });
    const rows = [['Fig. 7 の例（tRNA-Phe、76 塩基）', 'P(目標構造)'], ['-Fm（MFE 目的）で得た 3 配列', '0.03 〜 0.09'], ['-Fp（確率目的）で得た 3 配列', '0.84 〜 0.86'], ['天然の tRNA-Phe 配列', '0.17']];
    table(s, rows.map((r, i) => r.map((c, j) => ({ text: c, align: j ? 'right' : 'left', bold: i === 0, color: i === 2 ? '009E73' : T.ink }))), 4.95, 5.65, 7.85, { colW: [5.3, 2.55], size: 13, zebra: true });
  }
  // 23 RNAinverseの探索（実装）
  {
    const Wk = DATA.walks['INT24_5'];
    const s = frame(pres, { title: 'RNAinverseの探索（現行実装）：変異、再予測、評価、更新', num: 23, notes: notes({ time: '1〜2分（補足扱い。本編は左の①〜⑤だけ）', points: ['本編では左の①〜⑤の流れだけ示し、右のトレース表は「d が 1 ずつ減って 0 になる」ことだけ指して次へ。以下は補足の説明。', '前スライドの論文のアイデアが v2.7.2 の inverse.c でどう動くか。適応的探索（adaptive walk）：(1) 初期配列を整合化（目標の塩基対が対合できる文字にする）、(2) 予測して目標との塩基対距離 d を計算、(3) 目標と予測が食い違う位置（と隣）を選び、非対合位置は 1 塩基置換、対合位置はペアごと置換して再予測、(4) d が減る最初の変異を採用、(5) d = 0 で終了。改善する変異がなければ停止（失敗として d を返す）。', '同点（d が同じ）の変異は、目標構造のエネルギーと MFE の差が縮まるものを記憶し、改善がなければそれを採用する（ソース inverse.c の cost2）。', '実装はさらに目標構造を部分構造（ヘアピンを閉じるステムから外側へ）に分けて順に探索する（補足スライド）。', '右の表は本講習用に単純化して再現したトレース（24 塩基の目標、Python の乱数 seed=5）。RNAinverse 本体の内部ログではないが、手順は同じ。'], questions: ['なぜ「食い違う位置」だけを変えるのか。全部の位置を試すと何が起きるか。'], refs: [REF.hofacker, REF.src, REF.inv] }) });
    badge(s, '補足扱い：本編は要点のみ', { w: 2.9, color: T.muted });
    const steps = [['① 整合化', '目標の各塩基対が対合できる文字にする'], ['② 予測', 'MFE 構造を計算し、目標との塩基対距離 d を求める'], ['③ 変異', '食い違う位置（と隣）を選ぶ。非対合→1塩基、対合→ペアごと'], ['④ 評価・更新', 'd が減れば採用。同点ならエネルギー差が縮む変異を記憶'], ['⑤ 終了', 'd = 0 で成功。改善なしなら停止（d > 0 を返す）']];
    steps.forEach(([t, b], k) => { const y = 1.3 + k * 1.08; s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.55, y, w: 4.3, h: 0.95, fill: { color: k === 3 ? T.accentSoft : T.light }, line: { color: k === 3 ? T.accentSoft : T.light }, rectRadius: 0.1 }); txt(s, t, 0.7, y + 0.05, 4.0, 0.35, { fontSize: 15, bold: true, color: k === 3 ? T.accent : T.primary }); txt(s, b, 0.7, y + 0.4, 4.0, 0.55, { fontSize: 12 }); if (k < 4) arrow(s, 2.7, y + 0.95, 2.7, y + 1.08, { width: 1.5 }); });
    arrow(s, 4.85, 4.1, 5.1, 4.1, { width: 1 }); line(s, 5.1, 4.1, 5.1, 2.55, { color: T.primary, width: 1 }); arrow(s, 5.1, 2.55, 4.85, 2.55, { width: 1 });
    txt(s, '繰り返し', 4.9, 3.15, 0.8, 0.3, { fontSize: 10, color: T.muted });
    txt(s, `トレース例（目標 ${Wk.target}、教材用の簡略再現）`, 5.4, 1.25, 7.4, 0.4, { fontSize: 14, bold: true, color: T.primary });
    const rows = [['手順', '配列', '予測構造', 'd', '変更']].concat(Wk.trace.map((t, k) => [{ text: k === 0 ? '初期' : (k === 1 ? '整合化' : `更新${t.step}`) }, { text: t.seq, mono: true, size: 11 }, { text: t.ss, mono: true, size: 11 }, { text: String(t.d), align: 'right', bold: t.d === 0 }, { text: t.change.replace(/整合化: 対合できない目標ペアを直す \(位置 ([\d,]+)\)/, '位置 $1 を対合できる文字に'), size: 10 }]));
    table(s, rows, 5.4, 1.7, 7.4, { colW: [0.7, 2.25, 2.25, 0.35, 1.85], size: 10, zebra: true });
    txt(s, 'd = 目標との塩基対距離（次のスライド）。1 回の更新で 1〜2 文字が変わり、d が単調に減って 0 に達している', 5.4, 5.0, 7.4, 0.6, { fontSize: 12, color: T.muted });
    card(s, 5.4, 5.6, 7.4, 1.1, null, [{ text: '実装も論文どおり、目標をヘアピン側の部分構造から順に解く。成功しても「目標構造の確率が高い」とは限らない（スライド 26）。' }], { size: 13, noBullet: true, fill: T.accentSoft });
  }
  // 23 目標への近さ
  {
    const s = frame(pres, { title: '目標への近さ：塩基対距離の具体例', num: 23, notes: notes({ time: '3分', points: ['塩基対距離 d_bp(S, T)：一方にだけ含まれる塩基対の数（対称差の大きさ）。RNA.bp_distance(S, T) で計算。0 なら同一。', '例：端の1対が外れると 1、内側の1対が外れて内部ループができても 1、両端2対が外れると 2、全部開くと 6。', 'Hamming 距離は「配列」の文字の違いの数。塩基対距離は「構造」の差。演習2では両方を出して区別する（RNAinverse の CLI 出力の数値は初期配列からの Hamming 距離）。', 'ViennaRNA には木編集距離など他の構造距離もあるが、RNAinverse の MFE モードは塩基対距離を使う（inverse.c で TDIST=0）。'], refs: [REF.pyapi, REF.src] }) });
    eq(s, 'eq_bpd', 0.55, 1.3, { h: 0.6 });
    txt(s, '目標 T に対し、構造 S の「片方にだけある塩基対」の数。RNA.bp_distance(S, T)', 6.3, 1.3, 6.5, 0.6, { fontSize: 15, color: T.muted, valign: 'middle' });
    const rows = [['構造 S', '塩基対', 'd_bp(S, T)', 'メモ']].concat(DATA.bpd_examples.map((r, k) => [{ text: r.ss, mono: true }, { text: String(r.ss.split('(').length - 1), align: 'right' }, { text: String(r.d), align: 'right', bold: true }, { text: ['目標そのもの', '末端の1対が外れた', '4番と13番の対が外れた（内部ループ）', '末端の2対が外れた', 'ループ側の1対が外れた', '開いた鎖'][k] }]));
    table(s, rows, 0.55, 2.1, 7.6, { colW: [2.9, 0.8, 1.4, 2.5], size: 14, zebra: true });
    card(s, 8.5, 2.1, 4.3, 4.5, 'Hamming 距離（配列の差）', [], {});
    DATA.hamming_examples.forEach((h, k) => { const y = 2.85 + k * 1.5; seqRow(s, h.a, 8.7, y, { size: 15, plain: true }); const hl = {}; h.b.split('').forEach((c, i) => { if (c !== h.a[i]) hl[i + 1] = 'FBE9DC'; }); seqRow(s, h.b, 8.7, y + 0.35, { size: 15, plain: true, highlight: hl }); txt(s, `Hamming 距離 = ${h.h}`, 8.7, y + 0.75, 3.9, 0.35, { fontSize: 14, color: T.accent }); });
    txt(s, '文字が違う位置の数。構造の差（塩基対距離）とは別に数える', 8.7, 5.9, 3.9, 0.6, { fontSize: 12, color: T.muted });
    txt(s, '設計の評価は「構造の距離」。RNAinverse の出力に添えられる数値は「初期配列からの Hamming 距離」なので混同しない', 0.55, 5.9, 7.6, 0.8, { fontSize: 14, color: T.ink });
  }
  // 24 結果の読み方
  {
    const s = frame(pres, { title: '探索結果の読み方：成功判定、失敗、初期値依存', num: 24, notes: notes({ time: '2分', points: ['inverse_fold は (配列, d) を返す。d = 0 なら成功（返した配列の MFE 構造が目標に一致）。d > 0 は失敗で、最後に試した部分構造の塩基対距離。', `seed を変えると初期配列が変わり、別の配列が得られる（表の5例はすべて成功、Hamming 距離 3〜6 文字の変更で到達）。目標構造の確率 P(T) は ${Math.min(...E2.runs.map(r => r.p_target))}〜${Math.max(...E2.runs.map(r => r.p_target))} とばらつく。`, `失敗例：目標 (((.(((....))).))) を 40 回試すと 2 回失敗（d=1）。返された配列を fold すると目標と 1 対違う構造になる。`, '成功しても目標構造の確率が低いことがある。「d=0」と「P(T) が高い」は別の条件。', '乱数と OS：この資料の数値は macOS で計測。Windows 11 では同じ seed でも配列が変わる（事務局確認：seed=1 で UGAUGUCUUGAUGUCA、P(T)=0.359）。d = 0 と inverse_pf_fold の P(T)=0.976 は一致。'], questions: ['失敗した候補（d=1）は捨てるべきか、使い道はあるか。'], refs: [REF.inv, REF.src] }) });
    const rows = [['seed', '初期配列', '設計配列', 'Hamming', '再予測', 'd', 'P(T)']].concat(E2.runs.map(r => [{ text: String(r.seed), align: 'center' }, { text: r.start, mono: true }, { text: r.seq, mono: true }, { text: String(r.hamming), align: 'right' }, { text: r.refold, mono: true }, { text: String(r.bpd), align: 'right', bold: true }, { text: r.p_target.toFixed(2), align: 'right', color: r.p_target < 0.6 ? T.accent : T.ink }]));
    table(s, rows, 0.55, 1.3, 12.2, { colW: [0.7, 2.5, 2.5, 1.3, 2.5, 0.6, 2.1], size: 14, zebra: true });
    const F = ST.F18.fail_examples[0];
    card(s, 0.55, 4.05, 6.0, 2.65, '失敗の例（別の目標構造）', [{ text: `目標 ${ST.F18.target}`, mono: true }, { text: `返り値 d = ${F.bpd}（40 回中 ${ST.F18.n - ST.F18.success} 回失敗）` }, { text: `${F.seq}`, mono: true }, { text: `${F.refold}  ← 再予測は目標と 1 対違う`, mono: true }], { size: 13 });
    card(s, 6.8, 4.05, 6.0, 2.65, '読み方', ['d = 0：成功。ただし P(T) は 0.5〜0.94 とばらつく', 'd > 0：失敗。配列は返るが MFE 構造は目標と異なる', 'seed（初期配列）で結果が変わる → 複数回試して候補を集める', '同じ seed でも Windows と macOS で配列が変わる'], { size: 14 });
  }
  // 25 録画停止
  sectionSlide(pres, { stop: true, num: 25, title: '録画を停止します：演習2（40分）', body: '20:00–20:40　配列設計、再予測、候補比較（グループ演習）\n必須：2A→2B→2C（ここまで届けば十分）\n時間があれば：2D　／　発展問題：グループの裁量で\n各スクリプトは単独で動くので、途中からでも再開できます。', notes: notes({ time: '30秒', points: ['録画停止。TA はグループに分かれて支援。', '冒頭で「2D まで届かなくてよい」「発展問題はグループの裁量」と伝える（TA が進行を判断しやすくするため）。', '目安：2A 8分、2B 7分、2C 10分（ここまで必須）、2D 8分、発展問題は残り時間、共有 2分。', 'どのスクリプトも単独で動く。2A で躓いたグループは ex2b_refold.py から始めてもよい。', 'Windows では同じ seed でも配列が資料と異なる。d = 0 なら成功と伝える。'] }) });
  // 26 演習2A
  {
    const r1 = E2.runs[0];
    const s = frame(pres, { title: '演習2A：目標構造を指定し、RNA.inverse_fold を動かす', num: 26, notes: notes({ time: '5分', points: ['目標構造は例題RNAと同じ形（16 塩基）。RNA.init_rand(seed) で乱数を固定し、RNA.random_string で A/C/G/U の初期配列を作る。', 'inverse_fold(start, target) は [配列, d] を返す。d = 0 なら成功。', '注意：Python 版の inverse_fold は引数 start の文字列を結果で上書きする（C 側で書き換える）。初期配列を後で使うため start_copy に控えを取っている。', 'N などのワイルドカードは Python API では置き換えられない（CLI と違う）。A/C/G/U で初期配列を作ること。', `期待する出力（macOS で計測、環境により変わりうる）：初期配列 ${r1.start} → 設計配列 ${r1.seq}、d = 0`], refs: [REF.inv, REF.pyapi, REF.src] }) });
    badge(s, '必須', { w: 1.4, color: T.accent });
    code(s, EXCODE.ex2a, 0.55, 1.3, 8.2, 3.2, { size: 13 });
    txt(s, '期待する出力（seed=1、macOS）', 9.0, 1.3, 3.8, 0.35, { fontSize: 13, color: T.muted });
    code(s, `初期配列: ${r1.start}\n設計配列: ${r1.seq}  残り距離 d = 0.0`, 9.0, 1.65, 3.8, 1.2, { size: 12 });
    txt(s, '配布スクリプト：exercises/ex2a_inverse.py', 9.0, 2.9, 3.8, 0.4, { fontSize: 12, color: T.muted });
    card(s, 9.0, 3.35, 3.8, 1.15, null, [{ text: 'start は関数呼び出しで上書きされる。控え（start_copy）を必ず取る', color: T.accent }], { size: 12, noBullet: true, fill: T.accentSoft });
    exBoxes(s, { input: ['target（目標構造）', 'seed（1 から）'], ops: ['初期配列を乱数で作る', 'RNA.inverse_fold を実行'], output: ['設計配列', '残り距離 d（0 なら成功）'], question: ['初期配列と何文字違う？', 'd = 0 は何を保証する？', '隣の人と同じ配列になった？'] }, 4.7, { h: 1.85, size: 14 });
    txt(s, 'Windows では同じ seed でも配列・ΔG・P(T) が上の値と異なります（例 seed=1：UGAUGUCUUGAUGUCA）。d = 0 なら成功です', 0.55, 6.62, 12.2, 0.35, { fontSize: 12, color: T.accent });
  }
  // 27 演習2B
  {
    const r1 = E2.runs[0];
    const s = frame(pres, { title: '演習2B：設計配列を再び fold し、目標と比較する', num: 27, notes: notes({ time: '5分', points: ['設計配列を RNA.fold で再予測し、目標と並べて表示。RNA.bp_distance で塩基対距離を確認（成功なら 0）。', '初期配列との Hamming 距離も出し、「構造の距離」と「配列の距離」を区別する。', `期待する出力：${r1.seq} → ${r1.refold}（${r1.e.toFixed(2)} kcal/mol）、塩基対距離 0、Hamming 距離 ${r1.hamming}。`, '例題RNA（−10.2）と比べてエネルギーが浅い（−3.8）ことに気づかせる。安定さは目的に入っていない。'], questions: ['設計配列は例題RNAより不安定。それでも「成功」なのはなぜか。'], refs: [REF.pyapi] }) });
    badge(s, '必須', { w: 1.4, color: T.accent });
    code(s, EXCODE.ex2b, 0.55, 1.3, 7.6, 2.5, { size: 14 });
    txt(s, '期待する出力（seed=1、macOS）', 8.4, 1.3, 4.4, 0.35, { fontSize: 13, color: T.muted });
    code(s, `${r1.seq}\n${r1.refold} ${r1.e.toFixed(2)}\n${E2.target} ← 目標\n目標との塩基対距離 = 0\n初期配列からの Hamming 距離 = ${r1.hamming}`, 8.4, 1.65, 4.4, 1.9, { size: 12 });
    txt(s, '配布スクリプト：exercises/ex2b_refold.py（単独で実行可。2A の計算も中でやり直す）', 8.4, 3.6, 4.4, 0.4, { fontSize: 12, color: T.muted });
    exBoxes(s, { input: ['2A で得た seq と target'], ops: ['RNA.fold(seq)', 'RNA.bp_distance(ss, target)', 'Hamming 距離を数える'], output: ['再予測の構造と ΔG', '塩基対距離（0 か）', 'Hamming 距離'], question: ['ΔG は例題RNAの −10.2 と比べてどうか', '「成功」の基準に安定さは入っている？'] }, 4.3, { h: 2.25, size: 14 });
    txt(s, 'Windows では同じ seed でも配列・ΔG・P(T) が上の値と異なります（例 seed=1：UGAUGUCUUGAUGUCA）。d = 0 なら成功です', 0.55, 6.62, 12.2, 0.35, { fontSize: 12, color: T.accent });
  }
  // 28 演習2C
  {
    const s = frame(pres, { title: '演習2C：複数回設計し、異なる配列の候補を集める', num: 28, notes: notes({ time: '8分', points: ['seed を 1〜5 に変えて 5 回設計し、結果をリストに集める。全部 d = 0 になるはず（16 塩基は易しい目標）。', '同じ目標でも配列はすべて異なる。ΔG も −3.8〜−7.3 とばらつく。', 'グループ内で seed を分担してもよい。時間があれば seed を 6〜10 に広げる。', '失敗（d > 0）が出た場合はそれも候補として記録し、再予測の構造がどう違うかを見る。'], questions: ['5 つの候補から 1 つ選ぶとしたら、何を基準にするか（次の 2D）。'], refs: [REF.pyapi] }) });
    badge(s, '必須', { w: 1.4, color: T.accent });
    code(s, EXCODE.ex2c, 0.55, 1.3, 7.6, 3.0, { size: 13 });
    const rows = [['seed', '設計配列', 'ΔG', 'd']].concat(E2.runs.map(r => [{ text: String(r.seed), align: 'center' }, { text: r.seq, mono: true }, { text: r.e.toFixed(2), align: 'right' }, { text: String(r.bpd), align: 'right' }]));
    table(s, rows, 8.4, 1.3, 4.4, { colW: [0.6, 2.4, 0.8, 0.6], size: 12, zebra: true });
    txt(s, '期待する出力（macOS。再予測はすべて目標と一致）　配布：exercises/ex2c_repeat.py', 8.4, 3.35, 4.4, 0.8, { fontSize: 11, color: T.muted });
    exBoxes(s, { input: ['seed の範囲（1〜5）', '余裕があれば 6〜10'], ops: ['for ループで 5 回設計', '各回を再予測して記録'], output: ['5 つの配列（全部違う）', 'ΔG のばらつき', 'd（失敗があれば > 0）'], question: ['どの候補が「良い」？', 'ΔG が低い＝良い、と言える？', '失敗候補は何が違う？'] }, 4.45, { h: 2.1, size: 14 });
    txt(s, 'Windows では同じ seed でも配列・ΔG・P(T) が上の値と異なります（例 seed=1：UGAUGUCUUGAUGUCA）。d = 0 なら成功です', 0.55, 6.62, 12.2, 0.35, { fontSize: 12, color: T.accent });
  }
  // 29 演習2D
  {
    const pf = E2.pf_runs[0];
    const s = frame(pres, { title: '演習2D：目標構造の確率を計算し、候補を比較する', num: 29, notes: notes({ time: '8分', points: ['fold_compound → mfe → exp_params_rescale → pf → pr_structure(target) の順で目標構造の確率 P(T) を計算。条件は 37 ℃・同じパラメータで統一。有効な（対合できる）配列と構造の組にだけ使う。', `5 候補の P(T)：${E2.runs.map(r => r.p_target).join(', ')}。すべて d = 0（MFE 一致）だが確率は約 0.5〜0.94 と大きく違う。`, `参考：確率を最大化する RNA.inverse_pf_fold(start, target) では ${pf.seq}（P(T) = ${pf.p_target}、GC 含量 ${Math.round(pf.gc * 100)}%）のように G–C が多い配列が出る。返り値の cost は −RT ln P。`, 'MFE 一致と高い目標確率は同じ条件ではない。どちらを重視するかは用途次第（実験での扱いやすさ、GC 含量の制約など）。'], questions: ['P(T) が最も高い候補を選ぶことに落とし穴はあるか（GC が多すぎる、他の条件）。'], refs: [REF.pyapi, REF.inv, REF.mccaskill] }) });
    badge(s, '時間があれば', { w: 1.9 });
    code(s, EXCODE.ex2d, 0.55, 1.3, 7.6, 3.1, { size: 13 });
    const rows = [['seed', '設計配列', 'd', 'P(T)']].concat(E2.runs.map(r => [{ text: String(r.seed), align: 'center' }, { text: r.seq, mono: true }, { text: String(r.bpd), align: 'right' }, { text: r.p_target.toFixed(3), align: 'right', bold: true, color: r.p_target < 0.6 ? T.accent : T.ink }])).concat([[{ text: '-Fp' }, { text: pf.seq, mono: true }, { text: '0', align: 'right' }, { text: pf.p_target.toFixed(3), align: 'right', bold: true, color: '009E73' }]]);
    table(s, rows, 8.4, 1.3, 4.4, { colW: [0.6, 2.2, 0.5, 1.1], size: 11, zebra: true });
    txt(s, '最終行：RNA.inverse_pf_fold（確率を最大化する版）の結果。配布：exercises/ex2d_probability.py', 8.4, 3.7, 4.4, 0.7, { fontSize: 11, color: T.muted });
    exBoxes(s, { input: ['2C の results', '（発展）inverse_pf_fold も試す'], ops: ['target_probability で各候補の P(T)', '表にして並べる'], output: ['P(T)：0.5〜0.94 とばらつく', 'd = 0 でも低い候補がある'], question: ['MFE 一致と高い P(T) は同じ条件？', 'P(T) が高い配列の特徴は？', 'GC が多い配列の懸念は？'] }, 4.5, { h: 2.05, size: 13 });
    txt(s, 'Windows では候補の配列と P(T) が上の値と異なります。inverse_pf_fold の P(T) = 0.976 は共通です', 0.55, 6.62, 12.2, 0.35, { fontSize: 12, color: T.accent });
  }
  // 30 グループ発展問題
  {
    const s = frame(pres, { title: 'グループで試す発展問題：目標や配列条件を一つ変えて比較する', num: 30, notes: notes({ time: '12分（＋共有2分）', points: ['グループで A〜C から 1 つ選び、「何を変えたか」「成功率・P(T) がどう変わったか」を記録する。提出課題の材料になる。', `A の目安（40 回試行、macOS）：内部ループ入り 24 塩基は成功 ${ST.INT24.success}/${ST.INT24.n}、P(T) 中央値 ${ST.INT24.p_median}。2 ヘアピン 26 塩基は ${ST.TWO26.success}/${ST.TWO26.n}、中央値 ${ST.TWO26.p_median}。3 分岐 53 塩基は ${ST.JUNC53.success}/${ST.JUNC53.n}、中央値 ${ST.JUNC53.p_median}（失敗と低確率が増える）。`, `B：小文字は固定される。ループを gaaa に固定した 3 例は全て成功、P(T) = ${DATA.fixed_runs.map(r => r.p_target).join(', ')}。`, `C：温度を変えて P(T) を再計算（fold_compound に RNA.md() で temperature を指定）。seed=1 の配列は 25 ℃ で ${E2.temperature[0].p25}、37 ℃ で ${E2.temperature[0].p37}、60 ℃ で ${E2.temperature[0].p60}。設計自体を別温度で行うには RNA.cvar.temperature を変える。`, 'つまずき：目標の括弧が対応していない、配列長と構造長の不一致（エラーになる）。小文字の位置が対合できない文字だと解が見つからないことがある。'], refs: [REF.inv, REF.pyapi] }) });
    badge(s, 'グループの裁量で', { w: 2.2 });
    const opts = [['A. 目標構造を変える', ['内部ループ入り（24）\n(((((..(((....)))..)))))', '2 ヘアピン（26）\n((((....))))..((((....))))', '3 分岐（53 塩基、難しい）\n→ ex3_group.py のコメント参照'], '成功率と P(T) はどう変わるか'], ['B. 塩基を固定する', ['初期配列の一部を小文字にすると固定される', 'start = start[:6] + "gaaa" + start[10:]', 'ループを GAAA に固定して 5 回設計'], '固定しても成功するか。P(T) は？'], ['C. 温度を変える', ['RNA.md() の temperature を 25 / 60 に', '同じ候補の P(T) を再計算', '（設計を別温度で行うなら RNA.cvar.temperature）'], '温度で目標構造の確率はどう変わるか']];
    opts.forEach(([t, b, q], k) => { const x = 0.55 + k * 4.1; card(s, x, 1.3, 3.9, 4.2, t, b.map(v => ({ text: v, mono: /\(\(|start|RNA\./.test(v) })), { size: 12 }); txt(s, '問い：' + q, x + 0.2, 4.95, 3.5, 0.5, { fontSize: 13, color: T.accent }); });
    card(s, 0.55, 5.65, 12.2, 1.05, '記録すること（提出課題の材料）', ['変えた条件／目標構造／設計配列（複数）／再予測結果／P(T)／気づいたこと'], { size: 14 });
  }
  // 31 録画再開
  sectionSlide(pres, { stop: false, num: 31, title: '録画を再開します：まとめ', body: '20:40–20:50　応用への展開、まとめ、提出課題\nグループの結果は録画停止中に共有してもらいました。ここからは本日の内容を整理します。', notes: notes({ time: '30秒', points: ['各グループの一言共有は録画停止中に済ませてから再開する。'] }) });
  // 32 応用で追加する条件
  {
    const s = frame(pres, { title: '実際の応用で追加する条件：複数状態、相互作用、実験検証', num: 32, notes: notes({ time: '3分', points: ['スイッチ：OFF と ON の 2 状態（以上）を同時に満たす配列が要る。複数構造を目的にする設計ツール（例：RNAblueprint, Hammer et al. 2017）。', '相互作用：トリガーと結合した複合体の評価は 2 本鎖の熱力学（RNAcofold, RNAup / NUPACK）。', '配列制約：RBS・AUG・プロモーターの固定、GC 含量、反復や制限部位の回避。RNAinverse は小文字固定しか扱わない。', '三次相互作用（kissing loop 等）は二次構造モデル外。', '実験検証：予測が一致しても細胞内で機能するとは限らない（Green et al. 2014 では 646 設計を実測して選抜）。'], questions: ['自分の応用では、どの条件が一番きついか。'], refs: [REF.green, REF.geary, 'Hammer S. et al. (2017) RNAblueprint. Bioinformatics 33:2850–2852', 'Zadeh J.N. et al. (2011) NUPACK. J Comput Chem 32:170–173', REF.lorenz] }) });
    const c = [['複数状態', ['スイッチは OFF/ON の両構造を評価', '複数目標の設計（RNAblueprint など）'], T.accent], ['相互作用', ['トリガーとの二本鎖形成を評価', 'RNAcofold / RNAup、NUPACK'], T.primary], ['配列制約', ['RBS・AUG・プロモーターの固定', 'GC 含量、反復配列や制限部位の回避'], '009E73'], ['実験検証', ['予測 = 機能ではない', '多数設計して実測で選抜（Green 2014 は 646 設計）'], '7570B3']];
    c.forEach(([t, b, col], k) => card(s, 0.55 + (k % 2) * 6.2, 1.3 + Math.floor(k / 2) * 2.35, 6.0, 2.15, t, b, { size: 16, titleColor: col, titleSize: 20 }));
    card(s, 0.55, 6.0, 12.2, 0.75, null, [{ text: '今日の道具（単一状態・二次構造・MFE と確率）は出発点。「MFE 構造が一致すれば実験でも機能する」とは言えない。', color: T.accent }], { size: 15, noBullet: true, fill: T.accentSoft });
  }
  // 33 まとめ
  {
    const s = frame(pres, { title: '今日のまとめ：何を入力し、何を計算し、何がまだ分からないか', num: 33, notes: notes({ time: '3分', points: ['fold：配列 → MFE 構造と ΔG。エネルギーはループ単位の和。', 'pf / pr_structure：配列 → 構造集団の確率。MFE だけでは揺らぎが見えない。', 'inverse_fold：目標構造 → 配列。予測を評価器に使う探索。成功しても P(T) はばらつく。', '分からないこと：実験で機能するか、他分子との相互作用、三次構造、細胞内環境。'], refs: [REF.vrna, REF.pyapi] }) });
    const rows = [['操作', '入力', '計算', '出力', 'まだ分からないこと'],
      ['RNA.fold', '配列', 'ループ単位のエネルギー和を DP で最小化', 'MFE 構造、ΔG', '他の構造がどれだけ存在するか'],
      ['pf / pr_structure', '配列（＋目標構造）', '全構造のボルツマン和（分配関数）', '構造確率 P(S)、塩基対確率 p_ij', 'モデル外の相互作用・三次構造'],
      ['RNA.inverse_fold', '目標構造（＋初期配列）', '変異と再予測を繰り返す探索', '配列と残り距離 d', '初期値依存、P(T) の高さ、実験での機能'],
      ['inverse_pf_fold', '目標構造', '目標構造の確率を最大化する探索', 'GC の多い安定配列', '実験・細胞内での扱いやすさ']];
    table(s, rows.map((r, i) => r.map((c, j) => ({ text: c, mono: i > 0 && j === 0, bold: i === 0 }))), 0.55, 1.3, 12.2, { colW: [2.1, 2.0, 3.2, 2.4, 2.5], size: 14, zebra: true });
    card(s, 0.55, 4.2, 12.2, 2.5, '覚えて帰ること', ['配列 → 構造は一意に予測できるが、分子は構造集団として揺らぐ（MFE と確率を区別）', '構造 → 配列は探索で、答えは複数・初期値依存・失敗もある', '成功の基準（d = 0）と良さの基準（P(T)、実験）は別', `資料と演習スクリプトは ${REPO_SHORT} に置いてあります。講習後も試せます。質問は Issues へ`], { size: 15 });
  }
  // 34 提出課題
  {
    const s = frame(pres, { title: 'グループ提出課題：設計結果と比較、限界の考察', num: 34, notes: notes({ time: '3分', points: ['グループごとに 1 件。内容は演習 2 と発展問題の結果をそのまとめる程度で十分。', '提出期限は講習から約 2 週間後、10 月 22 日を案として提示（確定ではない）。提出先・提出方法は未確定のため後日案内。', '形式は提案：A4 1 枚または スライド 2 枚（PDF）。数値は自分たちの環境での実測値を記す（バージョン・温度・seed も）。'], refs: [] }) });
    card(s, 0.55, 1.3, 7.4, 5.4, '内容（各項目 2〜4 行で十分）', ['目標構造（dot-bracket）と、選んだ理由', '設計配列（複数可）と再予測結果（構造・ΔG・塩基対距離）', '比較した条件（seed、目標の変更、固定塩基、温度など）と P(T)', '考察：うまくいった点、失敗や低確率の候補、今日の方法の限界', '記録：ViennaRNA のバージョン、温度、seed、OS'], { size: 17 });
    card(s, 8.2, 1.3, 4.6, 2.5, '形式（提案）', ['A4 1 枚 または スライド 2 枚', 'PDF で 1 グループ 1 件', 'グループ名と参加者名を記載'], { size: 16 });
    card(s, 8.2, 4.0, 4.6, 2.7, '期限・提出先', ['期限：講習の約 2 週間後、10 月 22 日（案）', '提出先・方法：未確定。決まり次第、主催者から案内', '質問は当日の質疑またはグループの TA へ'], { size: 16, fill: T.accentSoft, titleColor: T.accent });
  }
  // 35 録画停止
  sectionSlide(pres, { stop: true, num: 35, title: '録画を停止します：質疑応答（10分）', body: '20:50–21:00　質疑応答\n本日の内容への質問のほか、「自分ならどのようなRNAを設計したいか」を話してください。', notes: notes({ time: '30秒', points: ['録画停止を確認してから質疑に入る。'] }) });
  // 36 質疑応答
  {
    const s = frame(pres, { title: '質疑応答：自分ならどのようなRNAを設計したいか', num: 36, notes: notes({ time: '10分', points: ['質問が出ないときの投げかけ：設計したい RNA の「目標構造」「入力」「条件」「検証方法」を順に聞く。', '本日の道具でできること／できないこと（スライド 38）に対応させて答える。'], questions: ['どんな機能の RNA を作りたいか', 'その目標構造はどう決めるか', '成功をどう確かめるか'], refs: [REF.vrna, REF.inv] }) });
    const q = [['目標は何か', '結合・切替・触媒・形。目標二次構造をどう決める？'], ['入力は何か', 'トリガーRNA、小分子、温度。2 状態が要る？'], ['条件は何か', '固定配列、GC 含量、長さ、他分子との相互作用'], ['どう確かめるか', '予測（P(T)）→ 実験（ゲル、蛍光、AFM）']];
    q.forEach(([t, b], k) => card(s, 0.55 + (k % 2) * 6.2, 1.3 + Math.floor(k / 2) * 2.3, 6.0, 2.1, t, [b], { size: 17, titleSize: 22 }));
    txt(s, `質問は口頭でもチャットでも。時間内に答えきれない質問はグループの TA と後日共有します。\n講義後の質問は GitHub の Issues で受け付けます：${REPO_SHORT}/issues`, 0.55, 5.95, 12.2, 0.8, { fontSize: 15, color: T.muted });
  }
};
