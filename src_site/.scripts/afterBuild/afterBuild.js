import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import htmlnano from 'htmlnano';

const options = {
  collapseWhitespace: 'conservative',
};
const postHtmlOptions = {
  lowerCaseTags: true, // https://github.com/posthtml/posthtml-parser#options
  quoteAllAttributes: true, // https://github.com/posthtml/posthtml-render#options
};

async function minimize(file) {
  await htmlnano
    .process(readFileSync(file, { encoding: 'utf8' }), options, htmlnano.presets.safe, postHtmlOptions)
    .then((result) => writeFileSync(file, result.html))
    .catch((err) => console.error(err));
}

export default function ({ directories, results, runMode, outputMode }) {
  const files = readdirSync(directories.output, {recursive: true}).filter((file) => file.endsWith('.html'));

  return Promise.all(files.map((file) => minimize(`${directories.output}/${file}`)));
}
