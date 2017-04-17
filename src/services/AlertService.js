import {ApiError} from '../errors';
import AlertActions from '../actions/AlertActions';

/**
 * Class used for all about Authentication
 */
class AlertService {

    /**
     * Send a new alert to the server
     *
     * @callback errorCallback
     *
     * @param {string} text
     * @param {errorCallback} error
     */
    sendAlert(text, error) {
        iosocket.request({
            method: 'post',
            url: '/alert/create',
            data: {text}
        }, (resData, jwres) => {
            if (jwres.error) {
                return error(jwres);
            }
            AlertActions.newAlert(text);
        });
    }

    /**
     * Make a webSocket request to get the alerts
     *
     * @param {Array|null} filters
     * @return {Promise}
     */
    getAlerts(filters) {
        return new Promise((resolve, reject) => {
            iosocket.request({
                method: 'get',
                data: {filters},
                url: '/alert'
            }, (resData, jwres) => {
                if(jwres.error) {
                    return reject(new ApiError(jwres));
                }
                return resolve(resData);
            });
        });
    }
}

export default new AlertService();
