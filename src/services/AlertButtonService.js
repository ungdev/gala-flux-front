/**
 * Class used to make requests about alert buttons
 */
class AlertButtonService {

    getAlertButtons(callback) {
        io.socket.request({
            method: 'get',
            url: '/alertbutton'
        }, (resData, jwres) => {
            if (jwres.error) {
                return callback(jwres);
            }
            return callback(null, resData);
        });
    }

}

export default new AlertButtonService();