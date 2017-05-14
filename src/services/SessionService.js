import {ApiError} from 'errors';
import * as constants from '../config/constants';

class SessionService {

    /**
     * If the android interface is there
     * register the new session for this user
     */
    initAndroidSession() {
        if (global.Android) {
            // Update JWT in android interface
            if(localStorage.getItem(constants.jwtName)) {
                Android.setJWT(localStorage.getItem(constants.jwtName));
            }

            // Send firebase token to server
            iosocket.post('/firebase/register', {
                    token: Android.getFirebaseToken(),
                    androidUID: Android.getAndroidUid(),
            }, (resData, jwres) => {
                if(jwres.error) {
                    NotificationActions.error('Impossible d\'enregistrer cette application Android.', jwres.error, jwres.body);
                }
            });
        }
    }

}

export default new SessionService();
