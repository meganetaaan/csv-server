const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CSVMetadata = require('./CSVMetadata')

mongoose.connect('mongodb://localhost/test', { useMongoClient: true })
let modelManager

class ModelManager {
  static getModelManager () {
    if (modelManager == null) {
      modelManager = new ModelManager()
    }
    return modelManager
  }
  async init () {
    const metadatas = await CSVMetadata.find().exec()
    console.debug('init: ' + JSON.stringify(metadatas, null, 2))
    for (let md of metadatas) {
      const schemaDef = {}
      md.headers.map(h => {
        schemaDef[h.name] = String
      })
      schemaDef.id = String
    }
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
  async saveCSVMetadata (modelName, headers) {
    // TODO: could be done by modelManager?
    console.debug(`saving: ${modelName}`)
    return CSVMetadata.findOneAndUpdate({
      name: modelName
    }, {
      name: modelName,
      props: headers
    }, {
      upsert: true,
      new: true
    })
  }
  async findCSVMetadata (modelName) {
    return CSVMetadata.find({
      name: modelName
    }).exec()
  }
}

(async () => {
  await ModelManager.getModelManager().init()
})()

module.exports = ModelManager
