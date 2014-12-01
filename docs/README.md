# IDOLclient [![Build Status](https://travis-ci.org/ColorfullyMe/idol-client.svg)](https://travis-ci.org/ColorfullyMe/idol-client)
Javascript client for working with the HP's IDOL OnDemand API from Node.js and the browser. Supports all endpoints with theirs parameters, can auto do polling of async tasks, fires events and more...

Made and maintained by <a href="https://github.com/ColorfullyMe" target="_blank">@Colorfully</a> for free. It is open source as software should one day be!:)

**Note** that this work is not oficial HP project!
# Installation
Available as npm package.

`[sudo] npm install idol-client`

Then in **Node.js:**

- `var MyClient = require(idol-client)(options)`

Or in the **browser:**

Include the file `build/idol-client.min.js` to your project. It will always be the latest version. For older ones checkout to previous tags.

- `<script src="build/idol-client.min.js"></script>`

# Contributing
Pull requsts welcome!

Fork. Make changes. Post pull requests...

Uses `gulp` as build tool. Tasks defined:

- `browser-build`  Runs browserify, uglify and etc. Puts result in the `/build` folder.
- `docs`  Creates documentation and this README.
- `APIref`  Parses source via `markdox` to create the API reference.

**Tests** available. Made with `mocha` and `chai`. To execute them:

`[sudo] npm test`

# How to support the project?
> It takes time to do it but saves time using it...

<a href="//gittip.com/ColorfullyMe" target="_blank">Gittip</a>
