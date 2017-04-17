import BaseService from './BaseService';

/**
 * Class used for all about barrel
 */
class BarrelService extends BaseService {

    constructor() {
        super('barrel');
    }

    moveBarrels(barrels, location) {
        return this._makeRequest({
            method: 'put',
            url: '/barrel/location',
            data: {
                barrels,
                location
            }
        });
    }

}

export default new BarrelService();