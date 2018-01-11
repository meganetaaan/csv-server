const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/test')
let modelManager

module.exports = class ModelManager {
  constructor () {
    this._init()
  }
  static getModelManager () {
    if (modelManager == null) {
      modelManager = new ModelManager()
    }
    return modelManager
  }
  _init () {
    // TODO: read schemas from mongo and create Models
    /*
    {
      modelName: 'User',
      properties: [
        {
          name: ''
          typeName: ''
        }
      ]
    }
    */
  }
  getModelNames () {
    return mongoose.modelNames()
  }
  createModel (name, schemaDef) {
    const schema = new Schema(schemaDef)
    const model = mongoose.model(name, schema)
    return model
  }
  getModel (name) {
    if (mongoose.modelNames().includes(name)) {
      return mongoose.model(name)
    }
    return null
  }
}
