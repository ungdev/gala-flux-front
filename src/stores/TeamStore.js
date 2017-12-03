import BaseStore from 'stores/BaseStore';
import AuthStore from 'stores/AuthStore';
import TeamService from 'services/TeamService';

class TeamStore extends BaseStore {

    constructor() {
        super('team', TeamService);

        // Force subscribe
        this._forceSubscribe = true;
    }

    /**
     * Get available groups from team list
     * @param {array} teams team list
     * @return {array} role list
     */
    get groups() {
        let groups = new Set();
        for (let team of this._modelData) {
            if(team[1].group) {
                groups.add(team[1].group);
            }
        }
        groups = [...groups];
        groups.sort((a,b) =>  a.localeCompare(b));
        return groups;
    }
}

module.exports = new TeamStore();
export default module.exports;
