export function requireElement(element: string) {
  throw new Error(`${element} is required in hardhat.config but missing`);
}
