// The value of jwtName is the name of the JWT in the localStorage
export const jwtName = 'token';

// Contains the old value JWT stored in jwtName (used for the "login as" feature)
export const firstJwtName = 'firstToken';

// The value of firebaseTokenName is the name of the firebase token in the localStorage
export const firebaseTokenName = 'firebaseToken';

// Api server uri without ending /
export const apiUri = process.env.FLUX_API_URI || 'http://localhost:3000';

// websocket target full uri
export const webSocketUri = apiUri;

// To show an user avatar, show an image with (avatarBasePath + userId) as src
export const avatarBasePath = apiUri + '/user/avatar/';

// build vars
export const build = {
    repo: process.env.TRAVIS_REPO_SLUG,
    branch: process.env.TRAVIS_BRANCH,
    commit: process.env.TRAVIS_COMMIT,
};
