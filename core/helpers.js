/**
 * Created by frank on 16/5/25.
 */

module.exports = {

  isValidPacket: function (fields) {
    // test for existing metrics type
    if (fields[1] === undefined) {
      return false
    }
    if (fields[2] !== undefined) {
      if (!isValidSampleRate(fields[2])) {
        return false
      }
    }
    switch (fields[1]) {
      case 's':
        return true
      case 'g':
        return isNumber(fields[0])
      case 'ms':
        return isNumber(fields[0]) && Number(fields[0]) >= 0
      default:
        return isNumber(fields[0])
    }
  },

  getSampleRate: function (fields) {
    let sampleRate = 1
    if (fields[2]) {
      sampleRate = Number(fields[2].match(/^@([\d\.]+)/)[1])
    }
    return sampleRate
  }

}

function isNumber (str) {
  return Boolean(str && !isNaN(str))
}

function isValidSampleRate (str) {
  var validSampleRate = false
  if (str.length > 1 && str[0] === '@') {
    var numberStr = str.substring(1)
    validSampleRate = isNumber(numberStr) && numberStr[0] != '-'
  }
  return validSampleRate
}

