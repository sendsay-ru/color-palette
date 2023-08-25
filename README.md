<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://sendsay.ru/new/img/logo.svg" alt="Project logo"></a>
</p>

<h3 align="center">ZIMABLUE</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/sendsay-ru/color-palette/issues.svg)](https://github.com/sendsay-ru/color-palette/issues/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/sendsay-ru/color-palette/issues.svg)](https://github.com/sendsay-ru/color-palette/issues/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center">A CLI-tool for generate github-actions workflow for pull-requests and master branch checks
    <br> 
</p>

## 📝 Table of Contents

- [📝 Table of Contents](#-table-of-contents)
- [🧐 About ](#-about-)
- [🎈 Usage ](#-usage-)
- [✍️ Authors ](#️-authors-)

## 🧐 About <a name = "about"></a>

This service helps to bring all the colors used in the project to the palette. The script finds all the colors in the selected files, converts them to HEX format, and then finds the most similar colors in the palette and shows them in the table.

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

## ✍️ Authors <a name = "authors"></a> 

- [@aleksnick](https://github.com/aleksnick) - Idea & Initial work, [contact in telegram](https://t.me/aleksnick)
