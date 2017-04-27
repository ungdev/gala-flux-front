import {ApiError} from '../errors';
import BaseService from './BaseService';

/**
 * Class used for all about alert
 */
class AlertService extends BaseService {

    constructor() {
        super('alert');
    }
}

export default new AlertService();
