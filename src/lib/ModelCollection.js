import BaseStore from 'stores/BaseStore';
import AuthStore from 'stores/AuthStore';

/**
 * Object returned by stores.
 * It's like an object indexed by id but read-only and the order is guarenteed.
 * Also some helpers to filter data
 */

class ModelCollection {

    /**
     * @param {Map} values Map of elements indexed by id
     */
    constructor(values) {
        if (!(values instanceof Map)) {
            throw new Error('Parameter `values` of `Collection` constructor should be a `Map` object.');
        }
        this._data = values;
    }

    /**
     * get by ID
     */
    get(id) {
        return this._data.get(parseInt(id));
    }

    /**
     * Check if id is defined
     */
    has(id) {
        return this._data.has(parseInt(id));
    }

    /**
     * map like an array
     */
    map(callback) {
        return [...this._data.values()].map(callback);
    }

    /**
     * Convert to array: Loosing index by id but keeping order
     */
    toArray() {
        return [...this._data.values()];
    }

    /**
     * Get iterrator object over values
     */
    values() {
        return this._data.values();
    }

    /**
     * Get iterrator object over keys
     */
    keys() {
        return this._data.keys();
    }

    /**
     * Convert to array: keep order but loose access by id
     */
    get first() {
        return this._data.values().next().value;
    }

    /**
     * Get the number of elements in the collection
     */
    get length() {
        return this._data.size;
    }

    /**
     * sort method like an array
     */
    sort(compareFunction) {
        this._data = new Map([...this._data].sort((a, b) => compareFunction(a[1], b[1])));
        return this;
    }

    /**
     * Sort by an attribute of objects and by taking care of the locale
     * @param {string} attribute name of the attribute to sort by
     */
    sortBy(attribute) {
        return this.sort((a, b) => (a[attribute]+'').localeCompare(b[attribute]));
    }

    /**
     * Find list of elements that match filters
     *
     * @param  {Object|Array} filters: Object of filters or array of list of filter
     * @return {Map} Map of elements indexed by id
     */
    find(filters) {
        let out = new Map();

        for (let [key, val] of this._data) {
            if(BaseStore.match(val, filters)) {
                out.set(key, val);
            }
        }

        return new ModelCollection(out);
    }

    /**
     * Find a list of team which have the given permission
     * Can only be used on a collection of objects with a role attribute (like teams)
     * @param {string} permission
     * @return {array} List of teams
     */
    findByPermission(permission) {
        let out = new Map();
        for (let [key, val] of this._data) {
            if(AuthStore.can(permission, val)) {
                out.set(key, val);
            }
        }
        return new ModelCollection(out);
    }

    /**
     * Return an object of ModelCollection indexed by the given attribute
     * @param attribute
     */
    groupBy(attribute) {
        let out = {};
        for (let [key, val] of this._data) {
            if(!out[val[attribute]]) out[val[attribute]] = new ModelCollection(new Map());
            out[val[attribute]]._data.set(key, val);
        }
        return out;
    }

}


module.exports = ModelCollection;
export default module.exports;
