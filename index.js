/* global hexo */
'use strict';

const fs = require('fs');
const path = require('path');

const cssPath = 'css/alertCard.css';

// カスタムCSSのコピー用ジェネレータを登録
hexo.extend.generator.register('alert_card', function (locals) {
  const sourcePath = path.join(__dirname, 'style.css');   // このファイルのあるディレクトリからの相対パス
  const isFileExists = fs.existsSync(sourcePath); // ファイルの存在確認

  //  元ファイルが存在する場合のみ処理を続行
  if (isFileExists) {
    this.route.set(cssPath, function () {
      // `fs`モジュールを使用してファイルを読み込み
      return fs.createReadStream(sourcePath);
    });
  } else {
    console.error("見つかりませんでした" + sourcePath);
  }
});

//  HTMLのレンダリング後にCSSリンクを挿入
hexo.extend.filter.register('after_render:html', function (content) {
  // HTMLに挿入する<link>タグ
  const cssLink = `<link rel="stylesheet" href="/${cssPath}">`;

  // </head>タグ直前に<link>タグを挿入
  if (content.includes('</head>')) {
    content = content.replace('</head>', `${cssLink}</head>`);
  }

  return content;
});

//  アラートブロックを生成するタグ
hexo.extend.tag.register('alert', function (args, content) {
  const type = args[0];
  const title = args.length > 1 ? args[1] : '';

  content = hexo.render.renderSync({ text: content, engine: 'markdown' }).trim();
  content = content.replace(/^<p>|<\/p>$/g, '');

  const titleHtml = title ? `<span class="custom-alert-title">${title}</span>` : '';
  const contentHtml = `<p class="${title ? '' : 'content-center'}">${content}</p>`;
  const blockClass = `custom-alert-block alert-${type}${title ? '' : ' no-title'}`;

  return `<div class="${blockClass}" role="alert">
  ${titleHtml}
  ${contentHtml}
</div>`;
}, { ends: true });