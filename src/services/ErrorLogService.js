import BaseService from 'services/BaseService';
import * as constants from 'config/constants';
import {ApiError} from 'lib/errors';

class ErrorLogService extends BaseService {

    constructor() {
        super('errorLog');
    }
}

export default new ErrorLogService();
