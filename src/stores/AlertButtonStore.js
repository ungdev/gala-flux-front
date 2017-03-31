import BaseStore from './BaseStore';

import AlertButtonService from '../services/AlertButtonService';

class AlertButtonStore extends BaseStore {

    constructor() {
        super();
        this.subscribe(() => this._handleActions.bind(this));

        this._buttons = [];
    }

    set buttons(v) {
        this._buttons = v;
        this.emitChange();
    }

    get buttons() {
        return this._buttons;
    }

    _init() {
        AlertButtonService.getAlertButtons((err, result) => {
            if (err) {
                console.log("get alert button err : ", err);
            } else {
                this.buttons = result;
                console.log(this.buttons);
            }
        });
    }

    _handleActions(action) {
        switch(action.type) {
            case "SAVE_JWT":
                this._init();
                break;
        }
    }

}

export default new AlertButtonStore();