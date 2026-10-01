#!/bin/bash
# pptx → PDF (PowerPoint.app 経由; サンドボックスの都合でコンテナ内で変換) → PNG プレビュー
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# 引数: main（既定）| install | 拡張子なしのファイル名。版付きの名前は lib.js の NAMES から取る
case "${1:-main}" in
  main|install) NAME="$(node -p "require('$ROOT/build/lib').NAMES['${1:-main}']")" ;;
  *) NAME="$1" ;;
esac
PPTX="$ROOT/$NAME.pptx"
C="$HOME/Library/Containers/com.microsoft.Powerpoint/Data"
cp "$PPTX" "$C/deck_tmp.pptx"; rm -f "$C/deck_tmp.pdf"
osascript <<APPLESCRIPT
with timeout of 600 seconds
tell application "Microsoft PowerPoint"
  open (POSIX file "$C/deck_tmp.pptx")
  set thePres to active presentation
  save thePres in (POSIX file "$C/deck_tmp.pdf") as save as PDF
  close thePres saving no
end tell
end timeout
APPLESCRIPT
cp "$C/deck_tmp.pdf" "$ROOT/$NAME.pdf"
rm -f "$C/deck_tmp.pptx" "$C/deck_tmp.pdf"
PREV="$ROOT/build/preview/$NAME"; mkdir -p "$PREV"; rm -f "$PREV"/*.png
export PATH="$HOME/.local/bin:$PATH"; export NAME
cd "$ROOT" && uv run python - <<PY
import pymupdf
from PIL import Image
import os; name=os.environ["NAME"]; d=pymupdf.open(name+".pdf"); print("pages", len(d))
imgs=[]
for i,p in enumerate(d):
    pix=p.get_pixmap(dpi=80); pix.save(f"build/preview/{name}/s{i+1:02d}.png")
    imgs.append(Image.frombytes('RGB',[pix.width,pix.height],pix.samples))
# 2x2 contact sheets
w,h=imgs[0].size
for k in range(0,len(imgs),4):
    sheet=Image.new('RGB',(2*w+20,2*h+20),'#777777')
    for j,im in enumerate(imgs[k:k+4]): sheet.paste(im,((j%2)*(w+20),(j//2)*(h+20)))
    sheet.save(f"build/preview/{name}/sheet_{k//4+1:02d}.png")
print("done")
PY
