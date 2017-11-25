# flux2-client

Flux2-client is the web app for the second version of Flux.

## Getting started

These instructions will get you a copy of the project on your local machine for development and testing purposes.

### Prerequisites

* [Yarn](https://yarnpkg.com/lang/en/docs/install/)
* NodeJS 8.9

### Installing

After cloning the repository locally, install the project dependencies.

```
yarn install
```

The *flux2-client* communicate with *flux2-server* using webSockets.
Look at */src/index.html* and change the server URL if necessary.

Now you can run the app :

```
yarn dev
```

## Production deployment
This app is made to have an auto deployment on master push. The app will be started as a test on travis-ci, which will then trigger the auto-deployment to a dokku server.

To push on the Dokku server, travis has to get the private ssh key of a dokku user :

```
# generate new keys
ssh-keygen -f deploy_key

# Use deploy_key.pub to create a new user on dokku that can push to this new repository
cat deploy_key.pub | ssh dokku@dokku.uttnetgroup.net dokku ssh-keys:add flux2-travis

# Login on travis and encryp key
travis login
travis encrypt-file deploy_key --add

# Clean unencrypted keys
rm deploy_key deploy_key.pub

# Add and commit encrypted deploy_key
git add deploy_key.enc
```

On the dokku app, you have to use the buildpack `heroku-buildpack-static`

```
dokku config:set flux2-client BUILDPACK_URL=https://github.com/hone/heroku-buildpack-static
```

You can also configure the Flux API server by setting an env variable on travis
```
FLUX_API_URI_PROD = https://api.flux.uttnetgroup.fr
FLUX_API_URI_DEV = https://api.flux-dev.uttnetgroup.fr
```

## Built with

- [React.js](https://facebook.github.io/react/) - A javascript library for building user interfaces
- [Material ui](https://material-ui-1dab0.firebaseapp.com/#/layout/responsive-ui) - A set of React Components that implement Google's material design
- [Yarn](https://yarnpkg.com/) - Javascript package manager
- [WebPack](https://webpack.js.org/concepts/) - A module bundler for modern Javascript applications.
- [Babel](https://babeljs.io/) - A Javascript transpiler
- [Sails socket client](http://sailsjs.com/documentation/reference/web-sockets/socket-client) - Client library of the Sails.js framework

## Assets

### Sounds

- Notification - [link](https://www.freesound.org/people/elmasmalo1/sounds/377017/)

## Licence

This project is licensed under the MIT License - see the LICENSE file for details
