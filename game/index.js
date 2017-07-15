const MainModel = require('main-model');
const ConnectionWrapper = require('./connection');
const Unit = require('./unit');

const attr = {
    connections: 'connections',
    units: 'units'
};

class Game extends MainModel {
    constructor(data) {
        super(data);

        const game = this;

        game.set(attr.connections, []);
        game.set(attr.units, []);
    }

    /**
     *
     * @param {object} connection - "native" socket.io connection instance
     * @return {Game} game instance
     */
    addConnection(connection) {
        const game = this;
        const connectionWrapper = new ConnectionWrapper({
            connection
        });

        game.get(attr.connections).push(connectionWrapper);

        game.listenConnection(connectionWrapper);

        console.log('connection was added');

        return game;
    }

    /**
     *
     * @param {ConnectionWrapper} connectionWrapper instance
     * @return {Game} game instance
     */
    removeConnection(connectionWrapper) {
        const game = this;
        const connections = game.get(attr.connections);
        const connectionIndex = connections.indexOf(connectionWrapper);

        if (connectionIndex === -1) {
            console.warn('connection was removed: connection is not exist');
            return game;
        }

        connections.splice(connections.indexOf(connectionWrapper), 1);

        console.log('connection was removed');

        return game;
    }

    /**
     *
     * @param {ConnectionWrapper} connectionWrapper instance
     * @return {Game} game instance
     */
    listenConnection(connectionWrapper) {
        const game = this;
        const connection = connectionWrapper.getConnection();

        const unit = game.addUnit({
            id: connectionWrapper.get('user').id
        });

        connectionWrapper.set('unit', unit);

        connection.on('disconnect', () => {
            game.removeConnection(connectionWrapper);
            connectionWrapper.destroy();
        });

        // connection.on('xy');

        console.log('start to listening to connection');

        return game;
    }

    /**
     *
     * @param {object} data about unit
     *      @param {string} data.id - unit's id === user's id
     * @return {Unit} unit instance
     */
    addUnit(data) {
        const game = this;
        const unit = new Unit(data);
        const units = game.get(attr.units);

        units.push(unit);

        console.log('unit created');

        return unit;
    }
}

module.exports = Game;
