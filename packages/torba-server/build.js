const path = require('path');
const { build } = require('esbuild');

// isProduction flag for watch mode
const isProduction = process.env.NODE_ENV === 'production';

(async () => {
  build({
    watch: isProduction
      ? false
      : {
          onRebuild(error) {
            if (!error) {
              console.log('Build succeeded');
            }
          },
        },
    entryPoints: [path.resolve('./src/index.ts')],
    outbase: 'src',
    bundle: true,
    platform: 'node',
    outdir: path.resolve('./dist'),
  })
    .then(() => {
      if (isProduction) return;
    })
    .catch(e => console.error(e.message));
})();
