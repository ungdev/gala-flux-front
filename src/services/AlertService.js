import {ApiError} from 'lib/errors';
import BaseService from 'services/BaseService';

/**
 * Class used for all about alert
 */
class AlertService extends BaseService {

    constructor() {
        super('alert');
    }
}

export default new AlertService();
