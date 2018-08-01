/**
 * Created by frank on 16/5/26.
 */

const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}

module.exports = logger

