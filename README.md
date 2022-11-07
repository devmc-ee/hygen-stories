# hygen-stories
CLI wrapper for [hygen](https://www.hygen.io/) to generate [storybook](https://storybook.js.org/) stories for the existing components (only React at the moment, .tsx)

It recursivly scans the given folder. If it contains .tsx file and no a .stories.tsx, then it generates one. Name of the file and the name of the components that will be used in the story is taken from the .tsx file name. New name will be in the Pascal Case. Hyphen will be replaced and every part of the name be capetilised: 

>component-name.tsx  => ComponentName.tsx


## Install

```
npm i @devmcee/hygen-stories -D
```

Usage example:
```javascript
const { folderStructureMap } = require('@devmcee/folder-content-map');

const structure = await folderStructureMap('src/components', ['.tsx', '.scss']);

console.log(structure)

```

Sample data output:
```
[
  {
    type: 'directory',
    parent: './src',
    path: '/home/devmcee/dev/folder-content-map/src/components',
    name: 'components',
    innerItems: [
      {
        type: 'file',
        parent: '/home/devmcee/dev/folder-content-map/src/components',
        itemPath: '/home/devmcee/dev/folder-content-map/src/components/index.js',
        name: 'index.js',
        innerItems: []
      }
    ]
  }
]
```

There is an executable script that can be called with npx:

```bash
npx folder-content-map --dir src 
```

```bash
Options:
      --help     Show help                                             [boolean]
      --version  Show version number                                   [boolean]
  -d, --dir      directory name, relative path, default is current (./)

Examples:
  generate.js --dir src/components 
```

### TODO:
Use AST analysis of  .tsx files to grap the real name of the defined and exported components. 
