const { exec } = require('child_process');
const { existsSync, mkdirpSync } = require('fs-extra');
const { staticSrc, staticDest } = require('./paths')

//If buildDest directory doesn't exist...
if (!existsSync(`${staticDest}/css`)) {
    //Create buildDest directory recursively
    mkdirpSync(`${staticDest}/css`)
}

//Render css from postcss
exec(`npx postcss ./${staticSrc}/css --dir ./${staticDest}/css`);
