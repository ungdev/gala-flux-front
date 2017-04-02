/**
 * Class used to make requests about alert buttons
 */
class AlertButtonService {

    /**
     * Make a webSocket request to get the alert buttons
     * Then call the callback function with the result
     *
     * @callback callback
     *
     * @param {callback} callback
     */
    getAlertButtons(callback) {
        io.socket.request({
            method: 'get',
            url: '/alertbutton'
        }, (resData, jwres) => {
            jwres.error ? callback(jwres.error) : callback(null, resData);
        });
    }

    /**
     * Make a request to create an alert button
     *
     * @callback callback
     *
     * @param {Object} data : the new alert button data
     * @param {callback} callback
     */
    createAlertButton(data, callback) {
        io.socket.request({
            method: 'post',
            url: '/alertbutton',
            data
        }, (resData, jwres) => {
            jwres.error ? callback(jwres.error) : callback(null, resData);
        });
    }

    /**
     * Make a request to delete this alert button
     *
     * @callback doneCallback
     *
     * @param {String} id : the alert button to delete
     * @param {callback} callback
     */
    deleteAlertButton(id, callback) {
        io.socket.request({
            method: 'delete',
            url: '/alertbutton/' + id
        }, (resData, jwres) => {
            jwres.error ? callback(jwres.error) : callback(null, resData);
        });
    }

    /**
     * Make a request to update this alert button
     *
     * @callback doneCallback
     *
     * @param {String} id : the alert button to delete
     * @param {object} data : the alert button attributes
     * @param {callback} callback
     */
    updateAlertButton(id, data, callback) {
        io.socket.request({
            method: 'put',
            url: '/alertbutton/' + id,
            data
        }, (resData, jwres) => {
            jwres.error ? callback(jwres.error) : callback(null, resData);
        });
    }

}

export default new AlertButtonService();