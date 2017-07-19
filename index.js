/*!
 * Copyright (c) 2016 All Rights Reserved by the SDL Group.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var path = require('path');
var xmldom = require('xmldom');
var domParser = new xmldom.DOMParser();

module.exports = function (options) {
    options = options || {};

    // Init default options
    if (!options.fileName) {
        options.fileName = 'icons';
    }
    if (!options.mixinPrefix) {
        options.mixinPrefix = 'icon-';
    }
    if (!options.addSize) {
        options.addSize = false;
    }
    if (!options.defaultWidth) {
        options.defaultWidth = '16px';
    }
    if (!options.defaultHeight) {
        options.defaultHeight = '16px';
    }
    if (!options.outputMixin) {
        options.outputMixin = false;
    }

    /**
     * Returns encoded string of svg file.
     * @method buildSvgDataURI
     * @param {String} data Contents of svg file.
     */
    function buildSvgDataURI(svgContent) {
        return encodeURIComponent(svgContent
            .replace(/^<\?xml.*?>/gmi, '') // Xml declaration
            .replace(/<\!\-\-(.*(?=\-\->))\-\->/gmi, '') // Comments
            .replace(/[\r\n]/gmi, '') // Line breaks
            .replace(/(\r\n|\n|\r)$/, '') // New line end of file
            .replace(/\t/gmi, ' ')).replace(/%2F/g, "/"); // Tabs (replace with space)
    }

    /**
     * Returns less mixin for svg file.
     * @method buildLessMixin
     * @param {String} normalizedFileName rule for svg file.
     * @param {String} encodedSvg Encoded svg content.
     * @param {String} width Image width.
     * @param {String} height Image height.
     */
    function buildLessMixin(normalizedFileName, encodedSvg, width, height) {
        var mixin = [];
        mixin.push('.' + options.mixinPrefix + normalizedFileName + (options.outputMixin ? '' : '()') + ' {');
        mixin.push('    background-image: url("data:image/svg+xml;charset=utf8, ' + encodedSvg + '");');
        if (options.addSize) {
            mixin.push('    width: ' + width + ';');
            mixin.push('    height: ' + height + ';');
        }
        mixin.push('}');
        return mixin.join('\n');
    }

    /**
     * Get svg image dimensions.
     * @method getDimensions
     * @param {String} data Contents of svg file.
     */
    function getDimensions(svgContent) {
        var doc = domParser.parseFromString(svgContent, 'text/xml');
        var svgel = doc.getElementsByTagName('svg')[0];
        var width = svgel.getAttribute('width');
        var height = svgel.getAttribute('height');

        if (width && !isNaN(width)) {
            width = width + 'px';
        }

        if (height && !isNaN(height)) {
            height = height + 'px';
        }

        return { width: width, height: height };
    }

    var lessMixins = [];

    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            cb(new gutil.PluginError('gulp-svg-less', 'Streaming not supported'));
            return;
        }

        var svgContent = file.contents.toString();

        // Put it inside a less file
        var normalizedFileName = path.normalize(path.basename(file.path, '.svg')).toLowerCase();

        // Replace dots with hypens inside file name
        normalizedFileName = normalizedFileName.replace(/\./gi, '-');

        // Encode svg data
        var encodedSvg = buildSvgDataURI(svgContent);

        // Get dimensions
        var dimensions = getDimensions(svgContent);

        // Push rule
        lessMixins.push(buildLessMixin(normalizedFileName, encodedSvg,
            dimensions.width || options.defaultWidth, dimensions.height || options.defaultHeight));

        // Don't pipe svg image
        cb();
    }, function (cb) {
        var lessFile = new gutil.File({
            path: options.fileName + '.less',
            contents: new Buffer(lessMixins.join('\n'))
        });
        this.push(lessFile);
        cb();
    });
};
