import BaseService from 'services/BaseService';

/**
 * Class used for all about barrel types
 */
class BarrelTypeService extends BaseService {

    constructor() {
        super('barrelType');
    }

    /**
     * Make a request to set the number of barrels for a type
     *
     * @param {string} id Type id
     * @param {number} number Number of barrels wanted
     * @return {Promise}
     */
    setBarrelCount(id, count) {
        return this.request('post', '/barreltype/barrel', {
            id, count,
        });
    }

}

export default new BarrelTypeService();
