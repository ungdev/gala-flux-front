import { EventEmitter } from 'events';
import AppDispatcher from '../dispatchers/AppDispatcher';

export default class BaseStore extends EventEmitter {

    constructor(modelName, fetchMethod) {
        super();

        // the fetched data
        this._modelData = [];
        // the model name
        this._modelName = modelName;
        // the method to fetch the data of this model
        this._fetchMethod = fetchMethod;

        // the data to fetch
        this._filters = {length: 0};
    }

    subscribe(actionSubscribe) {
        this._dispatchToken = AppDispatcher.register(actionSubscribe());
    }

    get dispatchToken() {
        return this._dispatchToken;
    }

    emitChange() {
        this.emit('CHANGE');
    }

    addChangeListener(cb) {
        this.on('CHANGE', cb)
    }

    removeChangeListener(cb) {
        this.removeListener('CHANGE', cb);
    }

    /**
     * Use the fetchMethod to fetch the data needed of this model.
     *
     * @param {number} [componentToken]: the new component
     * @return {Promise}
     */
    fetchData(componentToken) {

        return new Promise((resolve, reject) => {
            this._fetchMethod(this.getFiltersSet())
                .then(result => {
                    this._modelData = result;
                    this.emitChange();

                    // listen model changes
                    iosocket.on(this._modelName, this._handleModelEvents);

                    resolve({
                        result,
                        token: componentToken
                    });
                })
                .catch(error => reject(error));
        });
    }

    /**
     * Add new filters and fetch the data to get the new asked data
     *
     * @param {Array|null} filters: new the data to get
     * @returns {Promise}
     */
    loadData(filters) {
        const componentToken = this._filters.length;
        this._filters.length++;
        this._filters[componentToken] = filters;
        // refresh the store with the new filters
        return this.fetchData(componentToken);
    }

    /**
     * Remove the data used only for the component which has this token
     *
     * @param {number|null} token: the component's token
     */
    unloadData(token) {
        delete this._filters[token];
        // reload only the data needed
        this.fetchData();
    }

    /**
     * From this._filters, return an array of unique filters
     * Or null if one filter is null
     *
     * @returns {Array|null}
     */
    getFiltersSet() {
        let filters = [];
        for (let filter in this._filters) {
            if (this._filters[filter] === null) {
                filters = null;
                break;
            }
            filters = [...new Set([...filters, ...this._filters[filter]])];
        }
        return filters;
    }
}