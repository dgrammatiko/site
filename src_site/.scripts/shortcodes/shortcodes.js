import Image from '@11ty/eleventy-img';
import { existsSync } from 'node:fs';

async function getImage(image, dir) {
  let metadata = await Image(`./src_assets/images/${dir}/${image}`, {
    urlPath: `/static/images/${dir ? `${dir}/` : ''}`,
    outputDir: `live/static/images/${dir ? `${dir}/` : ''}`,
    widths: [1024],
    formats: ['jpeg'],
  });
  const data = metadata.jpeg[metadata.jpeg.length - 1];
  return data.url;
}

export default {
  ogimg: async (image, outputPath, metadata) => {
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
  },
  imagine: async (src, dir, alt = '', sizes = '(min-width: 30em) 50vw, 100vw', classs = '', lazy = false) => {
    if (!existsSync(`./src_assets/images/${dir}/${src}`)) {
      return `<br>`;
    }
    let metadata = await Image(`./src_assets/images/${dir}/${src}`, {
      urlPath: `/static/images/${dir}/`,
      outputDir: `live/static/images/${dir}/`,
      widths: [300, 600, 1024, 1240],
      formats: ['avif', 'jpeg'],
    });

    let imageAttributes = {
      alt: alt || '',
      sizes,
      decoding: 'async',
    };
    imageAttributes.loading = lazy ? 'lazy' : 'eager';
    if (classs) imageAttributes.class = classs;

    // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
    return Image.generateHTML(metadata, imageAttributes);
  },
};
