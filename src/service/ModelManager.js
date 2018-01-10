const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/test')
let modelManager

module.exports = class ModelManager {
  constructor () {
    this.models = new Map()
  }
  static getModelManager () {
    if (modelManager == null) {
      modelManager = new ModelManager()
    }
    return modelManager
  }
  getModelNames () {
    return this.models.keys()
  }
  createModel (name, schemaDef) {
    const schema = new Schema(schemaDef)
    const model = mongoose.model(name, schema)
    // TODO: persist schemas using mongo
    this.models.set(name, model)
    return model
  }
  getModel (name) {
    return this.models.get(name)
  }
}
