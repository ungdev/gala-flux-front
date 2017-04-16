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
     * @param {String} barrelId : the barrel to delete
     * @return {Promise}
     */
    deleteBarrel(barrelId) {
        return new Promise((resolve, reject) => {
            iosocket.request({
                method: 'delete',
                url: '/barrel/' + barrelId
            }, (resData, jwres) => {
                if (jwres.error) {
                    return reject(new ApiError(jwres));
                }
                return resolve(resData);
            });
        });
    }

    /**
     * Make a request to update a barrel
     *
     * @param {string} barrelId
     * @param {object} data
     * @return {Promise}
     */
    updateBarrel(barrelId, data) {
        return new Promise((resolve, reject) => {
            iosocket.request({
                method: 'put',
                url: '/barrel/' + barrelId,
                data
            }, (resData, jwres) => {
                if (jwres.error) {
                    return reject(new ApiError(jwres));
                }
                return resolve(resData);
            });
        });
    }

}

export default new BarrelService();