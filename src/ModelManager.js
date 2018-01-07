const mongoose = require('mongoose')

export default class ModelManager {
  getModelName {

  }
  createSchema(def) {
    if (schemas[modelName] == null) {
      schemas[modelName] = {}
      for (let k of Object.keys(data)) {
        schemas[modelName][k] = {}
      }
    }
  }
}
