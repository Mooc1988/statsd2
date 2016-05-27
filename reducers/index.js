const {combineReducers} = require('redux');
const metrics = require('./metrics');
const status = require('./status');

const rootReducer = combineReducers({
    metrics,
    status
});

module.exports = rootReducer;

