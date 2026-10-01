"""
講習スライド用の全計算を1か所で行い、data.json に書き出す。
ViennaRNA 2.7.2 / Python 3.13 / デフォルトモデル (Turner 2004, 37 °C, dangles=2)
乱数は RNA.init_rand(seed) で固定。数値はすべてこのスクリプトの実測値。
"""
import RNA, json, random, sys, platform, datetime, statistics, math

OUT = 'build/data.json'
md = RNA.md()
KT = (md.temperature + 273.15) * 1.98717e-3   # kcal/mol (GASCONST=1.98717 cal/mol/K)
meta = dict(viennarna=RNA.__version__, python=platform.python_version(), os=platform.platform(),
            temperature=md.temperature, dangles=md.dangles, params='Turner 2004 (default)',
            kT=round(KT,5), date=str(datetime.date.today()))
print(meta)

# ---------- helpers ----------
def pairtable(ss):
    st=[]; pt=[-1]*len(ss)
    for i,c in enumerate(ss):
        if c=='(': st.append(i)
        elif c==')': j=st.pop(); pt[i]=j; pt[j]=i
    return pt
def hamming(a,b): return sum(x!=y for x,y in zip(a,b))
def fc_pf(seq):
    fc=RNA.fold_compound(seq); ss,e=fc.mfe(); fc.exp_params_rescale(e); pfs,G=fc.pf(); return fc,ss,e,G
def prob(seq, ss):
    fc,_,_,_=fc_pf(seq); return fc.pr_structure(ss)
def coords(ss):
    c=RNA.naview_xy_coordinates(ss); n=len(ss)
    return [[round(c[i].X,2), round(c[i].Y,2)] for i in range(n)]
def bpp_pairs(fc, n, thr=0.01):
    b=fc.bpp(); return [[i,j,round(b[i][j],3)] for i in range(1,n+1) for j in range(i+1,n+1) if b[i][j]>=thr]
def loops(ss):
    """ループ分解: 種類と構成位置(1-based)を返す"""
    pt=pairtable(ss); n=len(ss); out=[]
    # exterior
    ext=[]; i=0
    while i<n:
        if pt[i]==-1: ext.append(i+1); i+=1
        else: ext.append(i+1); ext.append(pt[i]+1); i=pt[i]+1
    out.append(dict(type='exterior', closing=None, positions=ext))
    for i in range(n):
        j=pt[i]
        if j<=i: continue
        inner=[]; k=i+1
        while k<j:
            if pt[k]>k: inner.append((k,pt[k])); k=pt[k]+1
            else: k+=1
        if not inner: t='hairpin'
        elif len(inner)==1:
            k,l=inner[0]
            if k==i+1 and l==j-1: t='stack'
            elif (k-i-1==0) or (j-l-1==0): t='bulge'
            else: t='interior'
        else: t='multiloop'
        out.append(dict(type=t, closing=[i+1,j+1], inner=[[k+1,l+1] for k,l in inner]))
    return out
def loop_energies(seq, ss):
    fc=RNA.fold_compound(seq); pt=RNA.ptable(ss); res=[]
    for L in loops(ss):
        i = 0 if L['closing'] is None else L['closing'][0]
        e=fc.eval_loop_pt(i, pt)/100.0
        res.append(dict(L, energy=round(e,2)))
    tot=round(sum(r['energy'] for r in res),2); ev=round(fc.eval_structure(ss),2)
    assert abs(tot-ev)<0.011, (tot,ev)
    return res, ev

data=dict(meta=meta)

# ---------- 例題RNA ----------
SEQ='GGCGCAGAAAUGCGCC'; TARGET='((((((....))))))'
fc,ss,e,G=fc_pf(SEQ); assert ss==TARGET
le,ev=loop_energies(SEQ,ss)
data['ex']=dict(seq=SEQ, ss=ss, mfe=round(e,2), G=round(G,2), p_mfe=round(fc.pr_structure(ss),3),
    ensemble_defect=round(fc.ensemble_defect(ss),3), coords=coords(ss), loops=le, bpp=bpp_pairs(fc,len(SEQ)),
    unpaired=[round(1-sum(fc.bpp()[min(i,j)][max(i,j)] for j in range(1,len(SEQ)+1) if j!=i),3) for i in range(1,len(SEQ)+1)])
