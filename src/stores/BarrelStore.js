import BaseStore from 'stores/BaseStore';
import BarrelService from 'services/BarrelService';

class BarrelStore extends BaseStore {

    constructor() {
        super('barrel', BarrelService);
    }

    get barrels() {
        return this.getUnIndexedData();
    }

}

export default new BarrelStore();
