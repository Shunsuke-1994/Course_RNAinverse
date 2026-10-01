# 演習1B: 一塩基を変え、構造とエネルギーを比較する（必須・単独で実行できます）
import RNA
seq = "GGCGCAGAAAUGCGCC"
pos, new = 4, "A"          # ← ここを変える（位置は 1 始まり）
mut = seq[:pos-1] + new + seq[pos:]
for name, s in [("元の配列", seq), ("変更後  ", mut)]:
    ss, mfe = RNA.fold(s)
    print(name, s, ss, f"{mfe:.2f}")
print("塩基対距離 =", RNA.bp_distance(RNA.fold(seq)[0], RNA.fold(mut)[0]))
