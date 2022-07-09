// helper module for handle config error

const requireEnv = (argument: string) => {
  throw new Error(`${argument} is required in .env but missing.`);
};
