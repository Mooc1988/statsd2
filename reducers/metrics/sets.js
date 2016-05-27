/**
 * Created by frank on 16/5/26.
 */

const immutable = require('immutable');
const {SETS, CLEAR} = require('../../actions/metrics');
const IMap = immutable.Map;
const ISet = immutable.Set;

module.exports = function sets(state = IMap(), action) {
    switch (action.type) {
        case SETS:
            let {key, fields} = action.payload;
            let value = fields[0];
            return state.update(key, ISet(), v => v.add(value));
        case CLEAR:
            return IMap();
        default:
            return state;
    }
};

