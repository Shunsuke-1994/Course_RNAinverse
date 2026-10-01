# 演習用スクリプト（ViennaRNA 2.7.2, Python）

分子ロボティクス夏の学校 2026「ViennaRNA：RNA構造解析ソフトウェア」（2026-10-08）の実習で使う短いスクリプトです。
長いコードを手入力する必要はありません。配列・目標構造・seed だけを書き換えて実行してください。

最新版は GitHub で公開しています: https://github.com/Shunsuke-1994/Course_RNAinverse
（緑の **Code** ボタン → **Download ZIP** で入手し、展開した中の `exercises/` を自分のプロジェクトにコピーします）

## 事前準備（uv を使う場合）

```bash
uv init viennarna-course --python 3.13
cd viennarna-course
uv add viennarna==2.7.2
uv run python -c "import RNA; print(RNA.__version__)"   # 2.7.2 と表示されれば OK
```

このリポジトリをそのまま使う場合は、リポジトリ直下で `uv sync` を実行し、`uv run python exercises/ex1_fold.py` のように起動します。

- 動作確認済み: macOS 15 / Python 3.13 / viennarna 2.7.2 / uv 0.12、Windows 11 / Python 3.13.15 / viennarna 2.7.2（事務局で確認）
- 上記以外の構成は未検証です。PyPI には各 OS 向けの wheel がありますが、全環境での動作は保証できません。
- 演習はグループで行い、提出担当者の画面共有で進めます。自分の環境が動かなくても、グループの画面を見ながら参加できます。

## 実行のしかた

どのスクリプトも **単独で実行できます**（前のステップの結果を引き継ぎません）。途中で躓いても、次のスクリプトからやり直せます。

```bash
uv run python ex0_check.py      # exercises フォルダの中で実行する場合
```

## ファイル

| ファイル | 演習 | 区分 | 内容 |
|---|---|---|---|
| ex0_check.py | 準備 | 必須 | バージョン（2.7.2）と例題RNAの長さ（16）を表示して環境を確認 |
| ex1_fold.py | 1A | 必須 | 例題RNA (GGCGCAGAAAUGCGCC) を fold し、構造と MFE を表示 |
| ex1b_mutate.py | 1B | 必須 | 1 塩基を変えて構造・エネルギー・塩基対距離を比較 |
| ex2a_inverse.py | 2A | 必須 | 目標構造 `((((((....))))))` に対して RNA.inverse_fold を実行 |
| ex2b_refold.py | 2B | 必須 | 設計配列を再予測し、塩基対距離と Hamming 距離を表示（2A の計算も中で再実行） |
| ex2c_repeat.py | 2C | 必須 | seed 1〜5 で 5 回設計して候補を集める |
| ex2d_probability.py | 2D | 時間があれば | 各候補の目標構造確率 P(T) を計算、inverse_pf_fold と比較 |
| ex3_group.py | 発展 | グループの裁量 | 目標構造・固定塩基・温度のいずれかを変えて比較 |

演習2は 40 分です。**2A〜2C まで進めば十分**です。2D は時間があれば、発展問題（ex3）はグループの裁量で取り組んでください。

## 注意（Python API の落とし穴）

- `RNA.inverse_fold(start, target)` は **引数 `start` の文字列を結果で上書き** します（C 側で書き換えるため）。初期配列を後で使う場合は `start_copy = start.encode().decode()` のように控えを取ってください。
- `N` などのワイルドカードは Python API では置き換えられません（コマンドライン版 RNAinverse だけの処理）。初期配列は A/C/G/U で作ります。
- 小文字の塩基は固定されます（例: `gaaa`）。
- `RNA.init_rand(seed)` で乱数を固定できますが、乱数生成の実装は OS により異なり、**同じ seed でも Windows と macOS では設計配列が変わります**。資料の数値は macOS で計測したものです（下記）。
- 構造確率の計算は、同じモデル条件（温度・パラメータ）で、配列と構造の組が有効なものに対して行ってください。

## 期待される出力（macOS で計測）

`expected_output.txt` を参照してください。

### Windows では演習2の配列が資料と違います（失敗ではありません）

演習2（2A〜2D、発展問題）の初期配列・設計配列・ΔG・P(T) は、Windows では資料の値と一致しません。例（Windows 11, seed=1）：

- 設計配列 `UGAUGUCUUGAUGUCA`、P(目標) = 0.359（macOS では `CGCGGAAACGUUCGUG`、0.616）

**`d = 0`（目標との塩基対距離 0）になっていれば成功**です。`inverse_pf_fold` の P(目標) = 0.976 は Windows でも同じ値になります。演習1（1A・1B）は乱数を使わないので、どの OS でも資料と同じ出力になります。
