// Takes the finished one-number entry from line.txt, verifies it fits
// the rules, and copies it byte-for-byte into entry.txt for the scorer.
import { mkdirSync as makeDir, readFileSync as readText, writeFileSync as writeText } from "node:fs";
import { join as joinPath } from "node:path";

// Folder this script lives in, pulled straight from its module URL.
const here = new URL(".", import.meta.url).pathname;

let content = readText(joinPath(here, "line.txt"), "utf8");

// Shave off a single line break at the end when the file has one.
content = content.replace(/\n$/, "").replace(/\r$/, "");

// The number has to be present and fit the 5-character ceiling.
function checkSize(s: string): void {
  if (s.length === 0) {
    throw new Error("nothing to submit: line.txt came back empty");
  }
  if (s.length > 5) {
    throw new Error(`too long to submit: ${s.length} characters, ceiling is 5`);
  }
}

// A line of pure whitespace is not a real entry.
function checkBlank(s: string): void {
  if (s.trim() === "") {
    throw new Error("nothing but spaces: the entry has no real text");
  }
}

// It must be exactly one number in digits: no words, no spaces, no
// line breaks, nothing but 0-9.
function checkForm(s: string): void {
  checkBlank(s);
  if (/[\r\n]/.test(s)) {
    throw new Error("one number only: the entry contains a line break");
  }
  if (!/^[0-9]+$/.test(s)) {
    throw new Error("one number only: the entry is not digits alone");
  }
}

checkSize(content);
checkForm(content);

const target = process.env.MAKEFUN_OUTPUT_DIR || "/output";
makeDir(target, { recursive: true });
writeText(joinPath(target, "entry.txt"), content, "utf8");
