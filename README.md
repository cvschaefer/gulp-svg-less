# gulp-svg-less 
[![Build Status](https://travis-ci.org/sdl/gulp-svg-less.svg?branch=master)](https://travis-ci.org/sdl/gulp-svg-less)
[![npm version](https://badge.fury.io/js/gulp-svg-less.svg)](https://badge.fury.io/js/gulp-svg-less)
[![Dependency Status](https://david-dm.org/sdl/gulp-svg-less.svg)](https://david-dm.org/sdl/gulp-svg-less)
[![devDependency Status](https://david-dm.org/sdl/gulp-svg-less/dev-status.svg)](https://david-dm.org/sdl/gulp-svg-less#info=devDependencies)

Gulp plugin that embeds svg images inside a single LESS file using data-uri.

## Usage

Example usage of the plugin:

    var gulp = require('gulp');
    var svgless = require('gulp-svg-less');
    var svgmin = require('gulp-svgmin');

    gulp.task('create-less', function () {
        return gulp
            .src('icons/**/*.svg')
            .pipe(svgmin())
            .pipe(svgless({ 
                fileName: 'icons',
                mixinPrefix: 'icon-',
                addSize: false
            }))
            .pipe(gulp.dest('dist/'));
        });
    });

## API

### svgless(options)

#### options.fileName
Type: `String`
Default value: `icons`

Name of the target less file.

#### options.mixinPrefix
Type: `String`
Default value: `icon-`

A string to prefix all mixin names with.

### options.outputMixin
Type: `Boolean`
Default value: `false`

If set to true the mixin will be part of the css output after building the less file.

#### options.addSize
Type: `Boolean`
Default value: `false`

Adds width and height property to the mixin.
The size is retrieved using the width and height attribute on the svg root element. If no size is set the `options.defaultWidth` and `options.defaultHeight` will be used.

#### options.defaultWidth
Type: `String`
Default: `"16px"`

Only used if `options.addSize` is true.

A string that MUST be defined in px that will be the size of the background-image if there is no width given in the SVG element.

#### options.defaultHeight
Type: `String`
Default: `"16px"`

Only used if `options.addSize` is true.

Similar to defaultWidth, but for height.

## Running tests

    npm install
    npm test

## License

Copyright (c) 2016 All Rights Reserved by the SDL Group.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
