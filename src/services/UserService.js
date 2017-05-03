import BaseService from './BaseService';
import * as constants from '../config/constants';
import {ApiError} from '../errors';

/**
 * Class used for all about Authentication
 */
class UserService extends BaseService {

    constructor() {
        super('user');
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
     *
     * @param {string} uri Absolute uri
     * @return {Primise}
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
                if (req.status === 200) {
                    const img = new Blob([req.response], {type: 'image/png'});
                    return resolve(img);
                } else {
                    return reject(new Error('Avatar download: ' + req.statusText));
                }
            };
            req.send();
        });
    }

    /**
     * Upload an avatar for an user
     *
     * @param {string} id: User id
     * @param {Blob} img: Image as a blob
     * @return {Promise}
     */
    uploadAvatar(id, img) {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();
            req.open('POST', constants.webSocketUri + '/user/avatar/' + id, true);
            req.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem(constants.jwtName));

            let formData = new FormData();
            formData.append("avatar", img);

            req.onload = () => {
                if (req.status === 200) {
                    const img = new Blob([req.response], {type: 'image/png'});
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
