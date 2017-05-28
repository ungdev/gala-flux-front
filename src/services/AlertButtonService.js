import BaseService from 'services/BaseService';

/**
 * Class used to make requests about alert buttons
 */
class AlertButtonService extends BaseService {

    constructor() {
        super('alertButton');
    }
}

export default new AlertButtonService();
