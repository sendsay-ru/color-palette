# zimablue
a tool for bringing color to the palette

## Usage
```
npx zimablue -f ./**/*.css -i node_modules -d 0.04
```

```
Options:
  -f --files [files...]   path to files
  -p --palette <string>   path to custom palette config
  -i --ignore [files...]  ignore files
  -d --delta <number>     max delta when comparing files, min:0, max:1, default: 0.034
  -r --replace            make replaces in files, default: false
  -V, --version           output the version number
  -h, --help              display help for command
```
