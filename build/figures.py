"""数式を PNG に描画する (matplotlib mathtext, 透過背景)。PowerPoint 上で編集可能にはならないため、LaTeX 原文を data 側にも残す。"""
import matplotlib; matplotlib.use('Agg')
import matplotlib.pyplot as plt, json, os
plt.rcParams['mathtext.fontset']='stix'; plt.rcParams['font.family']='STIXGeneral'
OUT='build/fig'; os.makedirs(OUT, exist_ok=True)
EQ = {
 'eq_energy':   r'$E(S)=\sum_{L\in\mathrm{loops}(S)}\Delta G(L)$',
 'eq_mfe':      r'$S^{*}=\arg\min_{S}\,E(S)$',
 'eq_boltz':    r'$P(S)=\dfrac{e^{-E(S)/RT}}{Z},\qquad Z=\sum_{S^{\prime}} e^{-E(S^{\prime})/RT}$',
 'eq_bpp':      r'$p_{ij}=\sum_{S\ni(i,j)} P(S)$',
 'eq_G':        r'$G_{\mathrm{ens}}=-RT\ln Z$',
 'eq_bpd':      r'$d_{\mathrm{bp}}(S,T)=\left|S\setminus T\right|+\left|T\setminus S\right|$',
 'eq_inverse':  r'$x^{*}=\arg\min_{x}\; d_{\mathrm{bp}}\!\left(\mathrm{MFE}(x),\,T\right)$',
 'eq_inverse_pf': r'$x^{*}=\arg\max_{x}\; P(T\mid x)=\arg\min_{x}\left[E(x,T)+RT\ln Z(x)\right]$',
 'eq_nussinov': r'$N(i,j)=\max\left\{N(i{+}1,j),\; N(i,j{-}1),\; N(i{+}1,j{-}1)+\delta_{ij},\; \max_{i<k<j}\left[N(i,k)+N(k{+}1,j)\right]\right\}$',
 'eq_zuker_F':  r'$F_{ij}=\min\left\{F_{i+1,j},\; \min_{i<k\leq j}\left[C_{ik}+F_{k+1,j}\right]\right\}$',
 'eq_zuker_C':  r'$C_{ij}=\min\left\{\mathcal{H}(i,j),\; \min_{i<k<l<j}\left[C_{kl}+\mathcal{I}(i,j;k,l)\right],\; \min_{i<u<j}\left[M_{i+1,u}+M^{1}_{u+1,j-1}+a\right]\right\}$',
 'eq_zuker_M':  r'$M_{ij}=\min\left\{\min_{i<u<j}\left[(u-i)c+C_{uj}+b\right],\; \min_{i<u<j}\left[M_{i,u-1}+C_{uj}+b\right],\; M_{i,j-1}+c\right\}$',
 'eq_zuker_M1': r'$M^{1}_{ij}=\min\left\{M^{1}_{i,j-1}+c,\; C_{ij}+b\right\}$',
 'eq_ed':       r'$\mathrm{ED}(T)=1-\frac{1}{n}\left[\sum_{(i,j)\in T}p_{ij}+\sum_{i\,\mathrm{unpaired\ in}\,T}q_i\right]$',
 'eq_p_example': r'$P(S)=\dfrac{e^{-E(S)/RT}}{Z}=e^{-(E(S)-G_{\mathrm{ens}})/RT}$',
 'eq_kT':       r'$RT=0.616\ \mathrm{kcal/mol}\ (37^{\circ}\mathrm{C})$',
}
sizes={'eq_nussinov':26,'eq_zuker_C':24,'eq_zuker_M':24,'eq_inverse_pf':28,'eq_ed':28}
for k,tex in EQ.items():
    fs=sizes.get(k,32)
    fig=plt.figure(figsize=(0.1,0.1)); t=fig.text(0,0,tex,fontsize=fs,color='#1F2A30')
    fig.savefig(f'{OUT}/{k}.png',dpi=300,transparent=True,bbox_inches='tight',pad_inches=0.05); plt.close(fig)
from PIL import Image
info={k:dict(tex=v, **dict(zip(('w','h'), Image.open(f'{OUT}/{k}.png').size))) for k,v in EQ.items()}
json.dump(info, open(f'{OUT}/equations.json','w'), ensure_ascii=False, indent=1)
print('equations written', len(EQ))
