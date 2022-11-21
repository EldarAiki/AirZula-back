const MongoClient = require('mongodb').MongoClient

// const uri = 'mongodb+srv://Eldar01airzula:yaron1111camar@cluster0.zi0mauo.mongodb.net/?retryWrites=true&w=majority'

// const client = new MongoClient(uri, {useNewUrlParser: true})
// client.connect (err => {
//     console.log('connected to mongo')
//     const collection = client.db('arizula_db').collection('stay')
//     collection.find().toArray()
//         .then(res =>  console.log(res))
//     client.close() 
// })




const config = require('../config')

module.exports = {
    getCollection
}

// Database Name
const dbName = 'airzula_db'

var dbConn = null

async function getCollection(collectionName) {
    try {
        const db = await connect()
        const collection = await db.collection(collectionName)
        return collection
    } catch (err) {
        logger.error('Failed to get Mongo collection', err)
        throw err
    }
}

async function connect() {
    if (dbConn) return dbConn
    try {
        const client = await MongoClient.connect(config.dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
        const db = client.db(dbName)
        dbConn = db
        return db
    } catch (err) {
        logger.error('Cannot Connect to DB', err)
        throw err
    }
}




