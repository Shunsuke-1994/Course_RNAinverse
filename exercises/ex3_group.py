# 発展問題（グループ）: 目標や条件を一つ変えて比較する（時間があれば・グループの裁量で。単独で実行できます）
import RNA

def target_probability(seq, target, temperature=37.0):
    md = RNA.md(); md.temperature = temperature
    fc = RNA.fold_compound(seq, md)
    ss, mfe = fc.mfe()
    fc.exp_params_rescale(mfe)
    fc.pf()
    return fc.pr_structure(target)

# A. 目標構造を変える（1 つ選んでコメントを外す）
target = "(((((..(((....)))..)))))"                        # 内部ループ入り 24 塩基
# target = "((((....))))..((((....))))"                    # 2 ヘアピン 26 塩基
# target = "..((((..(((.((....)).)))..((((.(((....)))))))..)))).."  # 3 分岐 53 塩基（難しい）

for seed in range(1, 6):
    RNA.init_rand(seed)
    start = RNA.random_string(len(target), "ACGU")
    # B. 塩基を固定するなら: 小文字にする（例: 16 塩基の目標でループを gaaa に）
    # start = start[:6] + "gaaa" + start[10:]
    seq, d = RNA.inverse_fold(start, target)
    ss, mfe = RNA.fold(seq.upper())
    p37 = target_probability(seq.upper(), target)
    p60 = target_probability(seq.upper(), target, 60.0)   # C. 温度を変えて再計算
    print(seed, seq, ss, f"{mfe:.2f}", "d =", RNA.bp_distance(ss, target), f"P37 = {p37:.3f}", f"P60 = {p60:.3f}")
