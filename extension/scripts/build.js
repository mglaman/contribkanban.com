#!/usr/bin/env node
// Inspired by https://github.com/facebook/react/blob/master/packages/react-devtools-extensions/build.js

"use strict";
const { join } = require("path");
const archiver = require("archiver");
const { execSync } = require("child_process");
const { readFileSync, writeFileSync, createWriteStream } = require("fs");
const { copy, ensureDir, move, remove } = require("fs-extra");

const main = async (build) => {
  const root = join(__dirname, "..");
  const buildDir = join(root, "builds", build);
  const zipArchivePath = join(root, "builds", 'ContribKanban.zip');
  console.log(`Packaging ${build} extension in ${buildDir}`);

  await remove(buildDir);
  await ensureDir(buildDir);
  await remove(zipArchivePath);
  await copy(join(root, "manifest.json"), join(buildDir, "manifest.json"));

  const staticFiles = ["popup.html"];
  await Promise.all(
    staticFiles.map((file) => copy(join(root, file), join(buildDir, file)))
  );

  const buildDistDir = join(buildDir, "dist");
  const webpackPath = join(root, "node_modules", ".bin", "webpack");
  execSync(
    `${webpackPath} --config webpack.config.js --output-path ${buildDistDir}`,
    {
      cwd: root,
      env: process.env,
      stdio: "inherit",
    }
  );

  const archive = archiver('zip', {zlib: {level: 9}});
  const zipStream = createWriteStream(zipArchivePath);
  await new Promise((resolve, reject) => {
    archive
      .directory(buildDir, false)
      .on('error', err => reject(err))
      .pipe(zipStream);
    archive.finalize();
    zipStream.on('close', () => resolve());
  });
};

module.exports = main;
