import BaseStore from './BaseStore';
import ChatService from '../services/ChatService';

class ChatStore extends BaseStore {

    constructor() {
        super('message', ChatService.getMessages);

        this.subscribe(() => this._handleActions.bind(this));
    }

    get messages() {
        return this.getUnIndexedData();
    }

    _handleActions(action) {
        switch(action.type) {
            case "NEW_MESSAGE":
                this._newMessage(action.message);
                break;
        }
    }

}

export default new ChatStore();
