#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const sourceDir = path.resolve(__dirname, '_templates/story/new/');
const targetDir = path.resolve(__dirname, '../../../', '_templates/story/new/');

const templateFile =  path.resolve(sourceDir, 'story.ejs.t');
const targetFile = path.resolve(__dirname, '../../../', '_templates/story/new/story.ejs.t');

fs.mkdirSync(targetDir,{recursive: true}, (error)=>console.log(error||'created _template folder'));
fs.copyFileSync(templateFile, targetFile );

const { generateStories } = require('./index');
const { folderStructure } = require('@devmcee/folder-content-map');

const argv = require('yargs/yargs')(process.argv.slice(2))
.option('dir', {
  alias: 'd',
  describe:
    'directory to scan recursively and generate new stories  (./src/components)',
})
.example('$0 --dir src/components/Button', '')
.help().argv;

const { dir, ext } = argv;

(async function () {
  const componentsFolder = path.resolve(__dirname, '../../../', dir || 'src/components');

  const filesPathMap = await folderStructure(
    componentsFolder || './',
    // TODO: implement config for diffent extnesions
    ext && typeof ext === 'string' ? ext.split(',') : ['.tsx','.scss']
  );

  await generateStories(filesPathMap);
})();
