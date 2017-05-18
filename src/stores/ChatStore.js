import BaseStore from 'stores/BaseStore';
import ChatService from 'services/ChatService';
import NotificationActions from 'actions/NotificationActions';
import AuthStore from 'stores/AuthStore';

class ChatStore extends BaseStore {

    constructor() {
        super('message', ChatService);

        // Force subscribe
        this._forceSubscribe = true;

    }

    get messages() {
        return this.getUnIndexedData();
    }

    /**
     * Return the last loaded message of a given channel
     *
     * @param {string} channel: the channel name
     * @returns {object|null}
     */
    getLastChannelMessage(channel) {
        let lastMessage = null;

        for (let id in this._modelData) {
            if (!lastMessage || (lastMessage.createdAt < this._modelData[id].createdAt)) {
                lastMessage = this._modelData[id];
            }
        }

        return lastMessage;
    }
}

export default new ChatStore();
