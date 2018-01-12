const fs = require('fs')
const csv = require('csv')
const iconv = require('iconv-lite')
const modelManager = require('./ModelManager').getModelManager()
const HeaderInfo = require('./HeaderInfo')
let seq = 0

const inspectType = (v) => {
  // TODO
  return String
}

const createSchemaFromRecord = (record) => {
  const schema = {}
  const headers = []
  for (let [k, v] of Object.entries(record)) {
    const name = k
    const type = inspectType(v)
    schema[name] = type
    const header = {
      name,
      typeName: type.toString() // TODO: can be convert back?
    }
    headers.push(header)
  }
  if (schema.id == null) {
    schema.id = {
      type: String,
      unique: true
    }
  }
  return {
    schema,
    headers
  }
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
          const {schema, headers} = createSchemaFromRecord(data)

          // TODO: could be done by modelManager?
          const headerInfo = new HeaderInfo({
            name: modelName,
            props: headers
          })
          headerInfo.save()
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
