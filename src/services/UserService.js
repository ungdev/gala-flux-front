import UserActions from '../actions/UserActions';

/**
 * Class used for all about Authentication
 */
class UserService {

    /**
     * Make a webSocket request to get the users
     * Then return the data
     *
     * @callback errCallback
     * @callback successCallback
     *
     * @param {successCallback} success
     * @param {errCallback} err
     */
    getUsers(success, err) {
        iosocket.request({
            method: 'get',
            url: '/user'
        }, (resData, jwres) => {
            if (jwres.error) {
                return err(jwres);
            }
            return success(jwres.body);
        });
    }

    /**
     * Make a webSocket request to delete a user
     *
     * @callback errorCallback
     *
     * @param {String} uid : the user id
     * @param {errorCallback} err
     */
    deleteUser(uid, err) {
        iosocket.request({
            method: 'delete',
            url: '/user/' + uid
        }, (resData, jwres) => {
            if (jwres.error) {
                err(jwres);
            } else {
                console.log("ok delete user : ", jwres);
            }
        });
    }

    /**
    * Make a webSocket request to update a user
    *
    * @callback erroCallback
    *
    * @param {String} uid : the user id
    * @param {object} data : the attributes to update
    * @param {erroCallback} err
    */
    updateUser(uid, data, err) {
        iosocket.request({
            method: 'put',
            url: '/user/' + uid,
            data
        }, (resData, jwres) => {
            if (jwres.error) {
                err(jwres);
            } else {
                console.log("ok update user : ", jwres);
            }
        });
    }

}

export default new UserService();