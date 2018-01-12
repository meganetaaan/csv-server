const fs = require('fs')
const csv = require('csv')
const iconv = require('iconv-lite')
const zip = require('node-zip')
const modelManager = require('./ModelManager').getModelManager()

const exportCSV = async () => {
  for (let modelName of modelManager.getModelNames()) {
    const Model = modelManager.getModel(modelName)
    try {
      const items = await Model.find().exec()
      for (let item of items) {
      }
    } catch (e) {
      throw e
    }
  }
}
