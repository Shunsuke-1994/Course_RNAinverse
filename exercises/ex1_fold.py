# 演習1A: 短いRNAを fold し、構造とエネルギーを読む（必須・単独で実行できます）
import RNA
print("ViennaRNA", RNA.__version__)      # 2.7.2 と出れば OK

seq = "GGCGCAGAAAUGCGCC"                 # 例題RNA（16 塩基）
ss, mfe = RNA.fold(seq)                  # 構造と最小自由エネルギー
print(seq)
print(ss, f"{mfe:.2f} kcal/mol")
