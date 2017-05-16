import BaseStore from 'stores/BaseStore';
import ChatService from 'services/ChatService';
import NotificationActions from 'actions/NotificationActions';
import AuthStore from 'stores/AuthStore';

class ChatStore extends BaseStore {

    constructor() {
        super('message', ChatService);

        this._newMessages = {};

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
     * fetch the messages in the database and compare them to the lasts viewed in the localStorage
     *
     */
    _countNewMessages() {
        // fetch all the messages
        ChatService.get()
            .then(messages => {
                // read the last messages viewed
                if(localStorage.getItem('lastMessages')) {
                    const lastMessages = JSON.parse(localStorage.getItem('lastMessages'));
                    const newMessages = {};

                    // for each messages, check if he is more recent than the last viewed
                    for (let message of messages) {
                        if (lastMessages[message.channel] && lastMessages[message.channel].createdAt < message.createdAt) {
                            if (newMessages[message.channel]) {
                                newMessages[message.channel]++;
                            } else {
                                newMessages[message.channel] = 1;
                            }
                        }
                    }

                    this._newMessages = newMessages;
                    this.emitChange();
                }
            })
            .catch(error => NotificationActions.error("Erreur lors de la lecture des messages non lus.", error));
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
        let lastMessages = localStorage.getItem('lastMessages');

        if (!lastMessages) {
            lastMessages = {};
        } else {
            lastMessages = JSON.parse(lastMessages);
        }

        lastMessages[channel] = this._getLastChannelMessage(channel);

        localStorage.setItem('lastMessages', JSON.stringify(lastMessages));
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
            this.emitNew(message);
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
        super._handleActions(action);
        switch(action.type) {
            case "MESSAGES_VIEWED":
                this._resetNewMessages(action.channel);
                break;
            case "AUTH_JWT_SAVED":
                this._countNewMessages();
                break;
        }
    }

}

export default new ChatStore();
