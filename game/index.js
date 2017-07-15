const MainModel = require('main-model');
const ConnectionWrapper = require('./connection');
const Unit = require('./unit');

const attr = {
    connections: 'connections',
    units: 'units',
    io: 'io'
};

class Game extends MainModel {
    constructor(data) {
        super(data);

        const game = this;

        game.set(attr.connections, []);
        game.set(attr.units, []);

        game.startEmit();
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
            game.removeUnit(connectionWrapper.get('unit'));
            game.removeConnection(connectionWrapper);
            connectionWrapper.destroy();
        });

        connection.on('xy', data => connectionWrapper.onXY(data));

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

    /**
     *
     * @param {Unit} unit instance
     * @return {Game} game instance
     */
    removeUnit(unit) {
        const game = this;
        const units = game.get(attr.units);
        const unitIndex = units.indexOf(unit);

        if (unitIndex === -1) {
            console.warn('unit was removed: unit is not exist');
            return game;
        }

        units.splice(units.indexOf(unit), 1);

        console.log('units was removed');

        return game;
    }

    /**
     *
     * @return {Game} game instance
     */
    emit() {
        const game = this;
        const units = game.get(attr.units);
        const io = game.get(attr.io);

        io.emit('update', {
            units: units.map(unit => unit.getAllAttributes())
        });

        return game;
    }

    /**
     *
     * @return {Game} game instance
     */
    startEmit() {
        setInterval(() => this.emit(), 10);
    }
}

module.exports = Game;
