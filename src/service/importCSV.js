const fs = require('fs')
const csv = require('csv')
const iconv = require('iconv-lite')
const modelManager = require('./ModelManager').getModelManager()
let seq = 0

const inspectType = (v) => {
  // TODO
  return String
}

const createSchemaFromRecord = (record) => {
  const schema = {}
  for (let [k, v] of Object.entries(record)) {
    schema[k] = inspectType(v)
  }
  if (schema.id == null) {
    schema.id = {
      type: String,
      unique: true
    }
  }
  return schema
}

const importCSVFromModelName = async modelName => {
  const path = `./src/sample/${modelName}.csv`
  return importCSV(modelName, path)
}
const importCSV = async (modelName, file) => {
  const readableStream = fs.createReadStream(file)
  return new Promise((resolve, reject) => {
    const parser = csv.parse({ columns: true })
    readableStream.pipe(iconv.decodeStream('SJIS'))
      .pipe(iconv.encodeStream('UTF-8'))
      .pipe(parser)
    parser.on('readable', () => {
      while (true) {
        let data = parser.read()
        if (data == null) {
          break
        }
        const id = data.id ? data.id : seq++
        let Model = modelManager.getModel(modelName)
        if (Model == null) {
          const schema = createSchemaFromRecord(data)
          Model = modelManager.createModel(modelName, schema)
        }
        const item = new Model(data)
        item.id = id
        item.save()
      }
    })
    parser.on('end', () => {
      resolve()
    })
  })
}

module.exports = {
  importCSVFromModelName,
  importCSV
}
