# 演習2A: 目標構造を指定し、RNA.inverse_fold を動かす（必須・単独で実行できます）
import RNA
target = "((((((....))))))"          # 目標構造（例題RNAと同じ形）
seed = 1                             # ← 変えると別の初期配列になる
RNA.init_rand(seed)
start = RNA.random_string(len(target), "ACGU")   # A/C/G/U の乱数配列
start_copy = start.encode().decode() # inverse_fold は start を上書きするので控え
seq, d = RNA.inverse_fold(start, target)
print("初期配列:", start_copy)
print("設計配列:", seq, " 残り距離 d =", d)
