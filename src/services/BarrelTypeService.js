import BaseService from 'services/BaseService';

/**
 * Class used for all about barrel types
 */
class BarrelTypeService extends BaseService {

    constructor() {
        super('barreltype');
    }

    /**
     * Make a request to set the number of barrels for a type
     *
     * @param {string} id Type id
     * @param {number} number Number of barrels wanted
     * @return {Promise}
     */
    setBarrelNumber(id, number) {
        return this._makeRequest({
            method: 'post',
            url: '/barreltype/barrel',
            data: { id, number },
        });
    }

}

export default new BarrelTypeService();
