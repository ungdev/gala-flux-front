import BaseService from './BaseService';

/**
 * Class used for all about bottle
 */
class BottleService extends BaseService {

    constructor() {
        super('bottle');
    }

    moveBottles(bottles, location) {
        return this._makeRequest({
            method: 'put',
            url: '/bottle/location',
            data: {
                bottles,
                location
            }
        });
    }

}

export default new BottleService();