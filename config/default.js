/**
 * Created by frank on 16/5/25.
 */
//默认配置
module.exports = {

    //应用名称
    name: 'stats',

    //是否记录所有接收的信息
    logMessage: false,

    //向后台刷新频率,单位为ms
    flushInterval: 10000,

    //数据接收后台
    backend: 'console',

    histogram: [],

    percentThreshold: [90],

    servers: [{
        mode: 'udp',  // only support udp or tcp
        port: 8125
    }]
};

