import BaseService from 'services/BaseService';

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
     * @param {object} data: the alert data. can contains
     *      - {string} button: the button id
     *      - {string} message: a message (can be null if not required)
     *      - {string} team: the team id (the user team by default)
     * @returns {Promise}
     */
    createAlert(data) {
        return this._makeRequest({
            method: 'post',
            url: '/alertbutton/alert',
            data: {
                button: data.button ? data.button : null,
                message: data.message ? data.message : null,
                team: data.team ? data.team : null
            }
        });
    }
}

export default new AlertButtonService();
