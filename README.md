<p align="center">
  <a href="" rel="noopener">
 <img width=400px src="./public/images/logo.jpg" alt="Project logo"></a>
</p>

<h3 align="center">ZIMABLUE</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/sendsay-ru/color-palette/issues.svg)](https://github.com/sendsay-ru/color-palette/issues/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/sendsay-ru/color-palette/issues.svg)](https://github.com/sendsay-ru/color-palette/issues/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center">a CLI utility for matching colors with a palette
    <br> 
</p>

## 📝 Table of Contents

- [📝 Table of Contents](#-table-of-contents)
- [🧐 About ](#-about-)
- [🏁 Getting Started ](#-getting-started-)
- [🎈 Usage ](#-usage-)
- [👀 Find colors ](#-find-colors-)
- [🌂 Ignore files ](#-ignore-files-)
- [🔆 Delta ](#-delta-)
- [🎨 Custom palette ](#-custom-palette-)
- [👭 Siblings ](#-siblings-)
- [🪛 Make replaces ](#-make-replaces-)
- [✍️ Authors ](#️-authors-)

## 🧐 About <a name = "about"></a>

This service helps to bring all the colors used in the project to the palette. The script finds all the colors in the selected files, converts them to HEX format, and then finds the most similar colors in the palette and shows them in the table.

## 🏁 Getting Started <a name = "getting_started"></a>

Runn it in the root directory of your project

```
npx zimablue --files ./**/*.css -i node_modules --delta 0.041 -n 4
```

The server with the web interface will start on localhost:4040<br>
<img width=700px src="./public/images/web.png" alt="Web interface">

## 🎈 Usage <a name="usage"></a>

Usage: zimablue [options]

```
npx zimablue --help
```

```
Options:
  -f --files [files...]   path to files
  -p --palette <string>   path to custom palette config
  -i --ignore [files...]  ignore files
  -d --delta <number>     max delta when comparing files, min:0, max:1, default: 0.034
  -n --number <number>    number of relevant colors
  -r --replace            make replaces in files
  -s --silent             do not start the server
  -V, --version           output the version number
  -h, --help              display help for command
```

## 👀 Find colors <a name="find-colors"></a>

Use the find option to properly configure color parsing.<br> Examples:

Find colors in all css files:
```
npx zimablue -f './**/*.css'
```

Only files with name `colors.css`:
```
npx zimablue --files ./**/colors.css
```

Find colors in two packages
```
npx zimablue -f './package_one/*.css' './package_two/*.css'
```

<b>warning:</b> please use single quotes if there are too many files

## 🌂 Ignore files <a name="ignore-files"></a>

To exclude files, use the ignore flag:

```
npx zimablue --ignore node_modules
```
or
```
npx zimablue -i legacy /build/ reset.css
```

## 🔆 Delta <a name="delta"></a>

[Delta](https://en.wikipedia.org/wiki/Color_difference#CIEDE2000) is the max color difference between two colors that can be replaced. Min: 0 (same colors), max: 1 (like black-white):

```
npx zimablue -f './**/*.css' -d 0.018
```
<img width=700px src="./public/images/delta.png" alt="Delta">

## 🎨 Custom palette <a name="palette"></a>

By default, [tailwind colors](https://tailwindcss.com/docs/customizing-colors) are used, but you can create your own palette and compare colors with it. To do this, create a config file "my-pallete.json"

```
[
  {
    "hex": "#000",
    "code": "black",
    "group": "base",
    "var": "--ss-color-black"
  },
  {
    "hex": "#fff",
    "code": "white",
    "group": "base",
    "var": "--ss-color-white"
  },
  {
    "hex": "#f8fafc",
    "code": "primary",
    "group": "app",
    "var": "--color-primary"
  },
  {
    "hex": "#9c95dc",
    "code": "secondary",
    "group": "app",
    "var": "--color-secondary"
  }
]
```

in this config:
- `hex` - color in hex format, required
- `code` - color name, required
- `group` - color group, required
- `var` - use this field, if you want replace colors to variables

<br>

Then you can use it
```
npx zimablue -p ./my-palette.json
```
<img width=700px src="./public/images/palette.png" alt="Palette">

## 👭 Siblings <a name="siblings"></a>

Number of relevant colors, 1 by default.
```
npx zimablue -f ./**/*.css -n 2
```
<img src="./public/images/n2.png" alt="N 2">

<br>
<br>

```
npx zimablue -f ./**/*.css -n 3
```
<img src="./public/images/n3.png" alt="N 3">

## 🪛 Make replaces <a name="replace"></a>

To make changes in files, use --replace
```
npx zimablue -f ./**/*.css -p ./my-palette.json --replace
```

## ✍️ Authors <a name = "authors"></a> 

- [@aleksnick](https://github.com/aleksnick) - Idea & Initial work, [contact in telegram](https://t.me/aleksnick)
