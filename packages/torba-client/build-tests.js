const path = require('path');
const { build } = require('esbuild');
const glob = require('tiny-glob');

// isProduction flag for watch mode
const isProduction = process.env.NODE_ENV === 'production';

(async () => {
  const entryPoints = await glob('./__tests__/*spec.ts');

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
    entryPoints: [path.resolve('./src/index.ts'), ...entryPoints],
    bundle: true,
    // format: "esm",
    outdir: path.resolve('./dist-tests'),
    // external: ["./node_modules/*"],
    loader: {
      '.ts': 'ts',
    },
    platform: 'node',
  }).catch(e => console.error(e.message));
})();
