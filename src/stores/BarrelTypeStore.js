import BaseStore from 'stores/BaseStore';
import BarrelTypeService from 'services/BarrelTypeService';

class BarrelTypeStore extends BaseStore {

    constructor() {
        super('barreltype', BarrelTypeService);
    }

    get types() {
        return this.getUnIndexedData();
    }

}

export default new BarrelTypeStore();
