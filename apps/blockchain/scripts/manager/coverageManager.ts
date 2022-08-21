import fs from "fs";
import { parse } from "node-html-parser";
import { promisify } from "util";
import path from "path";
import { CoverageIndiceProps } from "./typeManager";

const readFile = promisify(fs.readFile);
const removeDir = promisify(fs.rmdirSync);

const CoverageResultTable = new Map<CoverageIndiceProps, string>();

export async function checkCoverageForCI() {
  const testDir = path.join(__dirname, "..", "..", "test", "coverage", "index.html");
  const file = (await readFile(testDir)).toString();

  const root = parse(file);
  const container: string[] = [];

  // * .clearfix is a solidity-coverage plugin's class name, which
  // * holds test coverage indices.
  const indiceTable = root.querySelector(".clearfix");

  indiceTable?.childNodes.forEach((node) => {
    if (node.textContent.match(/[0-9]+.[0-9]+%/g) !== null) {
      const temp = node.textContent.match(/[0-9]+.[0-9]+%/g)?.[0];
      if (temp !== undefined) container.push(temp);
    }
  });

  CoverageResultTable.set("statements", container[0]);
  CoverageResultTable.set("branches", container[1]);
  CoverageResultTable.set("functions", container[2]);
  CoverageResultTable.set("lines", container[3]);

  console.log(CoverageResultTable);
  return { CoverageResultTable };
}

// * this function is used to prevent istanbul's window not defined error.
// see here: https://github.com/gotwarlost/istanbul/issues/216
export async function cleanCoverageDir() {
  const testDir = path.join(__dirname, "..", "..", "test", "coverage");

  try {
    await removeDir(testDir, { recursive: true });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
