import {ApiError} from '../errors';
import AlertActions from '../actions/AlertActions';

/**
 * Class used for all about Authentication
 */
class AlertService {

    /**
     * Make a request to get all the alerts
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

    /**
      * Make a request to update an alert
      *
      * @param {String} alertId : the alert id
      * @param {object} data : the attributes to update
      * @return {Promise} A promise to end the update
      */
    updateAlert(alertId, data) {
        return new Promise((resolve, reject) => {
            iosocket.put('/alert/' + alertId, data, (resData, jwres) => {
                if(jwres.error) {
                    return reject(new ApiError(jwres));
                }
                return resolve(resData);
            });
        });
    }
}

export default new AlertService();
