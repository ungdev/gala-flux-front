import BaseService from './BaseService';

/**
 * Class used for all about barrel types
 */
class BarrelTypeService extends BaseService {

    constructor() {
        super('barreltype');
    }

    /**
     * Make a request to create barrels
     *
     * @param {object} data
     * @return {Promise}
     */
    saveBarrels(data) {
        return this._makeRequest({
            method: 'post',
            url: '/barreltype/barrel',
            data
        });
    }

}

export default new BarrelTypeService();