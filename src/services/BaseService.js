import {ApiError} from 'errors';

export default class BaseService {

    constructor(modelName) {
        this._modelName = modelName;
        this._baseUrl = '/' + modelName;
    }

    /**
     * Make a socket request on the rest API
     *
     * @param {object} data: contains at least the method and url
     * @returns {Promise}
     */
    _makeRequest(data) {
        return new Promise((resolve, reject) => {
            iosocket.request(data, (resData, jwres) => {
                if(jwres.error) {
                    return reject(new ApiError(jwres));
                }
                return resolve(resData);
            });
        });
    }

    /**
     * Subscribe to all model modifications
     *
     * @returns {Promise}
     */
    subscribe() {
        return this._makeRequest({
            method: 'post',
            url: this._baseUrl + '/subscribe'
        });
    }

    /**
     * Unsubscribe from all model modifications
     *
     * @returns {Promise}
     */
    unsubscribe() {
        return this._makeRequest({
            method: 'post',
            url: this._baseUrl + '/unsubscribe'
        });
    }

    /**
     * Make a get request
     *
     * @param {object} filters:
     * @returns {Promise}
     */
    get(filters = {}) {
        return this._makeRequest({
            method: 'get',
            url: this._baseUrl,
            data: {filters}
        });
    }

    /**
     * Make a request to get a document by his id
     *
     * @param id
     * @returns {Promise}
     */
    getById(id) {
        return this._makeRequest({
            method: 'get',
            url: this._baseUrl + '/' + id
        });
    }

    /**
     * Make a create request
     *
     * @param {object} data: the new object values
     * @returns {Promise}
     */
    create(data) {
        return this._makeRequest({
            method: 'post',
            url: this._baseUrl,
            data
        });
    }

    /**
     * Make an update request
     *
     * @param {string} id: the id of the object to update
     * @param {object} data: the new object values
     * @returns {Promise}
     */
    update(id, data) {
        return this._makeRequest({
            method: 'put',
            url: this._baseUrl + '/' + id,
            data
        });
    }

    /**
     * Make a destroy request
     *
     * @param id: the id of the object to delete
     * @returns {Promise}
     */
    destroy(id) {
        return this._makeRequest({
            method: 'delete',
            url: this._baseUrl + '/' + id
        });
    }

}
