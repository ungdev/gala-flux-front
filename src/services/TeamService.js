import BaseService from './BaseService';

/**
 * Class used for all about Teams
 */
class TeamService extends BaseService {

    constructor() {
        super('team');
    }

    /**
     * Pull team data from the server
     *
     * @param  {string} id  id of the team you wan to get
     * @return {Promise}    Promise that resolve to team data
     */
    getTeam(id) {
        return new Promise((resolve, reject) => {
            // first request : get the user
            iosocket.request({
                method: 'get',
                url: '/team/' + id
            }, (resData, jwres) => {
                if(jwres.error) {
                    return reject(jwres.error);
                }
                return resolve(resData);
            });
        });
    }

}

export default new TeamService();
