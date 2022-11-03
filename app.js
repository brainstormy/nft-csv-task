const fs = require('fs')
const crypto = require('crypto')
const csvToJson = require('csvtojson')
const csvjson = require('csvjson');
const csvFilePath = './csv/CSVFILE.csv'
const outputFilePath = './output.csv'

let cleanData = []


//convert spreadsheet csv to json
csvToJson()
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    const hashData = jsonObj.map(x => {
      //generate sha256 hash
      const hash = crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex')
      x["hash"] = hash
      return x
    })

    // delete spreadsheet heading
    hashData.splice(0, 1)
    // remove empty objects && team titles
    hashData.map((objData) => {
      if (objData["Series Number"] || objData["Series Number"].includes('Team')) {
        (objData["Series Number"] || objData["Serial Number"]).toString().trim()
        cleanData.push(objData)
      }
    })

    //convert json to csv
    const csv = csvjson.toCSV(cleanData)
    // output csv file
    fs.writeFileSync('output.csv', csv, "utf-8")

    //  output json
    csvToJson()
      .fromFile(outputFilePath).then((jsonObj) => {
        fs.writeFileSync('output.json', JSON.stringify(jsonObj), "utf-8")
      })


  })











