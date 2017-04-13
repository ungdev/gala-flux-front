import BaseStore from './BaseStore';
import ChatService from '../services/ChatService';

class ChatStore extends BaseStore {

    constructor() {
        super('message', ChatService.getMessages);

        this.subscribe(() => this._handleActions.bind(this));
        this._handleModelEvents = this._handleModelEvents.bind(this);
    }

    get messages() {
        return this.getUnIndexedData();
    }

    /**
     * Handle webSocket events about the Message model
     *
     * @param {object} e: the event
     */
    _handleModelEvents(e) {
        switch (e.verb) {
            case "created":
                this._set(e.id, e.data);
                break;
        }
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