subs=sorted(fc.subopt(400), key=lambda s:s.energy)
data['ex']['subopt']=[dict(ss=s.structure, e=round(s.energy,2), p=round(fc.pr_structure(s.structure),3)) for s in subs[:6]]
# 同じ配列に対する別構造のエネルギー(安定性比較)
alts=['((((((....))))))','(((((......)))))','.(((((....))))).','((((........))))','.((((......)))).','................']
data['stability']=[dict(ss=s, e=round(fc.eval_structure(s),2), p=round(fc.pr_structure(s),4)) for s in alts]
# 塩基対の本数が同じでもエネルギーが違う例
data['au_compare']=[dict(seq=s, ss=RNA.fold(s)[0], e=round(RNA.fold(s)[1],2)) for s in ['GGCGCAGAAAUGCGCC','UAUAUAGAAAUAUAUA','GCGCGCGAAAGCGCGC']]

# ---------- 一塩基変異 ----------
muts={}
allmut=[]
for i,c in enumerate(SEQ):
    for nb in 'ACGU':
        if nb==c: continue
        m=SEQ[:i]+nb+SEQ[i+1:]; f,s,en,g=fc_pf(m)
        row=dict(name=f'{c}{i+1}{nb}', pos=i+1, frm=c, to=nb, seq=m, ss=s, e=round(en,2), bpd=RNA.bp_distance(s,TARGET), p_mfe=round(f.pr_structure(s),3))
        allmut.append(row)
data['all_mutants']=allmut
for name in ['G4A','A8C','C3U','G1A','G2C']:
    row=[r for r in allmut if r['name']==name][0]
    f,s,en,g=fc_pf(row['seq'])
    sub=sorted(f.subopt(300), key=lambda x:x.energy)
    muts[name]=dict(row, G=round(g,2), coords=coords(s), loops=loop_energies(row['seq'],s)[0], bpp=bpp_pairs(f,16),
        subopt=[dict(ss=x.structure,e=round(x.energy,2),p=round(f.pr_structure(x.structure),3)) for x in sub[:6]])
data['mutants']=muts

# ---------- 構造要素の図用RNA (53 nt) ----------
TJ='..((((..(((.((....)).)))..((((.(((....)))))))..))))..'
best=None
for seed in range(1,31):
    RNA.init_rand(seed); st=RNA.random_string(len(TJ),'ACGU'); sq,d=RNA.inverse_fold(st,TJ); s,en=RNA.fold(sq)
    if s==TJ:
        p=prob(sq,TJ)
        if best is None or p>best['p']: best=dict(seed=seed, seq=sq, p=round(p,3), e=round(en,2))
print('elements RNA', best)
le2,_=loop_energies(best['seq'],TJ)
data['elements']=dict(best, ss=TJ, coords=coords(TJ), loops=le2)

# ---------- 塩基対距離の例 ----------
ex_bpd=[]
for s in ['((((((....))))))','.(((((....))))).','(((.((....)).)))','..((((....))))..','(((((......)))))','................']:
    ex_bpd.append(dict(ss=s, d=RNA.bp_distance(TARGET,s)))
data['bpd_examples']=ex_bpd
data['hamming_examples']=[dict(a=SEQ,b='GGCACAGAAAUGCGCC',h=hamming(SEQ,'GGCACAGAAAUGCGCC')), dict(a=SEQ,b='CGCGGAAACGUUCGUG',h=hamming(SEQ,'CGCGGAAACGUUCGUG'))]

# ---------- 演習2: RNAinverse (MFEモード) ----------
def design(target, seed, pf=False):
    RNA.init_rand(seed); st=RNA.random_string(len(target),'ACGU'); st0=st.encode().decode()
    if pf: sq,c=RNA.inverse_pf_fold(st,target)
    else:  sq,c=RNA.inverse_fold(st,target)
    s,en=RNA.fold(sq); p=prob(sq,target)
    return dict(seed=seed, start=st0, seq=sq, cost=round(c,3), refold=s, e=round(en,2), bpd=RNA.bp_distance(s,target), hamming=hamming(st0,sq), p_target=round(p,3),
                gc=round(sum(ch in 'GC' for ch in sq)/len(sq),2))
