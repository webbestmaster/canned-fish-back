const MainModel = require('main-model');

const attr = {
    connection: 'connection',
    user: 'user',
    unit: 'unit'
};

/**
 *
 * @param {object} data - connection initialized data
 *      @param {object} data.connection - "native" socket.io connection
 */
class ConnectionWrapper extends MainModel {
    constructor(data) {
        super(data);

        console.log('connection wrapper created');

        const connectionWrapper = this;

        connectionWrapper.createUser();
    }

    getConnection() {
        return this.get(attr.connection);
    }

    createUser() {
        const connectionWrapper = this;
        const connection = connectionWrapper.getConnection();

        connectionWrapper.set(attr.user, {
            id: 'user-id_' + Math.random()
        });

        connection.emit('create-user', connectionWrapper.get(attr.user));

        console.log('user created');
    }

    destroy() {
        const connectionWrapper = this;
        const unit = connectionWrapper.get(attr.unit);

        if (unit) {
            connectionWrapper.get(attr.unit).destroy();
        } else {
            console.warn('connection destroyed: unit is not exist');
        }
        super.destroy();

        console.log('connection destroyed');
    }

/*
    onXY(data) {
        const connectionWrapper = this;
        const unit = connectionWrapper.get('unit');

        unit.set(data);
    }
*/
}

module.exports = ConnectionWrapper;
