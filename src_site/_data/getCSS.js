import fs from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { transform, Features } from 'lightningcss';

const output = {};

const getFiles = async (path = './') => {
  const entries = await fs.readdir(path, { withFileTypes: true });

  // Get files within the current directory and add a path key to the file objects
  return entries.filter((file) => !file.isDirectory()).map((file) => ({ ...file, path: path + file.name }));
};

const processCss = async (fileName, filePath) => {
  if (fileName.startsWith('_')) {
    return;
  }

  try {
    const { code, map } = transform({
      filename: `${process.cwd()}/src_assets/static/css/main.css`,
      code: Buffer.from(readFileSync(filePath)),
      minify: true,
      // sourceMap: false,
      // include: Features.Colors | Features.Nesting,
    });

    output[filePath.replace('./', '')] = code.toString();

    return output;
  } catch (error) {
    throw new Error('Check the CSS');
  }
};

export default async () => {
  return [];
  const files = await getFiles('./src_assets/css/');
  return Promise.all(files.map((file) => processCss(file.name, file.path)));
};
