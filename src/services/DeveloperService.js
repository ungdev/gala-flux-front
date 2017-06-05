import BaseService from 'services/BaseService';
import NotificationActions from 'actions/NotificationActions';
import {ApiError} from 'lib/errors';
import * as constants from '../config/constants';

class DeveloperService extends BaseService {

    constructor() {
        super('developer');
    }

    /**
     * Trigger a refresh of all browsers connected to flux
     */
    refresh() {
        return this.request('post', '/developer/refresh');
    }

}

export default new DeveloperService();
