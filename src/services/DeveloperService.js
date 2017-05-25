import BaseService from 'services/BaseService';
import NotificationActions from 'actions/NotificationActions';
import {ApiError} from 'errors';
import * as constants from '../config/constants';

class DeveloperService extends BaseService {

    constructor() {
        super('developer');
    }

    /**
     * Trigger a refresh of all browsers connected to flux
     */
    refresh() {
        return this.request('post', '/developer/refresh', {
            id, number,
        });
    }

}

export default new DeveloperService();
