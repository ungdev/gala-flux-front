import BaseStore from 'stores/BaseStore';
import MessageService from 'services/MessageService';
import NotificationActions from 'actions/NotificationActions';
import AuthStore from 'stores/AuthStore';

class MessageStore extends BaseStore {

    constructor() {
        super('message', MessageService);

        // Force subscribe
        this._forceSubscribe = true;

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


module.exports = new MessageStore();
export default module.exports;
