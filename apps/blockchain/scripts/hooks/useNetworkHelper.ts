import { impersonateAccount, takeSnapshot } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";

export async function useImpersonatedSigner(address: string) {
  await impersonateAccount(address);
  const impersonatedSigner = await ethers.getSigner(address);
  return impersonatedSigner;
}

// use this hook for fixture reset
export async function useSnapshotForReset() {
  const blockchain = await takeSnapshot();
  await blockchain.restore();
}
