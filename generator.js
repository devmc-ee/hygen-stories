#!/usr/bin/env node
'use strict';

const path = require('path');
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
  console.log(componentsFolder, componentsFolder || './',
  // TODO: implement config for diffent extnesions
  ext && typeof ext === 'string' ? ext.split(',') : ['.tsx','.scss']);
  const filesPathMap = await folderStructure(
    componentsFolder || './',
    // TODO: implement config for diffent extnesions
    ext && typeof ext === 'string' ? ext.split(',') : ['.tsx','.scss']
  );

  await generateStories(filesPathMap);
})();
