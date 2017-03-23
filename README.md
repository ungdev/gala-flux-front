# flux2-client

Flux2-client is the web app for the second version of Flux.

## Getting started

These instructions will get you a copy of the project on your local machine for development and testing purposes.

### Prerequisites

#### Node Package Manager
[get NPM here](https://www.npmjs.com/)

### Installing

After cloning the repository locally, install the project dependencies.

```
npm install
```

The *flux2-client* communicate with *flux2-server* using webSockets. 
Look at */src/index.html* and change the server URL if necessary.

```
io.sails.url = 'http://localhost:1337';
```

Now you can run the app :

```
npm start
```

## Run the tests

## Built with

- [React.js](https://facebook.github.io/react/) - A javascript library for building user interfaces
- [Material ui](https://material-ui-1dab0.firebaseapp.com/#/layout/responsive-ui) - A set of React Components that implement Google's material design
- [NPM](https://www.npmjs.com/) - The Javascript package manager
- [WebPack](https://webpack.js.org/concepts/) - A module bundler for modern Javascript applications.
- [Babel](https://babeljs.io/) - A Javascript transpiler
- [Sails socket client](http://sailsjs.com/documentation/reference/web-sockets/socket-client) - Client library of the Sails.js framework

## Licence

This project is licensed under the MIT License - see the LICENSE file for details