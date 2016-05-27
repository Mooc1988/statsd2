'use strict';

const IMap = require('immutable').Map;
const {GAUGES, CLEAR} = require('../../actions/metrics');

module.exports = (state = IMap(), action) => {

    switch (action.type) {
        case GAUGES:
            let {key, fields} = action.payload;
            let isAccumulate = fields[0].match(/^[-+]/);
            let value = Number(fields[0]) || 0;
            if (isAccumulate) {
                return state.update(key, 0, v => v + value);
            } else {
                return state.update(key, 0, v => value);
            }
        case CLEAR:
            return IMap();
        default:
            return state;
    }
};

