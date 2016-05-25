# Frontend template instuctions

## Using frontend technologies:
- jade
- scss
- gulp

## Requirments:
- git
- nodejs + npm
- bower

## Template installation:
```
$ npm install (or npm -i)
$ bower install
$ gulp
```

## Descritpion:
- **_build** - folder with production sources
- **_dev** - folder with development sources
- **node_modules** - folder with installed npm-packages
- **_dev/bower** - folder with installed bower-packages
	- all .css-files from **_dev/bower** after installing will be bundled into **_build/css/vendor.min.css**
	- all .js-files from **_dev/bower** after installing will be bundled into **_build/js/vendor.min.js**

