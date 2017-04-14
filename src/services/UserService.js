import {ApiError} from '../errors';
import * as constants from '../config/constants';

/**
 * Class used for all about Authentication
 */
class UserService {


    /**
     * Pull user data from the server
     *
     * @param  {string} id  id of the user you wan to get
     * @return {Promise}    Promise that resolve to user data
     */
    getUser(id) {
        return new Promise((resolve, reject) => {
            // first request : get the user
            iosocket.request({
                method: 'get',
                url: '/user/' + id
            }, (resData, jwres) => {
                if(jwres.error) {
                    return reject(jwres.error);
                }
                return resolve(resData);
            });
        });
    }

    /**
     * Make a webSocket request to get the users
     * Then return the data
     *
     * @param {Array|null} filters
     * @return {Promise}
     */
    getUsers(filters) {
        return new Promise((resolve, reject) => {
            iosocket.request({
                method: 'get',
                data: {filters},
                url: '/user'
            }, (resData, jwres) => {
                if(jwres.error) {
                    return reject(new ApiError(jwres));
                }
                return resolve(resData);
            });
        });
    }

    /**
     * Make a webSocket request to delete a user
     *
     * @callback errorCallback
     *
     * @param {String} uid : the user id
     * @param {errorCallback} err
     */
    deleteUser(uid, err) {
        iosocket.request({
            method: 'delete',
            url: '/user/' + uid
        }, (resData, jwres) => {
            if (jwres.error) {
                err(jwres);
            } else {
                AUTH_JWT_SAVED.log("ok delete user : ", jwres);
            }
        });
    }

    /**
    * Make a webSocket request to update a user
    *
    * @callback erroCallback
    *
    * @param {String} uid : the user id
    * @param {object} data : the attributes to update
    * @param {erroCallback} err
    */
    updateUser(uid, data, err) {
        iosocket.request({
            method: 'put',
            url: '/user/' + uid,
            data
        }, (resData, jwres) => {
            if (jwres.error) {
                err(jwres);
            } else {
                console.log("ok update user : ", jwres);
            }
        });
    }


    /**
     * Make a request to create a new user
     *
     * @callback doneCallback
     *
     * @param {object} data
     * @return {Promise} A promise to end of creation
     */
    createUser(data) {
        return new Promise((resolve, reject) => {
            iosocket.post('/user', data, (resData, jwres) => {
                if (jwres.error) {
                    return reject(new ApiError(jwres));
                }
                return resolve(resData);
            });
        });
    }

    /**
     * Make a webSocket request to find EtuUTT user according to a query string
     *
     * @param {string} query Name, first name, last name, login, nickname, ...
     * @return {Promise} A promise to get a list of etuutt users
     */
    findEtuuttUser(query) {
        return new Promise((resolve, reject) => {
            iosocket.get('/user/etuutt', {
                query: query,
            }, (resData, jwres) => {
                if (jwres.error) {
                    return reject(new ApiError(jwres));
                }
                return resolve(resData);
            });
        });
    }


    /**
     * Download image (used for downloading avatar from EtuTT)
     * @param {string} uri Absolute uri
     */
    downloadPngFromURI(uri) {
        return new Promise((resolve, reject) => {
            // Download avatar
            const req = new XMLHttpRequest();
            req.open('GET', uri, true);
            req.responseType = 'blob';

            // Hack to pass bytes through unprocessed.
            req.overrideMimeType('text/plain; charset=x-user-defined');

            req.onload = () => {
                if (req.status == 200) {
                    let img = new Blob([req.response], {type: 'image/png'});
                    return resolve(img);
                }
                else {
                    return reject(new Error('Avatar download: ' + req.statusText));
                }
            };
            req.send();
        });
    }


    /**
     * Upload an avatar for an user
     * @param {string} id User id
     * @param {blob} img Image as a blob
     */
    uploadAvatar(id, img) {
        return new Promise((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.open('POST', constants.webSocketUri + '/user/avatar/' + id, true);
            req.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem(constants.jwtName));

            let formData = new FormData();
            formData.append("avatar", img);

            req.onload = () => {
                if (req.status == 200) {
                    let img = new Blob([req.response], {type: 'image/png'});
                    return resolve(img);
                }
                else {
                    return reject(new Error('Avatar upload: ' + req.statusText));
                }
            };
            req.send(formData);
        });
    }
}

export default new UserService();
