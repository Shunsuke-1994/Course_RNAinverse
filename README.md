# ViennaRNA 講習（分子ロボティクス夏の学校 2026, 2026-10-08）

「ViennaRNA：RNA構造解析ソフトウェア」（講師 角 俊輔）の授業資料と演習スクリプトを公開しています。

- 公開先: https://github.com/Shunsuke-1994/Course_RNAinverse
- 現在の版: **v1.0**（版は表紙と各ページ下に表示しています。更新した場合はファイル名の版を上げます）

## 受講者の方へ

1. 事前準備の手順 `ViennaRNA_講習_事前準備_インストール手順_v1.0.pdf` に沿って環境を用意してください（所要 10〜15 分）。
2. このページ右上の緑の **Code** ボタン → **Download ZIP** でダウンロードし、展開した中の `exercises/` フォルダを自分のプロジェクト（`viennarna-course/`）にコピーします。git を使える人は `git clone https://github.com/Shunsuke-1994/Course_RNAinverse.git` でも構いません。
3. 講義スライドは `ViennaRNA_講習_v1.0.pdf` です。

## ファイル
- `ViennaRNA_講習_v1.0.pptx` / `.pdf` — 講義スライド。表紙＋事前準備 4 枚＋本編 36 枚＋補足 8 枚（計 49 枚、話者ノート付き、16:9）
- `ViennaRNA_講習_事前準備_インストール手順_v1.0.pptx` / `.pdf` — 事前配布用のインストール手順のみ（5 ページ）
- `exercises/` — 演習用スクリプト、README（実行方法、必須／時間があればの区分、Windows での注意）、`expected_output.txt`（macOS での実測出力）
- `build/` — スライドを再生成するためのソース
  - `compute.py` → `data.json`：ViennaRNA 2.7.2 で全数値を計算（seed 固定）
  - `figures.py` → `fig/`：数式画像（matplotlib mathtext。LaTeX 原文は `fig/equations.json`）
  - `lib.js`, `main1.js`, `main2.js`, `supp.js`, `install.js`, `build.js`, `build_install.js`：pptxgenjs によるスライド生成。版（`VERSION`）と出力ファイル名は `lib.js` の先頭で定義
  - `render.sh`：PowerPoint 経由の PDF 出力とプレビュー生成
  - `papers/`：スライドで引用した図の切り出し

## 引用図について
スライド中の論文図（Hofacker et al. 1994 Fig. 5、Green et al. 2014、Geary et al. 2014 Supplementary Fig. S4）の著作権は各著者・出版社に帰属します。出典は各スライドと補足8に記載しています。

## 再生成
```bash
uv sync --group build
uv run python build/compute.py && uv run python build/figures.py
(cd build && npm install && node build.js && node build_install.js && ./render.sh && ./render.sh install)
```
版を上げるときは `build/lib.js` の `VERSION` を変えて再生成し、古い版のファイルを削除します。
