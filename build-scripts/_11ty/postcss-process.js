const { exec } = require('child_process');
const { existsSync, mkdirpSync, watch } = require('fs-extra');
const { dirname } = require('path');

module.exports = function (inputPath, outputPath, eleventyConfig) {
    console.dir(eleventyConfig.quietMode)
    // //If outputPath directory doesn't exist...
    // if (!existsSync(dirname(outputPath))) {
    //     //Create outputPath directory recursively
    //     mkdirpSync(dirname(outputPath))
    // }

    // //Render css from postcss
    // exec(`npx postcss ${inputPath} --dir ${outputPath}`);

    if (!eleventyConfig.quietMode) {

        //Watch for changes to the inputPath directory...
        watch(dirname(inputPath), () => {
            //Render css from sass...
            exec(`npx postcss ${inputPath} --dir ${outputPath}`);
            console.log(`Watching ${dirname(scssPath)}...`);
        });
    }
}
