import {ApiError} from 'errors';

export default class BaseService {

    constructor(modelName) {
        this._modelName = modelName;
        this._baseUrl = '/' + modelName;
    }

    /**
     * Shortcut to io.request
     *
     * @param {string} method method of the request
     * @param {object} url Url of the request
     * @param {object} data facultative data object
     * @returns {Promise}
     */
    request(method, url, data) {
        return io.request({
            method,
            url,
            data: data || {},
        });
    }

    /**
     * Subscribe to all model modifications
     *
     * @returns {Promise}
     */
    subscribe() {
        return this.request('post', this._baseUrl + '/subscribe');
    }

    /**
     * Unsubscribe from all model modifications
     *
     * @returns {Promise}
     */
    unsubscribe() {
        return this.request('post', this._baseUrl + '/unsubscribe');
    }

    /**
     * Make a get request
     *
     * @param {object} filters:
     * @returns {Promise}
     */
    get(filters = {}) {
        return this.request('get', this._baseUrl, filters);
    }

    /**
     * Make a request to get a document by his id
     *
     * @param id
     * @returns {Promise}
     */
    getById(id) {
        return this.get({id})
        .then((data) => {
            return Promise.resolve(data[0]);
        });
    }

    /**
     * Make a create request
     *
     * @param {object} data: the new object values
     * @returns {Promise}
     */
    create(data) {
        return this.request('post', this._baseUrl, data);
    }

    /**
     * Make an update request
     *
     * @param {string} id: the id of the object to update
     * @param {object} data: the new object values
     * @returns {Promise}
     */
    update(id, data) {
        return this.request('put', this._baseUrl + '/' + id, data);
    }

    /**
     * Make a destroy request
     *
     * @param id: the id of the object to delete
     * @returns {Promise}
     */
    destroy(id) {
        return this.request('delete', this._baseUrl + '/' + id, data);
    }

}
