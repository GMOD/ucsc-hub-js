# ucsc-hub-js

read and write UCSC track and assembly hub files in node or the browser

## Status

[![Build Status](https://img.shields.io/travis/com/GMOD/ucsc-hub-js/master.svg?logo=travis&style=flat-square)](https://travis-ci.com/GMOD/ucsc-hub-js)
[![Coverage Status](https://img.shields.io/codecov/c/github/GMOD/ucsc-hub-js/master.svg?logo=codecov&style=flat-square)](https://codecov.io/gh/GMOD/ucsc-hub-js/branch/master)
[![NPM version](https://img.shields.io/npm/v/@gmod/ucsc-hub.svg?logo=npm&style=flat-square)](https://npmjs.org/package/@gmod/ucsc-hub)

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

-   [RaStanza](#rastanza)
    -   [Parameters](#parameters)
    -   [Properties](#properties)
    -   [set](#set)
        -   [Parameters](#parameters-1)
    -   [toString](#tostring)

### RaStanza

**Extends Map**

Class representing an ra file stanza. Each stanza line is split into its key
and value and stored as a Map, so the usual Map methods can be used on the
stanza. The exception is `set()`, which takes a single line instead of a key
and a value.

#### Parameters

-   `stanza` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>)** An ra file stanza, either as a
    string or a list of strings with one line per entry. Supports both LF and
    CRLF newlines. (optional, default `[]`)

#### Properties

-   `nameKey` **([undefined](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined) \| [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))** The key of the first line of the
    stanza (`undefined` if the stanza has no lines yet).
-   `name` **([undefined](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined) \| [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))** The value of the first line of the
    stanza, by which it is identified in an ra file  (`undefined` if the stanza
    has no lines yet).
-   `indent` **([undefined](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined) \| [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))** The leading indent of the stanza,
    which is the same for every line (`undefined` if the stanza has not lines
    yet, `''` if there is no indent).


-   Throws **[Error](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error)** Throws if the stanza has blank lines, if the first line
    doesn't have both a key and a value, if a key in the stanza is
    duplicated, or if lines in the stanza have inconsistent indentation.

#### set

Overrides the default map set to take a single value, which is a single
stanza line

##### Parameters

-   `line` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** A stanza line

#### toString

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Returns the stanza as a string fit for writing to a ra
file. Original leading indent is preserved. It may not be the same as the
input stanza as lines that were joined with `\` in the input will be output
 as a single line and all comments will have the same indentations as the
rest of the stanza. Comments between joined lines will move before that
line.

## License

MIT © [Generic Model Organism Database Project](http://gmod.org/wiki/Main_Page)
