import {ApiError} from '../errors';
import AlertActions from '../actions/AlertActions';
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
