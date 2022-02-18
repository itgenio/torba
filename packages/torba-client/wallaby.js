export default function (wallaby) {
  return {
    files: ["package.json", "__tests__/utils.ts", "src/**/*.ts"],
    tests: ["__tests__/**/*.spec.ts"],
    env: {
      type: "node",
      params: {
        runner: "--experimental-specifier-resolution=node",
      },
    },
    testFramework: "mocha",
    debug: true,
    workers: { restart: true },
    compilers: {
      "**/*.ts": wallaby.compilers.typeScript({
        module: "ESNext",
        target: "ESNext",
        isolatedModules: true,
      }),
    },
  };
}
