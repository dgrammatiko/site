const Image = require("@11ty/eleventy-img");

module.exports.ogimage = async function(image, outputPath, metadata) {

  if (!image) {
    return `<meta property="og:image" content="https://${metadata.domain}/static/images/android-chrome-512x512.png">`;
  }

  if (outputPath.startsWith('/blog')) {
    return `<meta property="og:image" content="https://${metadata.domain}${await getImage(image, 'blog')}">`;
  }
  if (outputPath.startsWith('/code')) {
    return `<meta property="og:image" content="https://${metadata.domain}${await getImage(image, 'code')}">`;
  }
  if (outputPath.startsWith('/talks')) {
    return `<meta property="og:image" content="https://${metadata.domain}${await getImage(image, 'talks')}">`;
  }
}

async function getImage(image, dir) {
  let metadata = await Image(
    `./src_assets/images/${dir}/${image}`,
    {
      urlPath: `/static/images/${dir}/`,
      outputDir: `live/static/images/${dir}/`,
      widths: [1024],
      formats: ["jpeg"]
  });
  data = metadata.jpeg[metadata.jpeg.length - 1];
  return data.url;
}

module.exports.imageShortcode = async function(src, dir, alt, sizes, classs) {
  let metadata = await Image(`./src_assets/images/${dir}/${src}`, {
    urlPath: `/static/images/${dir}/`,
    outputDir: `live/static/images/${dir}/`,
    widths: [300, 600, 1024, 1240],
    formats: ["avif", "jpeg"]
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
    class: classs
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}
