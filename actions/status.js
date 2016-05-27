/**
 * Created by frank on 16/5/26.
 */
'use strict';

/**
 * 系统监控相关actions
 */
const {createAction} =require('redux-actions');

const PACKET_RECEIVED = 'packet_received';

const METRICS_RECEIVED = 'metrics_received';

const BAD_LINES_RECEIVED = 'bad_lines_received';

const METRICS_FLUSHED_SUCCESS = 'metrics_flushed_success';

const METRICS_FLUSHED_FAILED = 'metrics_flushed_failed';

module.exports = {

    PACKET_RECEIVED, METRICS_RECEIVED, BAD_LINES_RECEIVED,
    METRICS_FLUSHED_SUCCESS, METRICS_FLUSHED_FAILED,

    packetReceived: ()=> {
        return createAction(PACKET_RECEIVED)();
    },

    metricsReceived: ()=> {
        return createAction(METRICS_RECEIVED)();
    },

    badLinesReceived: (received)=> {
        return createAction(BAD_LINES_RECEIVED)(received);
    }
};




