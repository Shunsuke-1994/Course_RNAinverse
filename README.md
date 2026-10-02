# ViennaRNA 講習（分子ロボティクス夏の学校 2026, 2026-10-08）

「ViennaRNA：RNA構造解析ソフトウェア」（講師 角 俊輔）の授業資料と演習スクリプトです。
**このリポジトリからダウンロードすれば、スライドも演習もそのまま使えます。**

- 公開先: https://github.com/Shunsuke-1994/Course_RNAinverse
- 現在の版: **v2.1**（版は表紙と各ページ下に表示しています。更新した場合はファイル名の版を上げます）

| 資料 | ファイル |
|---|---|
| 講義スライド（PDF） | [`ViennaRNA_講習_v2.1.pdf`](ViennaRNA_講習_v2.1.pdf) |
| 事前準備：インストール手順（PDF） | [`ViennaRNA_講習_事前準備_インストール手順_v2.1.pdf`](ViennaRNA_講習_事前準備_インストール手順_v2.1.pdf) |
| 演習用スクリプト | [`exercises/`](exercises/)（使い方は [`exercises/README.md`](exercises/README.md)） |

## 使い方

### 1. ダウンロードする

- **ZIP（おすすめ）**: このページ上部の緑の **Code** ボタン → **Download ZIP** → ダウンロードした ZIP を展開します。`Course_RNAinverse-main` というフォルダができます。
- **git を使う場合**:
  ```bash
  git clone https://github.com/Shunsuke-1994/Course_RNAinverse.git
  ```

### 2. Python と ViennaRNA を用意する（A か B のどちらか）

先に uv をインストールしておきます（事前準備 PDF の手順 1）。

**A. 事前準備の手順どおりに `viennarna-course` を作った人**

展開したフォルダの中の `exercises/` を、`viennarna-course/` の中にコピーします。

```bash
cd viennarna-course
uv run python exercises/ex0_check.py
```

**B. ダウンロードしたフォルダをそのまま使う人**

フォルダの中で `uv sync` を 1 回実行すると、Python 3.13 と viennarna 2.7.2 が入ります（ほかのパッケージは入りません）。

```bash
cd Course_RNAinverse-main      # git clone した場合は cd Course_RNAinverse
uv sync
uv run python exercises/ex0_check.py
```

どちらの場合も、次のように表示されれば準備完了です。

```
ViennaRNA 2.7.2
配列: GGCGCAGAAAUGCGCC
長さ: 16
```

### 3. 演習を動かす

`uv run python exercises/ex1_fold.py` のように、スライドに書かれたスクリプトを実行します。どのスクリプトも単独で動くので、途中のステップからでも始められます。各スクリプトの区分（必須／時間があれば）、期待される出力、Windows での注意は [`exercises/README.md`](exercises/README.md) にまとめています。

- 動作確認済み: macOS 15（Python 3.13.4）、Windows 11（Python 3.13.15）、いずれも viennarna 2.7.2
- Windows では、同じ seed でも演習2の設計配列が資料の値と変わります。`d = 0` なら成功です。

## 質問・不具合の報告（講義後も対応します）

質問は GitHub の [Issues](https://github.com/Shunsuke-1994/Course_RNAinverse/issues) で受け付けています。講義が終わったあとでも構いません。

1. このページ上部の **Issues** タブ → **New issue** を押す（GitHub アカウントが必要です）
2. タイトルに質問の要点、本文に詳しい内容を書く
3. エラーのときは、**実行したコマンド・表示されたエラー文・OS（macOS / Windows）** を書いてもらえると答えやすいです

Issues は誰でも読める公開の場です。名前やメールアドレスなどの個人情報は書かないでください。

## リポジトリの中身

- `ViennaRNA_講習_v2.1.pptx` / `.pdf` — 講義スライド。表紙＋事前準備 4 枚＋GitHub の案内 1 枚＋本編 36 枚＋補足 8 枚（計 50 枚、話者ノート付き、16:9）
- `ViennaRNA_講習_事前準備_インストール手順_v2.1.pptx` / `.pdf` — 事前配布用のインストール手順と GitHub の案内（6 ページ）
- `exercises/` — 演習用スクリプト、README、`expected_output.txt`（macOS での実測出力）
- `pyproject.toml` / `uv.lock` / `.python-version` — 上の B で使う環境の定義（viennarna==2.7.2）
- `build/` — スライドを再生成するためのソース
  - `compute.py` → `data.json`：ViennaRNA 2.7.2 で全数値を計算（seed 固定）
  - `figures.py` → `fig/`：数式画像（matplotlib mathtext。LaTeX 原文は `fig/equations.json`）
  - `lib.js`, `main1.js`, `main2.js`, `supp.js`, `install.js`, `build.js`, `build_install.js`：pptxgenjs によるスライド生成。版（`VERSION`）と出力ファイル名は `lib.js` の先頭で定義
  - `render.sh`：PowerPoint 経由の PDF 出力とプレビュー生成
  - `papers/`：スライドで引用した図の切り出し

## 引用図について
スライド中の論文図（Hofacker et al. 1994 Fig. 5、Green et al. 2014、Geary et al. 2014 Supplementary Fig. S4）の著作権は各著者・出版社に帰属します。出典は各スライドと補足8に記載しています。

## 再生成（講師・開発者向け）
```bash
uv sync --group build
uv run python build/compute.py && uv run python build/figures.py
(cd build && npm install && node build.js && node build_install.js && ./render.sh && ./render.sh install)
```
版を上げるときは `build/lib.js` の `VERSION` を変えて再生成し、古い版のファイルを削除します。
