import {ApiError} from 'errors';
import BaseService from 'services/BaseService';

/**
 * Class used for all about alert
 */
class AlertService extends BaseService {

    constructor() {
        super('alert');
    }

    /**
     * Make a request to update the users assigned to an alert
     * @param {string} id: the alert id
     * @param {Array} users: the new users list
     * @returns {Promise}
     */
    updateAssignedUsers(id, users) {
        return this.request('put', '/alert/' + id + '/users', {
            users
        });
    }
}

export default new AlertService();
