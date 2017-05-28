import BaseStore from 'stores/BaseStore';
import BottleTypeService from 'services/BottleTypeService';

class BottleTypeStore extends BaseStore {

    constructor() {
        super('bottleType', BottleTypeService);
    }

    get types() {
        return this.getUnIndexedData();
    }

}

export default new BottleTypeStore();
