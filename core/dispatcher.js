/**
 * Created by frank on 16/5/25.
 */

'use strict';
const _ = require('lodash');
const helpers = require('./helpers');
const {metricsReceived, packetReceived, badLinesReceived}= require('../actions/status');
const {
    processTimers, processGauges, processSet, processCount,
    processCountersRate, processTimersAggregation, processClear
} = require('../actions/metrics');

module.exports = (stats) => {
    let store = stats.store;

    stats.on('package_received', function () {
        store.dispatch(packetReceived());
    });

    stats.on('metrics_received', function (msg) {
        store.dispatch(metricsReceived());
        let bits = msg.split(':');
        let key = bits.shift();
        if (bits.length === 0) {
            return store.dispatch(metricsReceived(msg));
        }
        _.each(bits, function dispatch(bit) {
            let fields = String(bit).split("|");
            if (!helpers.isValidPacket(fields)) {
                return store.dispatch(badLinesReceived(bit));
            }
            let metricType = fields[1].trim();
            let action;
            switch (metricType) {
                case 'ms':
                    action = processTimers(key, fields);
                    break;
                case 'g':
                    action = processGauges(key, fields);
                    break;
                case 's':
                    action = processSet(key, fields);
                    break;
                default:
                    action = processCount(key, fields);
            }
            store.dispatch(action);
        });
    });

    stats.on('flush', function () {
        let metrics = store.getState().metrics || {};
        let startTime = Date.now();
        store.dispatch(processCountersRate(metrics.counters));
        store.dispatch(processTimersAggregation(metrics.timers, metrics.timer_counters));
        metrics = store.getState().metrics;
        store.dispatch(processClear());
        metrics['processing_time'] = Date.now() - startTime; //记录数据处理时间
        stats.emit('flush_to_backend', metrics);
    });
};