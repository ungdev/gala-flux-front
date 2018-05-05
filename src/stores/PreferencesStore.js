import BaseStore from 'stores/BaseStore';
import AuthStore from 'stores/AuthStore';
import UserService from 'services/UserService';

class PreferencesStore extends BaseStore {

    constructor() {
        super();

        // Data container
        this._preferences = {};

        // Bind
        this._handlePreferencesEvent = this._handlePreferencesEvent.bind(this);
    }

    /**
     * init the store : pull last preferences
     */
    _init() {
        // fetch new preferences
        UserService.getPreferences()
        .then(preferences => {
            this._preferences = preferences;
            if(global.Android) Android.setPreferences(JSON.stringify(this._preferences));
            this.emitChange();
        })
        .catch(error => NotificationActions.error("Erreur lors de la lecture des préférences utilisateur.", error));

        // Listen for new events
        io.on('preferences', this._handlePreferencesEvent);
    }


    /**
     * Handle new Message
     * @param message
     */
    _handlePreferencesEvent(e) {
        if(e.userId == AuthStore.user.id)
        {
            this._preferences = e.preferences;
            if(global.Android) Android.setPreferences(JSON.stringify(this._preferences));
            this.emitChange();
        }
        else {
            console.warn('Preferences update received for the wrong user: ' + e.userId + ' instead of ' + AuthStore.user.id)
        }
    }

    get preferences() {
        return this._preferences;
    }

    _handleActions(action) {
        super._handleActions(action);
        switch(action.type) {
            case "AUTH_AUTHENTICATED":
                this._init();
                break;
        }
    }
}

export default new PreferencesStore();
