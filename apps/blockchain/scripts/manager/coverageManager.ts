import fs from "fs";
import { parse } from "node-html-parser";
import { promisify } from "util";
import path from "path";

const readFile = promisify(fs.readFile);

interface CoverageIndiceProps {
  statements: string;
  branches: string;
  functions: string;
  lines: string;
}

export async function checkCoverageForCI() {
  const testDir = path.join(__dirname, "..", "..", "test", "coverage", "index.html");
  const file = (await readFile(testDir)).toString();

  const root = parse(file);
  const container: String[] = [];

  // * .clearfix is a solidity-coverage plugin's class name, which
  // * holds test coverage indices.
  const indiceTable = root.querySelector(".clearfix");

  indiceTable?.childNodes.forEach((node) => {
    if (node.textContent.match(/[0-9]+.[0-9]+%/g) !== null) {
      const temp = node.textContent.match(/[0-9]+.[0-9]+%/g)?.[0];
      if (temp !== undefined) container.push(temp);
    }
  });

  console.log(container);

  return { container };
}

checkCoverageForCI();
