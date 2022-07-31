const root = process.cwd();

module.exports.htmlMin = function (content, outputPath) {
  if (
    outputPath.endsWith(".html") &&
    ![
      `${root}/live/index-top.html`,
      `${root}/live/index-bottom.html`,
    ].includes(outputPath)
  ) {
    let minified = htmlmin.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
    });
    return minified;
    // return content
  } else if (
    [
      `${root}/live/index-top.html`,
      `${root}/live/index-bottom.html`,
    ].includes(outputPath)
  ) {
    return content.replace(/>\s*\n\s*</g, "><");
  }
  return content;
}
