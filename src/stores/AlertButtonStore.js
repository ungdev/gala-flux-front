import BaseStore from 'stores/BaseStore';

import AlertButtonService from 'services/AlertButtonService';

class AlertButtonStore extends BaseStore {

    constructor() {
        super('alertbutton', AlertButtonService);

        this.subscribe(() => this._handleActions.bind(this));
    }

    get buttons() {
        return this.getUnIndexedData();
    }

    _handleActions(action) {
        switch(action.type) {}
    }

}

export default new AlertButtonStore();
