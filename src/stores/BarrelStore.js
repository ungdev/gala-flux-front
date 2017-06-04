import BaseStore from 'stores/BaseStore';
import BarrelService from 'services/BarrelService';

class BarrelStore extends BaseStore {

    constructor() {
        super('barrel', BarrelService);
    }
}

module.exports = new BarrelStore();
export default module.exports;
