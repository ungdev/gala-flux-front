import BaseService from 'services/BaseService';

/**
 * Class used for all about bottle types
 */
class BottleTypeService extends BaseService {

    constructor() {
        super('bottletype');
    }

    /**
     * Make a request to set the number of bottles for a type
     *
     * @param {string} id Type id
     * @param {number} number Number of bottles wanted
     * @return {Promise}
     */
    setBottleNumber(id, number) {
        return this.request('post', '/bottletype/bottle', {
            id, number,
        });
    }

}

export default new BottleTypeService();
