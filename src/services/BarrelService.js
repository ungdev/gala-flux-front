/**
 * Class used for all about barrel
 */
class BarrelService {

    /**
     * Make a webSocket request to get the barrels
     * Then call the callback with the result
     *
     * @callback successCallback
     * @callback errCallback
     *
     * @param {successCallback} success
     * @param {errCallback} err
     */
    getBarrels(success, err) {
        iosocket.request({
            method: 'get',
            url: '/barrel'
        }, (resData, jwres) => {
            if (jwres.error) {
                err(jwres);
            } else {
                success(jwres.body);
            }
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