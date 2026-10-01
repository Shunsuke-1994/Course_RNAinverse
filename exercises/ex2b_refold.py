# 演習2B: 設計配列を再び fold し、目標と比較する（必須・単独で実行できます。2A の計算もこの中でやり直すので、2A で躓いてもここから始められます）
import RNA
target = "((((((....))))))"
seed = 1
RNA.init_rand(seed)
start = RNA.random_string(len(target), "ACGU")
start_copy = start.encode().decode()
seq, d = RNA.inverse_fold(start, target)

ss, mfe = RNA.fold(seq)                 # 設計配列を再予測
print(seq)
print(ss, f"{mfe:.2f}")
print(target, "← 目標")
print("目標との塩基対距離 =", RNA.bp_distance(ss, target))
print("初期配列からの Hamming 距離 =",
      sum(a != b for a, b in zip(start_copy, seq)))
