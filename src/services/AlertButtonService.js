import BaseService from './BaseService';

/**
 * Class used to make requests about alert buttons
 */
class AlertButtonService extends BaseService {

    constructor() {
        super('alertbutton');
    }

}

export default new AlertButtonService();
