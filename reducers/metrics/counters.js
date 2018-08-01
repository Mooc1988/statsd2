/**
 * Created by frank on 16/5/26.
 */

const IMap = require('immutable').Map
const config = require('../../config')
const helpers = require('../../core/helpers')
const {COUNTERS, COUNTERS_RATE, CLEAR} = require('../../actions/metrics')

module.exports = {

  counters: function (state = IMap(), action) {
    switch (action.type) {
      case COUNTERS:
        let {key, fields} = action.payload
        let sampleRate = helpers.getSampleRate(fields)
        let value = Number(fields[0] || 1) * (1 / sampleRate)
        return state.update(key, 0, v => v + value)
      case CLEAR:
        return IMap()
      default:
        return state
    }
  },

  countersRate: function (state = IMap(), action) {
    switch (action.type) {
      case COUNTERS_RATE:
        let {counters} = action.payload
        // 计算每秒的counter值
        let interval = config.flushInterval / 1000
        if (counters && counters.map) {
          return counters.map(c => c / interval)
        }
        return state
      case CLEAR:
        return IMap()
      default:
        return state
    }
  }
}




