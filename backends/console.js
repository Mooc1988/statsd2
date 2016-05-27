/*jshint node:true, laxcomma:true */

var util = require('util');

function ConsoleBackend(stats, config) {
    var self = this;
    this.lastFlush = stats.startupTime;
    this.lastException = stats.startupTime;
    this.config = config.console || {};

    // attach
    stats.on('flush_to_backend', function (metrics) {
        self.flush(new Date().getTime(), metrics);
    });
}

ConsoleBackend.prototype.flush = function (timestamp, metrics) {
    console.log('Flushing stats at ', new Date(timestamp * 1000).toString());
    console.log(`Process time is ${metrics.processing_time} ms`);
    var out = {
        counters: metrics.counters,
        timers: metrics.timers,
        gauges: metrics.gauges,
        timer_data: metrics.timer_data,
        counter_rates: metrics.counter_rates,
        sets: metrics.sets
    };

    if (this.config.prettyprint) {
        console.log(util.inspect(out, {depth: 5, colors: true}));
    } else {
        console.log(out);
    }
};

ConsoleBackend.prototype.status = function (write) {
    ['lastFlush', 'lastException'].forEach(function (key) {
        write(null, 'console', key, this[key]);
    }, this);
};

exports.init = function (events, config) {
    new ConsoleBackend(events, config);
    return true;
};
