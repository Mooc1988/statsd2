/**
 * Created by frank on 16/5/25.
 */

'use strict';

const _ = require('lodash');
const {EventEmitter} = require('events');
const {createStore, applyMiddleware} =require('redux');
const config = require('./config');
const servers = require('./servers');
const rootReducer = require('./reducers');
const loadDispatcher = require('./core/dispatcher');
const loggerMid = require('./middleware/logger');

class Stats extends EventEmitter {

    constructor() {
        super();
        this.startTime = new Date().getTime();
        //debug模式下,开启日志中间件
        if (config.debug) {
            let createStoreWithMiddleWare = applyMiddleware(loggerMid)(createStore);
            this.store = createStoreWithMiddleWare(rootReducer);
        } else {
            this.store = createStore(rootReducer);
        }
    }

    start() {
        loadDispatcher(this);
        loadBackend(this);
        let serverConfigs = config.servers;
        _.each(serverConfigs, serverConfig => {
            let {mode, port} = serverConfig;
            let server = servers[mode];
            if (!server) {
                return console.error(`server ${mode} not supported`);
            }
            let handler = this._packetHandler.bind(this);
            server.start(serverConfig, handler);
            console.log(`server [${mode}] started`);
            console.log(`listen port: ${port}`);
        });
        setTimeout(this._flushEvent.bind(this), this._getFlushTimeout());
    }


    stop() {
        if (this.unSubcribe) {
            this.unSubcribe();
        }
        this.emit('flush');
        console.warn('stats stopped !!');
    }

    //获取当前系统状态
    getStatus() {
        let state = this.store.getState();
        return state.status;
    }


    //获取下次flush时间
    _getFlushTimeout() {
        let flushInterval = config.flushInterval || 10000;
        return flushInterval - (new Date().getTime() - this.startTime) % flushInterval;
    }

    //处理udp or tcp 数据
    _packetHandler(msg, info) {
        let metrics = msg.toString();
        if (metrics.indexOf("\n") > -1) {
            metrics = metrics.split("\n");
        } else {
            metrics = [metrics];
        }
        this.emit('package_received');
        _.each(metrics, (metric) => {
            if (metric.length > 0) {
                this.emit('metrics_received', metric);
            }
        });
    }

    _flushEvent() {
        this.emit('flush');
        let self = this._flushEvent.bind(this);
        setTimeout(self, this._getFlushTimeout());
    }
}

function loadBackend(stats) {
    let backend = config.backend;
    if (!_.isArray(backend)) {
        backend = [backend];
    }
    _.each(backend, (b) => {
        require(`./backends/${b}`).init(stats, config);
    });
}

module.exports = Stats;