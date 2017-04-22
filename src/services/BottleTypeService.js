import BaseService from './BaseService';

/**
 * Class used for all about barrel types
 */
class BottleTypeService extends BaseService {

    constructor() {
        super('bottletype');
    }

    /**
     * Make a request to set the number of bottles for a type
     *
     * @param {string} id Type id
     * @param {integer} number Number of bottles wanted
     * @return {Promise}
     */
    setBottleNumber(id, number) {
        return this._makeRequest({
            method: 'post',
            url: '/bottletype/bottle',
            data: { id, number },
        });
    }

}

export default new BottleTypeService();