runs=[design(TARGET,seed) for seed in range(1,6)]
data['ex2']=dict(target=TARGET, runs=runs)
data['ex2']['pf_runs']=[design(TARGET,seed,pf=True) for seed in range(1,4)]
for r in data['ex2']['pf_runs']: r['p_from_cost']=round(math.exp(-r['cost']/KT),3)
# 温度を変えたときの目標構造確率
def prob_T(seq, ss, T):
    m=RNA.md(); m.temperature=T; f=RNA.fold_compound(seq,m); s,e=f.mfe(); f.exp_params_rescale(e); f.pf(); return round(f.pr_structure(ss),3), s
data['ex2']['temperature']=[dict(seq=r['seq'], p37=r['p_target'], p25=prob_T(r['seq'],TARGET,25)[0], p50=prob_T(r['seq'],TARGET,50)[0], p60=prob_T(r['seq'],TARGET,60)[0], mfe60=prob_T(r['seq'],TARGET,60)[1]) for r in runs]
data['ex2']['temperature_ex']=dict(seq=SEQ, p37=round(fc.pr_structure(TARGET),3), p25=prob_T(SEQ,TARGET,25)[0], p50=prob_T(SEQ,TARGET,50)[0], p60=prob_T(SEQ,TARGET,60)[0], p70=prob_T(SEQ,TARGET,70)[0])

# 多数回の統計 (40回)
def stats(target, N=40, seed0=100, give_up=0):
    RNA.cvar.give_up=give_up
    ok=0; ps=[]; fails=[]
    for k in range(N):
        r=design(target, seed0+k)
        if r['bpd']==0: ok+=1; ps.append(r['p_target'])
        else: fails.append(r)
    RNA.cvar.give_up=0
    return dict(target=target, n=N, success=ok, p_min=round(min(ps),2) if ps else None, p_median=round(statistics.median(ps),2) if ps else None, p_max=round(max(ps),2) if ps else None, fail_examples=fails[:3])
data['stats']={'A16':stats(TARGET), 'F18':stats('(((.(((....))).)))'), 'INT24':stats('(((((..(((....)))..)))))'), 'TWO26':stats('((((....))))..((((....))))'), 'JUNC53':stats(TJ, N=20)}
for k,v in data['stats'].items(): print(k, v['success'],'/',v['n'], v['p_min'], v['p_median'], v['p_max'], len(v['fail_examples']))

# 低確率の設計例(競合構造の説明用): 40回の中でP最小のもの
RNA.cvar.give_up=0
low=None
for k in range(40):
    r=design(TARGET,100+k)
    if r['bpd']==0 and (low is None or r['p_target']<low['p_target']): low=r
f,s,en,g=fc_pf(low['seq']); sub=sorted(f.subopt(300), key=lambda x:x.energy)
low['subopt']=[dict(ss=x.structure,e=round(x.energy,2),p=round(f.pr_structure(x.structure),3)) for x in sub[:5]]
low['bpp']=bpp_pairs(f,16); low['G']=round(g,2)
data['low_design']=low
print('low design', low['seq'], low['p_target'])

# 固定塩基(小文字)の例: ループを gaaa に固定
fixed=[]
for seed in range(1,4):
    RNA.init_rand(seed); st=RNA.random_string(16,'ACGU'); st=st[:6]+'gaaa'+st[10:]; st0=st.encode().decode()
    sq,c=RNA.inverse_fold(st,TARGET); s,en=RNA.fold(sq.upper())
    fixed.append(dict(seed=seed,start=st0,seq=sq,refold=s,e=round(en,2),bpd=RNA.bp_distance(s,TARGET),p_target=round(prob(sq.upper(),TARGET),3)))
data['fixed_runs']=fixed

# N を含む start を Python API に渡した場合の挙動(注意喚起用)
RNA.init_rand(1); nstart='N'*16; sqN,cN=RNA.inverse_fold(nstart.encode().decode(),TARGET)
data['n_wildcard_example']=dict(start='N'*16, result=sqN)

# ---------- 適応的探索の簡略トレース(教材用の再実装; RNAinverse本体の出力ではない) ----------
PAIRS=['GC','CG','AU','UA','GU','UG']
def gap(seq, target):
    """cost2 に相当: 目標構造のエネルギー − MFE (0 以上; 0 なら目標が MFE)"""
    f=RNA.fold_compound(seq); s,e=f.mfe(); return round(f.eval_structure(target)-e,2)
