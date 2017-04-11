import {ApiError} from '../errors';

/**
 * Class used to make requests about alert buttons
 */
class AlertButtonService {

    /**
     * Make a webSocket request to get the alert buttons
     *
     * @param {Array|null} filters
     * @return {Promise}
     */
    getAlertButtons(filters) {
        return new Promise((resolve, reject) => {
            iosocket.request({
                method: 'get',
                data: {filters},
                url: '/alertbutton'
            }, (resData, jwres) => {
                if(jwres.error) {
                    return reject(new ApiError(jwres));
                }
                return resolve(resData);
            });
        });
    }

    /**
     * Make a request to create an alert button
     *
     * @callback callback
     *
     * @param {Object} data : the new alert button data
     * @param {callback} callback
     */
    createAlertButton(data, callback) {
        iosocket.request({
            method: 'post',
            url: '/alertbutton',
            data
        }, (resData, jwres) => {
            jwres.error ? callback(jwres.error) : callback(null, resData);
        });
    }

    /**
     * Make a request to delete this alert button
     *
     * @callback doneCallback
     *
     * @param {String} id : the alert button to delete
     * @param {callback} callback
     */
    deleteAlertButton(id, callback) {
        iosocket.request({
            method: 'delete',
            url: '/alertbutton/' + id
        }, (resData, jwres) => {
            jwres.error ? callback(jwres.error) : callback(null, resData);
        });
    }

    /**
     * Make a request to update this alert button
     *
     * @callback doneCallback
     *
     * @param {String} id : the alert button to delete
     * @param {object} data : the alert button attributes
     * @param {callback} callback
     */
    updateAlertButton(id, data, callback) {
        iosocket.request({
            method: 'put',
            url: '/alertbutton/' + id,
            data
        }, (resData, jwres) => {
            jwres.error ? callback(jwres.error) : callback(null, resData);
        });
    }

}

export default new AlertButtonService();
