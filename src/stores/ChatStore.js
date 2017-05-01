import BaseStore from './BaseStore';
import ChatService from '../services/ChatService';
import AuthStore from './AuthStore';

class ChatStore extends BaseStore {

    constructor() {
        super('message', ChatService);

        this._newMessages = {};

        this.subscribe(() => this._handleActions.bind(this));
    }

    get messages() {
        return this.getUnIndexedData();
    }

    get newMessages() {
        return this._newMessages;
    }

    /**
     * Return the number of new messages of the given channel
     * @param {string} channel: the channel name
     * @returns {number}
     */
    getNewMessages(channel) {
        if (this._newMessages[channel]) {
            return this._newMessages[channel];
        }
        return 0;
    }

    /**
     * set new messages of a given channel to 0
     * @param {string} channel
     */
    _resetNewMessages(channel) {
        this._newMessages[channel] = 0;
        this._updateLocalStorage(channel);
        this.emitChange();
    }

    /**
     * Save the last message viewed of a channel in the localStorage
     *
     * @param channel
     */
    _updateLocalStorage(channel) {
        let lastViewed = localStorage.getItem('lastViewed');

        if (!lastViewed) {
            lastViewed = {};
        } else {
            lastViewed = JSON.parse(lastViewed);
        }

        lastViewed[channel] = this._getLastChannelMessage(channel);

        localStorage.setItem('lastViewed', JSON.stringify(lastViewed));
    }

    /**
     * Return the last message of a given channel
     *
     * @param {string} channel: the channel name
     * @returns {object|null}
     */
    _getLastChannelMessage(channel) {
        let lastMessage = null;

        for (let id in this._modelData) {
            if (!lastMessage || (lastMessage.createdAt < this._modelData[id].createdAt)) {
                lastMessage = this._modelData[id];
            }
        }

        return lastMessage;
    }

    /**
     * Handle new Message
     * @param message
     */
    _handleNewMessage(message) {
        // it's new message only if the sender is not the authenticated user
        if (AuthStore.user.id !== message.sender) {
            // increment the number of unviewed messages for this channel
            this._newMessages[message.channel] ? this._newMessages[message.channel]++ : this._newMessages[message.channel] = 1;
            this.emitChange();
        }
    }

    /**
     * Handle webSocket events about the model
     *
     * @param {object} e : the event
     */
    _handleModelEvents(e) {
        switch (e.verb) {
            case "created":
                if(!this.findById(e.id)) {
                    // Add to the list only if it match our list
                    if(this._match(e.data, this.getFiltersSet())) {
                        this._set(e.id, e.data);
                    }
                    // notification
                    this._handleNewMessage(e.data);
                }
                else {
                    console.warn('Received `created` socket event more than once for the store `' + this._modelName + '`', e);
                }
                break;
            case "updated":
                if(this.findById(e.id)) {
                    this._set(e.id, e.data);
                }
                break;
            case "destroyed":
                if(this.findById(e.id)) {
                    this._delete(e.id);
                }
                break;
        }
    }

    /**
     * Handle Actions from BarrelActions
     *
     * @param {object} action : the action
     */
    _handleActions(action) {
        switch(action.type) {
            case "MESSAGES_VIEWED":
                this._resetNewMessages(action.channel);
                break;
        }
    }

}

export default new ChatStore();