def simple_walk(start, target, seed):
    """RNAinverse (inverse.c, MFE モード) の要点を 1 本の配列全体に対して再現した教材用の簡略版。
    1) make_start: 目標の塩基対が対合できる文字に整合化  2) 不一致位置とその隣を候補にする
    3) 非対合位置は 1 塩基置換、対合位置はペアごと置換  4) d_bp が減った最初の変異を採用 (first improvement)
    5) 同点なら E(target)−E_mfe が減る変異を記憶し、改善がなければそれを採用  6) それもなければ停止
    実装との違い: 部分構造ごとの逐次探索 (aux_struct/WALK) は省略。"""
    rng=random.Random(seed); seq=list(start); pt_t=pairtable(target); n=len(seq)
    trace=[dict(step=0, seq=''.join(seq), ss=RNA.fold(''.join(seq))[0], e=round(RNA.fold(''.join(seq))[1],2), d=RNA.bp_distance(RNA.fold(''.join(seq))[0],target), change='乱数で作った初期配列')]
    # 1) 整合化
    changed=[]
    for i in range(n):
        j=pt_t[i]
        if j>i and (seq[i]+seq[j]) not in PAIRS:
            side = rng.choice([i,j]); other = j if side==i else i
            opts=[b for b in 'ACGU' if (seq[other]+b in PAIRS) or (b+seq[other] in PAIRS)]
            seq[side]=rng.choice(opts); changed.append(side+1)
    ss,en=RNA.fold(''.join(seq)); d=RNA.bp_distance(ss,target)
    trace.append(dict(step=0, seq=''.join(seq), ss=ss, e=round(en,2), d=d, change='整合化: 対合できない目標ペアを直す (位置 '+','.join(map(str,changed))+')'))
    step=0
    while d>0 and step<30:
        pt_s=pairtable(ss); mism=[i for i in range(n) if pt_t[i]!=pt_s[i]]
        cand=sorted(set(mism+[i-1 for i in mism if i>0]+[i+1 for i in mism if i<n-1]), key=lambda i:(i not in mism, rng.random()))
        improved=False; tie=None; cur_gap=gap(''.join(seq),target)
        for i in cand:
            if pt_t[i]==-1: trials=[(i,None,b) for b in 'ACGU' if b!=seq[i]]
            else:
                j=pt_t[i]; trials=[(min(i,j),max(i,j),pr) for pr in PAIRS if pr!=seq[min(i,j)]+seq[max(i,j)]]
            rng.shuffle(trials)
            for tr in trials:
                new=seq[:]
                if tr[1] is None: new[tr[0]]=tr[2]; ch=f'位置{tr[0]+1}: {seq[tr[0]]}→{tr[2]}'
                else: new[tr[0]]=tr[2][0]; new[tr[1]]=tr[2][1]; ch=f'ペア({tr[0]+1},{tr[1]+1}): {seq[tr[0]]}{seq[tr[1]]}→{tr[2]}'
                s2,e2=RNA.fold(''.join(new)); d2=RNA.bp_distance(s2,target)
                if d2<d:
                    seq=new; ss=s2; en=e2; d=d2; step+=1; improved=True
                    trace.append(dict(step=step, seq=''.join(seq), ss=ss, e=round(en,2), d=d, change=ch)); break
                if d2==d and tie is None:
                    g2=gap(''.join(new),target)
                    if g2<cur_gap: tie=(new,s2,e2,ch,g2)
            if improved: break
        if not improved:
            if tie:
                seq,ss,en,ch,g2=tie; step+=1
                trace.append(dict(step=step, seq=''.join(seq), ss=ss, e=round(en,2), d=d, change=ch+' (同点: エネルギー差 %.1f→%.1f)'%(cur_gap,g2)))
                continue
            break
    return trace, d==0
walks={}
for tname,tgt in [('A16',TARGET),('F18','(((.(((....))).)))'),('INT24','(((((..(((....)))..)))))')]:
    for seed in range(1,9):
        RNA.init_rand(seed); st=RNA.random_string(len(tgt),'ACGU').encode().decode()
        tr,ok=simple_walk(st,tgt,seed); walks[f'{tname}_{seed}']=dict(target=tgt, start=st, trace=tr, success=ok, steps=len(tr)-1)
        print('walk',tname,seed,'steps',len(tr)-1,'ok',ok)
