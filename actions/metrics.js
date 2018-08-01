/**
 * Created by frank on 16/5/26.
 */
'use strict'
const createAction = require('redux-actions').createAction

const COUNTERS = 'counters'
const COUNTERS_RATE = 'counters_rate'
const TIMERS = 'timers'
const TIMERS_AGGREGATION = 'timers_aggregation'
const SETS = 'sets'
const GAUGES = 'gauges'
const CLEAR = 'clear'

module.exports = {

  COUNTERS, COUNTERS_RATE,
  TIMERS, TIMERS_AGGREGATION,
  SETS,
  GAUGES,
  CLEAR,
  processCount: (key, fields) => {
    return createAction(COUNTERS)({key, fields})
  },

  processCountersRate: (counters) => {
    return createAction(COUNTERS_RATE)({counters})
  },

  processTimers: (key, fields) => {
    return createAction(TIMERS)({key, fields})
  },

  processTimersAggregation: (timers, timer_counters) => {
    return createAction(TIMERS_AGGREGATION)({timers, timer_counters})
  },

  processSet: (key, fields) => {
    return createAction(SETS)({key, fields})
  },

  processGauges: (key, fields) => {
    return createAction(GAUGES)({key, fields})
  },

  processClear: () => {
    return createAction(CLEAR)()
  }
}


