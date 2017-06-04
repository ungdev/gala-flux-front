import BaseStore from 'stores/BaseStore';
import BottleTypeService from 'services/BottleTypeService';

class BottleTypeStore extends BaseStore {

    constructor() {
        super('bottleType', BottleTypeService);
    }

}

module.exports = new BottleTypeStore();
export default module.exports;
