const mongoose = require('mongoose')
const HeaderInfo = mongoose.model('Schema', {
  name: String,
  props: [{
    name: String,
    typeNmae: String
  }]
})

module.exports = HeaderInfo
