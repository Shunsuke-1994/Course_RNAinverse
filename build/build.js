const pptxgen = require('pptxgenjs');
const path = require('path');
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.author = '角 俊輔'; pres.title = `ViennaRNA：RNA構造解析ソフトウェア（分子ロボティクス夏の学校 2026）${require('./lib').VERSION}`; pres.lang = 'ja-JP';
// pptxgenjs の slide に pres を紐付ける（ヘルパーが shapes を参照するため）
const _add = pres.addSlide.bind(pres);
pres.addSlide = function (o) { const s = _add(o); s._pres = pres; return s; };
require('./main1')(pres, { afterCover: p => require('./install')(p) });
require('./main2')(pres);
require('./supp')(pres);
const out = path.resolve(__dirname, '..', require('./lib').NAMES.main + '.pptx');
pres.writeFile({ fileName: out }).then(f => console.log('wrote', f));
