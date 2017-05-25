import BaseService from 'services/BaseService';

/**
 * Class used for all about barrel
 */
class BarrelService extends BaseService {

    constructor() {
        super('barrel');
    }

    moveBarrels(barrels, location) {
        return this.request('put', '/barrel/location', {
            barrels,
            location
        });
    }

}

export default new BarrelService();
