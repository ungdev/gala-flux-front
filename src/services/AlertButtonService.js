import BaseService from './BaseService';

/**
 * Class used to make requests about alert buttons
 */
class AlertButtonService extends BaseService {

    constructor() {
        super('alertbutton');
    }

    /**
     * Send a request to create a new Alert from an AlertButton
     *
     * @param {string} id: the button id
     * @param message
     * @returns {Promise}
     */
    createAlert(id, message = "") {
        return this._makeRequest({
            method: 'post',
            url: '/alertbutton/alert',
            data: {
                id,
                message
            }
        });
    }
}

export default new AlertButtonService();
