'use strict';

const IMap = require('immutable').Map;
const status = require('../../actions/status');
const {
    PACKET_RECEIVED, METRICS_RECEIVED, BAD_LINES_RECEIVED,
    METRICS_FLUSHED_SUCCESS, METRICS_FLUSHED_FAILED
} = status;

module.exports = function recordStatus(state = IMap(), action) {
    let {type} = action;
    switch (type) {
        case PACKET_RECEIVED:
        case METRICS_RECEIVED:
        case BAD_LINES_RECEIVED:
        case METRICS_FLUSHED_SUCCESS:
        case METRICS_FLUSHED_FAILED:
            return state.update(type, 0, v => v + 1);
        default:
            return state;
    }
};

