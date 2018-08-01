/**
 * Created by frank on 16/5/26.
 */

const IMap = require('immutable').Map
const math = require('mathjs')
const helpers = require('../../core/helpers')
const config = require('../../config')
const {TIMERS, TIMERS_AGGREGATION, CLEAR} = require('../../actions/metrics')

module.exports = {

  timers: function (state = IMap(), action) {
    switch (action.type) {
      case TIMERS:
        let {key, fields} = action.payload
        let value = Number(fields[0])
        return state.update(key, [], v => [...v, value])
      case CLEAR:
        return IMap()
      default:
        return state
    }
  },

  timerCounters: function (state = IMap(), action) {
    switch (action.type) {
      case TIMERS:
        let {key, fields} = action.payload
        let sampleRate = helpers.getSampleRate(fields)
        let value = 1 / sampleRate
        return state.update(key, 0, v => v + value)
      case CLEAR:
        return IMap()
      default:
        return state
    }
  },

  timerAggregation: function (state = null, action) {
    switch (action.type) {
      case TIMERS_AGGREGATION:
        let {timers, timer_counters} = action.payload
        if (timers && timers.map) {
          let interval = config.flushInterval / 1000
          return timers.map(function (timer, key) {
            let currentTimerData = executeAggregation(timer)
            let counter = timer_counters.get(key)
            currentTimerData['count'] = counter
            currentTimerData['count_ps'] = counter / interval
            return currentTimerData
          })
        }
        return state
      case CLEAR:
        return null
      default:
        return state
    }
  }
}

function executeAggregation (timer) {
  let timerData = {}
  if (timer.length === 0) {
    timerData['count'] = timerData['count_ps'] = 0
    return timerData
  }
  let values = math.sort(timer)
  let count = values.length
  let min = values[0]
  let max = values[count - 1]
  let cumulativeValues = [min]
  let cumulSumSquaresValues = [min * min]
  for (let i = 1; i < count; i++) {
    let value = values[i]
    cumulativeValues.push(value + cumulativeValues[i - 1])
    cumulSumSquaresValues.push((value * value) + cumulSumSquaresValues[i - 1])
  }
  let sum = min
  let sumSquares = min * min
  let mean = min
  let thresholdBoundary = max
  let percentThresholds = config.percentThresholds || [90]
  for (let pct of percentThresholds) {
    let numInThreshold = count
    if (count > 1) {
      numInThreshold = Math.round(Math.abs(pct) / 100 * count)
      if (numInThreshold === 0) {
        continue
      }
      if (pct > 0) {
        thresholdBoundary = values[numInThreshold - 1]
        sum = cumulativeValues[numInThreshold - 1]
        sumSquares = cumulSumSquaresValues[numInThreshold - 1]
      } else {
        thresholdBoundary = values[count - numInThreshold]
        sum = cumulativeValues[count - 1] - cumulativeValues[count - numInThreshold - 1]
        sumSquares = cumulSumSquaresValues[count - 1] - cumulSumSquaresValues[count - numInThreshold - 1]
      }
      mean = sum / numInThreshold
    }
    let clean_pct = '' + pct
    clean_pct = clean_pct.replace('.', '_').replace('-', 'top')
    timerData['count_' + clean_pct] = numInThreshold
    timerData['mean_' + clean_pct] = mean
    timerData[(pct > 0 ? 'upper_' : 'lower_') + clean_pct] = thresholdBoundary
    timerData['sum_' + clean_pct] = sum
    timerData['sum_squares_' + clean_pct] = sumSquares
  }
  sum = cumulativeValues[count - 1]
  timerData['std'] = math.std(values)
  timerData['upper'] = max
  timerData['lower'] = min
  timerData['sum'] = sum
  timerData['sum_squares'] = cumulSumSquaresValues[count - 1]
  timerData['mean'] = sum / count
  timerData['median'] = math.median(values)
  return timerData
}


