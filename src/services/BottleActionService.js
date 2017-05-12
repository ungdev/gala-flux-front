import BaseService from 'services/BaseService';

/**
 * Class used for all about bottle actions
 */
class BottleActionService extends BaseService {

    constructor() {
        super('bottleaction');
    }

    /**
     * Make a request to get the current count of each bottle in each team
     *
     * @return {Promise}
     */
    getCount() {
        return this._makeRequest({
            method: 'get',
            url: '/bottleaction/count',
        });
    }

}

export default new BottleActionService();
