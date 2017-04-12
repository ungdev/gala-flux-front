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

        // binding
        this._delete = this._delete.bind(this);
        this._set = this._set.bind(this);
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
                    this._setModelData(result);

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

    /**
     * Delete an item in modelData by id
     * @param {string} id: the item id
     */
    _delete(id) {
        delete this._modelData[id];
        this.emitChange();
    }

    /**
     * Add or update an item
     * @param {string} id: the item id
     * @param {object} data: the item data
     */
    _set(id, data) {
        this._modelData[id] = data;
        this.emitChange();
    }

    /**
     * From an array of objects, create an array where the key is
     * the object id and the value is the object
     *
     * @param {Array} data: array of objects
     */
    _setModelData(data) {
        let newModelData = [];
        for (let item of data) {
            newModelData[item.id] = item;
        }
        this._modelData = newModelData;
        this.emitChange();
    }

    /**
     * Find a data in the store by his id
     *
     * @param {string} id: the requested data id
     * @returns {object|undefined}
     */
    findById(id) {
        return this._modelData[id];
    }

    /**
     * Find list of elements that match filters
     *
     * @param  {Object} filters: Object of filters
     * @return {Array} Array of elements
     */
    find(filters) {
        let out = [];

        for (let i in this._modelData) {
            let add = true;
            for (let key in filters) {
                if(this._modelData[i][key] !== filters[key]) {
                    add = false;
                    break;
                }
            }
            if(add) {
                out.push(this._modelData[i]);
            }
        }

        return out;
    }

    /**
     * Return the first element that matches the filters
     *
     * @param {Object} filters: Object of filters
     * @return {Object|null} the object found or null by default
     */
    findOne(filters) {
        for (let i in this._modelData) {
            let add = true;
            for (let key in filters) {
                if(this._modelData[i][key] !== filters[key]) {
                    add = false;
                    break;
                }
            }
            if(add) {
                return this._modelData[i];
            }
        }

        return null;
    }

    /**
     * Return a classic Array from the indexed objects in modelData
     *
     * @returns {Array}
     */
    getUnIndexedData() {
        let out = [];

        for (let i in this._modelData) {
            out.push(this._modelData[i]);
        }

        return out;
    }
}