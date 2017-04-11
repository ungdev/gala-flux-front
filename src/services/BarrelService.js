import {ApiError} from '../errors';

/**
 * Class used for all about barrel
 */
class BarrelService {

    /**
     * Make a webSocket request to get the barrels
     *
     * @param {Array|null} filters
     * @return {Promise}
     */
    getBarrels(filters) {
        return new Promise((resolve, reject) => {
            iosocket.request({
                method: 'get',
                data: {filters},
                url: '/barrel'
            }, (resData, jwres) => {
                if(jwres.error) {
                    return reject(new ApiError(jwres));
                }
                return resolve(resData);
            });
        });
    }

    /**
     * Make a request to delete a barrel
     *
     * @callback doneCallback
     *
     * @param {String} barrelId : the barrel to delete
     * @param {doneCallback} callback
     */
    deleteBarrel(barrelId, callback) {
        iosocket.request({
            method: 'delete',
            url: '/barrel/' + barrelId
        }, (resData, jwres) => {
            jwres.error ? callback(jwres.error) : callback(null, resData);
        });
    }

    /**
     * Make a request to update a barrel
     *
     * @callback doneCallback
     *
     * @param {string} barrelId
     * @param {object} data
     * @param {doneCallback} callback
     */
    updateBarrel(barrelId, data, callback) {
        iosocket.request({
            method: 'put',
            url: '/barrel/' + barrelId,
            data
        }, (resData, jwres) => {
            jwres.error ? callback(jwres.error) : callback(null, resData);
        });
    }

}

export default new BarrelService();