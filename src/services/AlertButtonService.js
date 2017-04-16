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
                if (jwres.error) {
                    return reject(new ApiError(jwres));
                }
                return resolve(resData);
            });
        });
    }

    /**
     * Make a request to create an alert button
     *
     * @param {Object} data : the new alert button data
     * @return {Promise}
     */
    createAlertButton(data) {
        return new Promise((resolve, reject) => {
            iosocket.request({
                method: 'post',
                url: '/alertbutton',
                data
            }, (resData, jwres) => {
                if (jwres.error) {
                    return reject(new ApiError(jwres));
                }
                return resolve(resData);
            });
        });
    }

    /**
     * Make a request to delete this alert button
     *
     * @param {String} id : the alert button to delete
     * @return {Promise}
     */
    deleteAlertButton(id) {
        return new Promise((resolve, reject) => {
            iosocket.request({
                method: 'delete',
                url: '/alertbutton/' + id
            }, (resData, jwres) => {
                if (jwres.error) {
                    return reject(new ApiError(jwres));
                }
                return resolve(resData);
            });
        });
    }

    /**
     * Make a request to update this alert button
     *
     * @param {String} id : the alert button to delete
     * @param {object} data : the alert button attributes
     * @return {Promise}
     */
    updateAlertButton(id, data) {
        return new Promise((resolve, reject) => {
            iosocket.request({
                method: 'put',
                url: '/alertbutton/' + id,
                data
            }, (resData, jwres) => {
                if (jwres.error) {
                    return reject(new ApiError(jwres));
                }
                return resolve(resData);
            });
        });
    }

}

export default new AlertButtonService();