data['walks']=walks

# ---------- Nussinov (最大塩基対数) 教材モデル vs 熱力学 ----------
def nussinov(seq, minloop=3):
    n=len(seq); N=[[0]*n for _ in range(n)]; canp=lambda a,b: (a+b) in PAIRS
    for l in range(1,n):
        for i in range(n-l):
            j=i+l; best=max(N[i+1][j] if i+1<=j else 0, N[i][j-1])
            if j-i-1>=minloop and canp(seq[i],seq[j]): best=max(best, N[i+1][j-1]+1)
            for k in range(i+1,j): best=max(best, N[i][k]+N[k+1][j])
            N[i][j]=best
    # traceback
    ss=['.']*n
    def tb(i,j):
        if i>=j: return
        if N[i][j]==N[i][j-1]: tb(i,j-1); return
        if N[i][j]==N[i+1][j]: tb(i+1,j); return
        if j-i-1>=minloop and canp(seq[i],seq[j]) and N[i][j]==N[i+1][j-1]+1: ss[i]='('; ss[j]=')'; tb(i+1,j-1); return
        for k in range(i+1,j):
            if N[i][j]==N[i][k]+N[k+1][j]: tb(i,k); tb(k+1,j); return
    tb(0,n-1)
    assert ''.join(ss).count('(')==N[0][n-1], ('nussinov traceback mismatch', ''.join(ss), N[0][n-1])
    return N, ''.join(ss)
Nt, nss = nussinov(SEQ)
data['nussinov']=dict(seq=SEQ, table=Nt, ss=nss, pairs=Nt[0][len(SEQ)-1], e_of_nussinov=round(fc.eval_structure(nss),2), mfe_pairs=TARGET.count('('), mfe=round(e,2))
print('nussinov', nss, Nt[0][15], data['nussinov']['e_of_nussinov'])
# 最大塩基対数の構造と熱力学 MFE が食い違う反例を探す (一塩基変異体と乱数配列から)
counter=None
cands=[r['seq'] for r in allmut]
rng=random.Random(0); cands+=[''.join(rng.choice('ACGU') for _ in range(16)) for _ in range(300)]
for sq in cands:
    Nc,nsc=nussinov(sq); s,en=RNA.fold(sq); f=RNA.fold_compound(sq)
    if nsc!=s and Nc[0][15]>s.count('(') and f.eval_structure(nsc)-en>3.0:
        counter=dict(seq=sq, nussinov_ss=nsc, nussinov_pairs=Nc[0][15], e_of_nussinov=round(f.eval_structure(nsc),2), mfe_ss=s, mfe_pairs=s.count('('), mfe=round(en,2), table=Nc); break
data['nussinov_counter']=counter
print('counterexample', counter and (counter['seq'], counter['nussinov_ss'], counter['e_of_nussinov'], counter['mfe_ss'], counter['mfe']))

# ---------- 構造の数 (DP の必要性の説明用) ----------
def count_structs(n, seq=None, minloop=3):
    """区間 [i,j] の二次構造数 (擬似結び目なし)。seq=None なら任意の塩基対を許す。"""
    C=[[1]*(n+1) for _ in range(n+1)]
    canp=(lambda i,j: True) if seq is None else (lambda i,j: (seq[i]+seq[j]) in PAIRS)
    for l in range(1,n):
        for i in range(n-l):
            j=i+l; tot=C[i+1][j] if i+1<=j else 1   # i は非対合
            for k in range(i+minloop+1, j+1):        # i が k と対合
                if canp(i,k): tot+= (C[i+1][k-1] if i+1<=k-1 else 1) * (C[k+1][j] if k+1<=j else 1)
            C[i][j]=tot
    return C[0][n-1]
data['counts']=dict(ex16_canonical=count_structs(16,SEQ), any16=count_structs(16), any30=count_structs(30), any50=count_structs(50), any100=str(count_structs(100)), any100_log10=round(math.log10(count_structs(100)),1))
print('counts', data['counts'])

json.dump(data, open(OUT,'w'), ensure_ascii=False, indent=1)
print('wrote', OUT)
