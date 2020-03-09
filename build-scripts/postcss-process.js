const { exec } = require('child_process');
const { existsSync, mkdirpSync } = require('fs-extra');
const { dirname } = require('path');
const { buildSrc, buildDest } = require('./paths')

//If buildDest directory doesn't exist...
if (!existsSync(dirname(buildDest))) {
    //Create buildDest directory recursively
    mkdirpSync(dirname(buildDest))
}

//Render css from postcss
exec(`npx postcss ./${buildSrc}/_assets/css --dir ./${buildDest}/_assets/css`);

