import BaseService from 'services/BaseService';
import NotificationActions from 'actions/NotificationActions';
import {ApiError} from 'errors';
import * as constants from '../config/constants';

class SessionService extends BaseService {

    constructor() {
        super('session');
    }

    /**
     * If the android interface is there
     * register the new session for this user
     */
    openSession() {
        let token = null;
        let deviceId = null;

        if (global.Android) {
            token = Android.getFirebaseToken();
            deviceId = Android.getAndroidUid();

            // Update JWT in android interface
            if(localStorage.getItem(constants.jwtName)) {
                Android.setJWT(localStorage.getItem(constants.jwtName));
            }
        }

        iosocket.post('/session/open', {token, deviceId}, (resData, jwres) => {
            if(jwres.error) {
                NotificationActions.error('Impossible d\'enregistrer cette application Android.', jwres.error, jwres.body);
            }
        });
    }

}

export default new SessionService();
