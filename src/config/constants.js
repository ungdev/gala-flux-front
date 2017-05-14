// The value of jwtName is the name of the JWT in the localStorage
export const jwtName = 'token';

// Contains the old value JWT stored in jwtName (used for the "login as" feature)
export const firstJwtName = 'firstToken';

// websocket target full uri
export const webSocketUri = process.env.FLUX_API_URI || 'http://192.168.1.2:1337';

// To show an user avatar, show an image with (avatarBasePath + userId) as src
export const avatarBasePath = webSocketUri + '/user/avatar/';

// build vars
export const build = {
    repo: process.env.TRAVIS_REPO_SLUG,
    branch: process.env.TRAVIS_BRANCH,
    commit: process.env.TRAVIS_COMMIT,
}
