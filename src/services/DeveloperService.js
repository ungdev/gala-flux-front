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
        return new Promise((resolve, reject) => {
            iosocket.post('/developer/refresh', (resData, jwres) => {
                if(jwres.error) {
                    return reject(new ApiError(jwres));
                }
                return resolve(resData);
            });
        });
    }

}

export default new DeveloperService();
