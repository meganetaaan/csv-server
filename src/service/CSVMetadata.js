const mongoose = require('mongoose')
const CSVMetadata = mongoose.model('CSVMetadata', {
  name: String,
  encoding: String,
  headers: [{
    name: String,
    typeNmae: String
  }]
})

module.exports = CSVMetadata
