import BaseStore from 'stores/BaseStore';
import BarrelTypeService from 'services/BarrelTypeService';

class BarrelTypeStore extends BaseStore {

    constructor() {
        super('barrelType', BarrelTypeService);
    }

}

module.exports = new BarrelTypeStore();
export default module.exports;
