# 演習2C: 複数回設計し、異なる配列の候補を集める（必須・単独で実行できます）
import RNA
target = "((((((....))))))"
results = []
for seed in range(1, 6):                       # 5 回だけ
    RNA.init_rand(seed)
    start = RNA.random_string(len(target), "ACGU")
    seq, d = RNA.inverse_fold(start, target)
    ss, mfe = RNA.fold(seq)
    results.append((seed, seq, ss, mfe, RNA.bp_distance(ss, target)))
for r in results:
    print(r[0], r[1], r[2], f"{r[3]:.2f}", "d =", r[4])
