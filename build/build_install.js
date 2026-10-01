// 事前配布用: インストール手順のみのデッキ
const pptxgen = require('pptxgenjs');
const path = require('path');
const L = require('./lib');
const { T, F, txt, VERSION, REPO_SHORT, NAMES } = L;
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; pres.author = '角 俊輔'; pres.title = `ViennaRNA 講習 事前準備：インストール手順 ${VERSION}`; pres.lang = 'ja-JP';
const _add = pres.addSlide.bind(pres);
pres.addSlide = function (o) { const s = _add(o); s._pres = pres; return s; };
// 表紙
{
  const s = pres.addSlide(); pres._n = 1; s.background = { color: T.primary };
  txt(s, '事前準備：ViennaRNA 実習環境のインストール手順', 0.8, 1.6, 11.5, 1.3, { fontSize: 36, bold: true, color: T.white, valign: 'middle' });
  txt(s, '分子ロボティクス夏の学校 2026「ViennaRNA：RNA構造解析ソフトウェア」', 0.8, 3.0, 11.5, 0.6, { fontSize: 20, color: 'DCE9EC' });
  txt(s, '講師：角 俊輔\n講習日：2026年10月8日（木）19:00–21:00（Zoom）\n当日までに手順 1〜4 で環境を用意し、最後の動作確認まで済ませてください（所要 10〜15 分）', 0.8, 4.0, 11.5, 1.8, { fontSize: 20, color: T.white, paraSpaceAfter: 6 });
  txt(s, '使用ソフトウェア：uv（環境管理）、Python 3.13、ViennaRNA 2.7.2（PyPI: viennarna）', 0.8, 6.0, 11.5, 0.45, { fontSize: 16, color: 'B7C8CC' });
  txt(s, `資料・演習スクリプトの公開先：${REPO_SHORT}　（資料 ${VERSION}）`, 0.8, 6.5, 11.5, 0.45, { fontSize: 16, color: T.white });
  s.addNotes('事前配布用。本編スライドの 2〜5 枚目と同じ内容。');
}
require('./install')(pres);
const out = path.resolve(__dirname, '..', NAMES.install + '.pptx');
pres.writeFile({ fileName: out }).then(f => console.log('wrote', f));
