# 演習2D: 目標構造の確率を計算し、候補を比較する（時間があれば・単独で実行できます。2C の計算もこの中でやり直します）
import RNA
target = "((((((....))))))"

def target_probability(seq, target):
    fc = RNA.fold_compound(seq)          # 同じモデル条件（37 ℃）
    ss, mfe = fc.mfe()
    fc.exp_params_rescale(mfe)
    fc.pf()                              # 分配関数
    return fc.pr_structure(target)       # 目標構造の確率 P(T)

results = []
for seed in range(1, 6):
    RNA.init_rand(seed)
    start = RNA.random_string(len(target), "ACGU")
    seq, d = RNA.inverse_fold(start, target)
    ss, mfe = RNA.fold(seq)
    results.append((seed, seq, ss, mfe, RNA.bp_distance(ss, target)))

for seed, seq, ss, mfe, d in results:
    print(seed, seq, f"d = {d}", f"P(目標) = {target_probability(seq, target):.3f}")

# 発展: 目標構造の確率を最大化する版
RNA.init_rand(1)
start = RNA.random_string(len(target), "ACGU")
seq_pf, cost = RNA.inverse_pf_fold(start, target)
print("inverse_pf_fold:", seq_pf, f"P(目標) = {target_probability(seq_pf, target):.3f}")
