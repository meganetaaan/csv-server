const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/test')

module.exports = class ModelManager {
  constructor () {
    this.models = new Map()
  }
  getModelNames () {
    return this.models.keys()
  }
  createModel (name, schemaDef) {
    const schema = new Schema(schemaDef)
    const model = mongoose.model(name, schema)
    this.models.set(name, model)
    return model
  }
  getModel (name) {
    return this.models.get(name)
  }
}
