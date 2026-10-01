# 演習1の準備: ViennaRNA が使えるか確認する（単独で実行できます）
import RNA
print("ViennaRNA", RNA.__version__)      # 2.7.2 と出れば OK

seq = "GGCGCAGAAAUGCGCC"                 # 例題RNA（16 塩基）
print("配列:", seq)
print("長さ:", len(seq))                 # 16 と出れば OK
