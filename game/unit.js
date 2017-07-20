const MainModel = require('main-model');
const gameData = require('./data.json');

class Unit extends MainModel {
    constructor(data) {
        super(data);

        const unit = this;

        unit.bindListening();
    }

    bindListening() {
        const unit = this;
        const maxX = gameData.sea.width;
        const maxY = gameData.sea.height;
        const minX = 0;
        const minY = 0;

        unit.onChange('x', x => x > maxX && unit.set('x', maxX) || x < minX && unit.set('x', minX));
        unit.onChange('y', y => y > maxY && unit.set('y', maxY) || y < minY && unit.set('y', minY));
    }
}

module.exports = Unit;
