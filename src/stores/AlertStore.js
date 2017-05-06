import BaseStore from './BaseStore';
import AuthStore from './AuthStore';
import AlertService from '../services/AlertService';
import NotificationActions from '../actions/NotificationActions';

class AlertStore extends BaseStore {

    constructor() {
        super('alert', AlertService);

        this._newAlerts = {};

        this.subscribe(() => this._handleActions.bind(this));
    }

    get alerts() {
        return this.getUnIndexedData();
    }

    get newAlerts() {
        return this._newAlerts;
    }

    /**
     * Handle new Alert
     * @param {object} alert
     */
    _handleNewAlert(alert) {
        // it's a new alert only if the sender is not the authenticated user
        if (AuthStore.user.id !== alert.sender) {
            // increment the number of unviewed messages for this channel
            this._newAlerts.processing ? this._newAlerts.processing++ : this._newAlerts.processing = 1;
            this.emitNew(alert);
            this.emitChange();
        }
    }

    /**
     * set new messages of a given channel to 0
     * @param {string} category
     */
    _resetNewAlerts(category) {
        this._newAlerts[category] = 0;
        this._updateLocalStorage(category);
        this.emitChange();
    }

    /**
     * Save the last alert viewed in the localStorage
     *
     * @param {string} category
     */
    _updateLocalStorage(category) {
        let lastAlerts = localStorage.getItem('lastAlerts');

        if (!lastAlerts) {
            lastAlerts = {};
        } else {
            lastAlerts = JSON.parse(lastAlerts);
        }

        lastAlerts[category] = this._getLastAlert(lastAlerts);

        localStorage.setItem('lastAlerts', JSON.stringify(lastAlerts));
    }

    /**
     * Get the last alert of this category
     * @param {string} category
     * @return {object} alert
     */
    _getLastAlert(category) {
        let lastAlert = null;

        if (category === 'done') {
            for (let id in this._modelData) {
                if (!lastAlert || (this._modelData[id].severity === 'done' && this._modelData[id].updatedAt > lastAlert.updatedAt)) {
                    lastAlert = this._modelData[id];
                }
            }
        } else {
            for (let id in this._modelData) {
                if (!lastAlert || (this._modelData[id].severity !== 'done' && this._modelData[id].updatedAt > lastAlert.updatedAt)) {
                    lastAlert = this._modelData[id];
                }
            }
        }

        return lastAlert;
    }

    /**
     * fetch the messages in the database and compare them to the lasts viewed in the localStorage
     *
     */
    _countNewAlerts() {
        // fetch all the messages
        AlertService.get()
            .then(alerts => {
                // read the date of the last alert viewed
                if(localStorage.getItem('lastAlerts')) {
                    const lastAlerts = JSON.parse(localStorage.getItem('lastAlerts'));
                    const newAlerts = {
                        processing: 0,
                        done: 0
                    };

                    // for each alerts, check if it is more recent than the last viewed
                    for (let alert of alerts) {
                        // check if the alert is more recent than last viewed
                        if (alert.severity === 'done') {
                            if (alert.updatedAt > lastAlerts.done.updatedAt) {
                                newAlerts.done++;
                            }
                        } else {
                            if (alert.updatedAt > lastAlerts.processing.updatedAt) {
                                newAlerts.processing++;
                            }
                        }
                    }

                    this._newAlerts = newAlerts;
                    this.emitChange();
                }
            })
            .catch(error => NotificationActions.error("Erreur lors de la lecture des alertes non vues.", error));
    }

    /**
     * Handle Actions from BarrelActions
     *
     * @param {object} action : the action
     */
    _handleActions(action) {
        switch(action.type) {
            case "ALERT_CLOSED":
                this._delete(action.id);
                break;
            case "AUTH_JWT_SAVED":
                this._countNewAlerts();
                break;
            case "WEBSOCKET_DISCONNECTED":
                this._modelData = [];
                break;
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
                    this._handleNewAlert(e.data);
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

}

export default new AlertStore();
