import BaseStore from './BaseStore';

class ChatStore extends BaseStore {

    constructor() {
        super();
        this.subscribe(() => this._handleActions.bind(this));

        this.messages = [];
    }

    /**
     * Push to the new message into the messages array
     * and emit changes
     *
     * @param message
     */
    _newMessage(message) {
        this.messages.push(message);
        this.emitChange();
    }

    /**
     * Fill the messages
     * and emit changes
     *
     * @param messages
     * @private
     */
    _setMessages(messages) {
        this.messages = messages;
        this.emitChange();
    }

    _handleActions(action) {
        switch(action.type) {
            case "NEW_MESSAGE":
                this._newMessage(action.message);
                break;
            case "GET_MESSAGES":
                this._setMessages(action.messages);
                break;
        }
    }

}

export default new ChatStore();