import {ApiError} from '../errors';

/**
 * Class used for all about barrel types
 */
class BarrelTypeService {

    /**
     * Make a webSocket request to get the barrel types
     *
     * @param {Array|null} filters
     * @return {Promise}
     */
    getBarrelTypes(filters) {
        return new Promise((resolve, reject) => {
            iosocket.request({
                method: 'get',
                data: {filters},
                url: '/barreltype'
            }, (resData, jwres) => {
                if(jwres.error) {
                    return reject(new ApiError(jwres));
                }
                return resolve(resData);
            });
        });
    }

    /**
     * Make a request to delete this barrel type
     *
     * @param {String} typeId : the barrel type to delete
     * @return {Promise}
     */
    deleteBarrelType(typeId) {
        return new Promise((resolve, reject) => {
            iosocket.request({
                method: 'delete',
                url: '/barreltype/' + typeId
            }, (resData, jwres) => {
                if (jwres.error) {
                    return reject(new ApiError(jwres));
                }
                return resolve(resData);
            });
        });
    }

    /**
     * Make a request to create a new barrel type
     *
     * @param {object} data
     * @return {Promise}
     */
    createBarrelType(data) {
        return new Promise((resolve, reject) => {
            iosocket.request({
                method: 'post',
                url: '/barreltype',
                data
            }, (resData, jwres) => {
                if (jwres.error) {
                    return reject(new ApiError(jwres));
                }
                return resolve(resData);
            });
        });
    }

    /**
     * Make a request to update a barrel type
     *
     * @param {string} typeId
     * @param {object} data
     * @return {Promise}
     */
    updateBarrelType(typeId, data) {
        return new Promise((resolve, reject) => {
            iosocket.request({
                method: 'put',
                url: '/barreltype/' + typeId,
                data
            }, (resData, jwres) => {
                if (jwres.error) {
                    return reject(new ApiError(jwres));
                }
                return resolve(resData);
            });
        });
    }

    /**
     * Make a request to create barrels
     *
     * @param {object} data
     * @return {Promise}
     */
    saveBarrels(data) {
        return new Promise((resolve, reject) => {
            iosocket.request({
                method: 'post',
                url: '/barreltype/barrel',
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

export default new BarrelTypeService();