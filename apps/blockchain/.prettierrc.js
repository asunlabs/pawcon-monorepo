module.exports = {
    overrides: [
      {
        files: "*.sol",
        options: {
          explicitTypes: "always",
          printWidth: 150,
        },
      },
      {
        files: "*.{js,ts}",
        options: {
          printWidth: 150,
        },
      },
      {
        files: "hardhat.config.ts",
        options: {
          printWidth: 80,
        },
      },
    ],
  };
  