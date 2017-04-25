import BaseService from './BaseService';

/**
 * Class used for all about Authentication
 */
class ChatService extends BaseService {

    constructor() {
        super('message');
    }
}

export default new ChatService();
