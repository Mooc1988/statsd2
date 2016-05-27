/**
 * Created by frank on 16/5/26.
 */
const {combineReducers} = require('redux');
const counters = require('./counters');
const timers = require('./timers');
const sets = require('./sets');
const gauges = require('./guages');

module.exports = combineReducers({
    'counters': counters.counters,
    'counter_rates': counters.countersRate,
    'timers': timers.timers,
    'timer_counters': timers.timerCounters,
    'timer_data': timers.timerAggregation,
    'gauges': gauges,
    'sets': sets
});

