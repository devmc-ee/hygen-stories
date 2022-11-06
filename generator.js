const path = require('path');

const util = require('util');
const exec = util.promisify(require('child_process').exec);

const componentsFolder = path.resolve(__dirname, 'src/components');

const { readdir, stat } = require('fs/promises');

const ITEM_TYPE = {
  file: 'file',
  directory: 'directory',
};

const alloweExtenstionsRegex = new RegExp('.tsx|.scss', 'ig');
async function readFolderContent(folderPath) {
  const filesPathMap = [];

  try {
    const content = await readdir(folderPath);

    for (const item of content) {
      const itemPath = path.resolve(folderPath, item);
      const itemStats = await stat(itemPath);

      const itemMap = {
        type: ITEM_TYPE.file,
        parent: folderPath,
        itemPath,
        name: item,
        innerItems: [],
      };

      if (itemStats.isDirectory()) {
        const innerFilesMap = await readFolderContent(itemPath);

        itemMap.innerItems = innerFilesMap;
        itemMap.type = ITEM_TYPE.directory;

        filesPathMap.push(itemMap);
      }

      if (
        itemStats.isFile() &&
        alloweExtenstionsRegex.test(path.extname(item))
      ) {
        filesPathMap.push(itemMap);
      }
    }
  } catch (err) {
    console.log(err);
  }

  return filesPathMap;
}

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
async function generateStoriesInFolder(items) {
  let result = true;

  const hasStory = items.some((item) => item.name.endsWith('.stories.tsx'));

  if (hasStory) {
    console.log('detected story file');
    return false;
  }

  const componentFile = items.find((item) => item.name.endsWith('.tsx'));

  if (componentFile) {
    const { name, parent } = componentFile;

    const componentName = getComponentName(name, '.tsx');
    const fileBaseName = getFileBaseName(name, '.tsx');

    const stylesFile = items.find((item) => item.name.endsWith('.scss'));

    const stylesNameOption = stylesFile ? `${stylesFile.name}` : 'null';

    try {
      const command = `hygen story new --name ${componentName} --path ${parent} --fileName ${fileBaseName} --styles ${stylesNameOption}`;
      await exec(command);
    } catch (err) {
      console.log(err);
    }

    console.log(componentName);
  }
  // console.dir(items, { depth: null });

  const directories = items.filter((item) => item.type === ITEM_TYPE.directory);

  for (const directory of directories) {
    const { innerItems } = directory;

    if (innerItems.length) {
      const result = await generateStoriesInFolder(innerItems);

      if (!result) continue;
    }
  }

  return result;
}

(async function () {
  const filesPathMap = await readFolderContent(componentsFolder);
  await generateStoriesInFolder(filesPathMap);
})();
