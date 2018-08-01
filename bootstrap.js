/**
 * Created by frank on 16/5/26.
 */

const Stats = require('./Stats')
const stats = new Stats()
stats.start()

process.on('exit', function () {
  console.log(stats.getStatus())
  stats.stop()
})