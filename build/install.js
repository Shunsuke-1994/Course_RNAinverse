// 事前準備（インストール手順）スライド。本編冒頭と事前配布用 PDF の両方で使う
const L = require('./lib');
const { REPO, T, F, DATA, REF, frame, txt, bullets, code, cite, card, arrow, table, notes } = L;
const TAG = '事前準備：ViennaRNA 実習環境';
module.exports = function (pres, opts = {}) {
  const tag = opts.tag || TAG;
  // I1 概要
  {
    const s = frame(pres, { title: '事前準備：実習環境のインストール（所要 10〜15 分）', tag, notes: notes({ time: '事前配布（当日は動作確認のみ 3 分）', points: ['当日の実習は自分の PC 上の Python から ViennaRNA を使う。事前にこの 4 ページの手順で環境を作り、最後の動作確認まで済ませておく。', 'uv は Python 本体と仮想環境をまとめて管理する軽量ツール。既存の Python 環境を汚さない。', '検証済み：macOS 15（Python 3.13.4、viennarna 2.7.2、uv 0.12）、Windows 11（Python 3.13.15、viennarna 2.7.2、事務局で確認）。', '動かなくても講習には参加できる（TA・グループの画面で結果を比較）。'], refs: [REF.uv, REF.pypi, REF.pyapi] }) });
    const steps = [['1', 'uv を入れる', 'ターミナル 1 行'], ['2', 'プロジェクトを作る', 'Python 3.13 を指定'], ['3', 'ViennaRNA を入れる', 'viennarna 2.7.2'], ['4', '動作確認', 'import RNA が通る']];
    steps.forEach(([n, t, b], k) => { const x = 0.55 + k * 3.1; s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.35, w: 2.9, h: 1.5, fill: { color: T.light }, line: { color: T.light }, rectRadius: 0.12 }); s.addText(n, { shape: pres.shapes.OVAL, x: x + 0.2, y: 1.55, w: 0.55, h: 0.55, fill: { color: T.primary }, line: { color: T.primary }, fontFace: F.jp, fontSize: 18, bold: true, color: T.white, align: 'center', valign: 'middle', margin: 0 }); txt(s, t, x + 0.9, 1.5, 1.9, 0.6, { fontSize: 18, bold: true, color: T.primary, valign: 'middle' }); txt(s, b, x + 0.9, 2.1, 1.9, 0.5, { fontSize: 14, color: T.muted }); if (k < 3) arrow(s, x + 2.9, 2.1, x + 3.1, 2.1, { width: 1.5 }); });
    card(s, 0.55, 3.1, 6.0, 3.6, '必要なもの', ['自分の PC（macOS または Windows）と管理者権限', 'インターネット接続（ダウンロードは合計 100 MB 程度）', 'ターミナル（macOS：ターミナル.app、Windows：PowerShell）', 'exercises フォルダ（演習用スクリプト。GitHub から入手、手順 2・3 参照）', 'Python の経験は不要。コマンドはコピーして貼り付ける'], { size: 16 });
    card(s, 6.8, 3.1, 6.0, 3.6, '動作確認の状況', ['確認済み：macOS 15（Python 3.13.4）、Windows 11（Python 3.13.15）、いずれも viennarna 2.7.2', 'Windows では演習2の設計配列が資料の例と変わる（乱数の違い。失敗ではない）', '動かない場合：当日は TA またはグループの画面で結果を比較しながら参加できる。エラー文を控えておく'], { size: 15, fill: T.accentSoft, titleColor: T.accent });
  }
  // I2 uv
  {
    const s = frame(pres, { title: '手順 1：uv をインストールする', tag, notes: notes({ time: '事前配布', points: ['公式インストーラ（docs.astral.sh/uv）のコマンドをそのまま実行。macOS はターミナル、Windows は PowerShell。', '実行後はターミナルを一度閉じて開き直すと uv コマンドが使える（PATH が更新されるため）。', 'Homebrew の brew install uv はソースからのビルドになる環境があり時間がかかるため、公式インストーラを推奨。', 'すでに uv がある場合はこの手順は不要。uv --version でバージョンが出れば OK。'], refs: [REF.uv] }) });
    txt(s, 'macOS（ターミナル.app を開いて貼り付け）', 0.55, 1.3, 6.0, 0.4, { fontSize: 16, bold: true, color: T.primary });
    code(s, `curl -LsSf https://astral.sh/uv/install.sh | sh`, 0.55, 1.75, 6.0, 0.8, { size: 15 });
    txt(s, 'Windows（PowerShell を開いて貼り付け）', 6.8, 1.3, 6.0, 0.4, { fontSize: 16, bold: true, color: T.primary });
    code(s, `powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"`, 6.8, 1.75, 6.0, 0.8, { size: 13 });
    txt(s, '確認（ターミナルを閉じて開き直してから）', 0.55, 2.85, 6.0, 0.4, { fontSize: 16, bold: true, color: T.primary });
    code(s, `uv --version
# 出力例: uv 0.12.17 (…)   ← バージョンが表示されれば OK`, 0.55, 3.3, 6.0, 1.05, { size: 15 });
    card(s, 6.8, 2.85, 6.0, 1.5, 'uv とは', ['Python 本体と仮想環境、パッケージをまとめて管理する軽量ツール', '既存の Python 環境には手を加えない'], { size: 14 });
    card(s, 0.55, 4.6, 12.2, 2.1, 'うまくいかないとき', ['「uv: command not found」→ ターミナルを開き直す。それでも出なければ macOS は ~/.local/bin/uv --version を試す', 'Windows で実行ポリシーのエラー → 上のコマンドを PowerShell に 1 行のまま貼り付ける（-ExecutionPolicy ByPass が含まれていることを確認）', 'すでに Python がある人は pip でも可：python -m pip install uv（この場合も以降の手順は同じ）'], { size: 14 });
  }
  // I3 project + viennarna
  {
    const s = frame(pres, { title: '手順 2・3：プロジェクトを作り、ViennaRNA を入れる', tag, notes: notes({ time: '事前配布', points: ['uv init --python 3.13 で Python 3.13 を使う空のプロジェクトを作る（3.13 が無ければ uv が自動で取得する）。uv init の既定は最新の Python になるため、動作確認済みの 3.13 を明示する。', 'uv add viennarna==2.7.2 で PyPI の viennarna 2.7.2（Python バインディング）を入れる。import 名は RNA。', 'exercises フォルダは GitHub（https://github.com/Shunsuke-1994/Course_RNAinverse）の緑の Code ボタン → Download ZIP で入手し、展開した中の exercises をプロジェクト直下にコピーする。git が使える人は git clone でもよい。', 'コマンドは macOS / Windows 共通。Windows の PowerShell では cd の書き方も同じ。', '動作確認の出力（2.7.2 と、例題RNAの構造 ((((((....)))))) と −10.20）が出れば準備完了。'], refs: [REF.uv, REF.pypi, REF.pyapi] }) });
    code(s, `# 手順 2: プロジェクトを作る（好きな場所で）
uv init viennarna-course --python 3.13
cd viennarna-course

# 手順 3: ViennaRNA（Python バインディング）を入れる
uv add viennarna==2.7.2

# exercises フォルダを GitHub から入手してここにコピー
#   ${REPO}
#   緑の Code ボタン → Download ZIP → 展開`, 0.55, 1.3, 7.4, 3.2, { size: 14 });
    txt(s, '動作確認（手順 4）', 8.2, 1.3, 4.6, 0.4, { fontSize: 16, bold: true, color: T.primary });
    code(s, `uv run python -c "import RNA; print(RNA.__version__)"
# → 2.7.2

uv run python exercises/ex1_fold.py
# → ViennaRNA 2.7.2
#   GGCGCAGAAAUGCGCC
#   ((((((....)))))) -10.20 kcal/mol`, 8.2, 1.75, 4.6, 2.75, { size: 12 });
    card(s, 0.55, 4.75, 7.4, 1.95, 'フォルダ構成（完成形）', [{ text: 'viennarna-course/', mono: true }, { text: '  pyproject.toml   ← uv が作る（viennarna==2.7.2 が書かれる）', mono: true }, { text: '  .venv/           ← uv が作る仮想環境（触らない）', mono: true }, { text: '  exercises/       ← GitHub の ZIP から取り出してコピー', mono: true }], { size: 12, noBullet: true });
    card(s, 8.2, 4.75, 4.6, 1.95, 'ポイント', ['以後は必ず uv run python … で実行する（素の python では RNA が見つからない）', '2.7.2 以外が表示されたら uv add viennarna==2.7.2 をやり直す'], { size: 13, fill: T.accentSoft, titleColor: T.accent });
  }
  // I4 troubleshooting + alternative
  {
    const s = frame(pres, { title: 'うまくいかないとき・uv を使わない代替手順', tag, notes: notes({ time: '事前配布', points: ['代表的な症状と対応を表にまとめた。解決しない場合はエラー文をそのまま控えて当日 TA に見せる。', 'uv を使わない代替：既存の Python 3.10〜3.14 で仮想環境を作り pip で入れる。実行は .venv の python で行う。', '当日の動作確認は最初の 3 分。動かない人も TA・グループの画面共有で結果を比較しながら参加できる。'], refs: [REF.pypi, REF.pyapi] }) });
    const rows = [['症状', '原因の候補', '対応'], ['uv: command not found', 'PATH が未更新', 'ターミナルを開き直す／~/.local/bin/uv'], ['ModuleNotFoundError: No module named "RNA"', 'uv run を付けずに素の python を実行', 'uv run python … で実行する'], ['No solution found / viennarna が見つからない', 'Python のバージョン不一致、ネット未接続', 'uv init --python 3.13 で作り直す。接続を確認'], ['バージョンが 2.7.2 でない', '別環境の ViennaRNA', 'uv add viennarna==2.7.2 をやり直す'], ['exercises が見つからない', 'コピー先が違う', 'viennarna-course/exercises/ に置く'], ['Windows で文字化け', 'コンソールの文字コード', '出力の数値と括弧だけ確認できれば OK']];
    table(s, rows, 0.55, 1.3, 12.2, { colW: [3.9, 3.4, 4.9], size: 13, zebra: true });
    txt(s, 'uv を使わない代替（Python 3.10〜3.14 が入っている場合）', 0.55, 4.35, 7.4, 0.4, { fontSize: 16, bold: true, color: T.primary });
    code(s, `python -m venv .venv
# macOS:  source .venv/bin/activate      Windows:  .venv/Scripts/activate
python -m pip install viennarna==2.7.2
python -c "import RNA; print(RNA.__version__)"   # → 2.7.2`, 0.55, 4.8, 7.4, 1.9, { size: 12 });
    card(s, 8.2, 4.35, 4.6, 2.35, '当日までに', ['動作確認の出力が出たら準備完了', 'エラーが残る場合はエラー文を控えておく（当日 TA が対応）', '動かなくても参加可。TA・グループの画面で結果を比較する'], { size: 14, fill: T.accentSoft, titleColor: T.accent });
  }
};
