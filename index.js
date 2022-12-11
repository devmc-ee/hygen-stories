'use strict';

const util = require('util');
const exec = util.promisify(require('child_process').exec);

const ITEM_TYPE = {
  file: 'file',
  directory: 'directory',
};

function getFileBaseName(fileName, extension) {
  return fileName.slice(0, fileName.length - extension.length);
}

function getComponentName(fileName, extension) {
  const baseFileName = getFileBaseName(fileName, extension);

  return baseFileName
    .split('-')
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join('');
}

/**
 *
 * @param {{
 *  type: string;
 *  parent: string;
 *  itemPath: string;
 *  name: string;
 *  innerItems: {
 *      type: string;
 *      parent: string;
 *      itemPath: string;
 *      name: string;
 *      innerItems: {}[]
 *  }[]}[]} items
 */
async function generateStories(items) {
  let result = true;

  const hasStory = items.some((item) => item.name.endsWith('.stories.tsx'));

  if (hasStory) {
    console.log('skip folder: ', items[0].parent);
    return false;
  }

  items.forEach(async (item) => {
    if (item.name.endsWith('.tsx')) {
      const { name, parent } = item;

      const componentName = getComponentName(name, '.tsx');
      const fileBaseName = getFileBaseName(name, '.tsx');

      const stylesFile = items.find((item) => item.name.endsWith('.scss'));

      const stylesNameOption = stylesFile ? `${stylesFile.name}` : 'null';

      try {
        const command = `npx hygen story new --name ${componentName} --path ${parent} --fileName ${fileBaseName} --styles ${stylesNameOption}`;

        await exec(command);
      } catch (err) {
        console.log(err);
      }

      console.log(componentName);
    }
  });

  const directories = items.filter((item) => item.type === ITEM_TYPE.directory);

  for (const directory of directories) {
    const { innerItems } = directory;

    if (innerItems.length) {
      const result = await generateStories(innerItems);

      if (!result) continue;
    }
  }

  return result;
}

module.exports = { generateStories };
