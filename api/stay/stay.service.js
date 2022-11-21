add
const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
// const reviewService = require('../review/review.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    remove,
    update,
    add
}

async function query(filterBy = {}) {

    const criteria = _buildCriteria(filterBy)
    try {
        const  collection = await dbService.getCollection('stay')
        let stays = await collection.find(criteria).toArray()
        // let stays = await collection.find({}).toArray()
        // let stays = collection.toArray()
        return stays
    } catch (err) {
        logger.error('cannot find stays', err)
        throw err
    }
}

async function getById(stayId) {
    try {
        const collection = await dbService.getCollection('stay')
        const stay =  collection.findOne({ "_id": ObjectId(stayId) })
        return stay
    } catch (err) {
        logger.error(`while finding stay ${stayId}`, err)
        throw err
    }
}

async function remove(stayId) {
    try {
        const collection = await dbService.getCollection('stay')
        await collection.deleteOne({ '_id': ObjectId(stayId) })
        return stayId
    } catch (err) {
        logger.error(`cannot remove stay ${stayId}`, err)
        throw err
    }
}

async function update(stay) {
    try {
        var id = ObjectId(stay._id)
        delete stay._id
        const collection = await dbService.getCollection('stay')
        await collection.updateOne({ _id: id }, { $set: { ...stay } })
        return stay
    } catch (err) {
        logger.error(`cannot update stay ${stayId}`, err)
        throw err
    }
}

async function add(stay) {
    console.log('got to add' , stay.name);
    try {
        const collection = await dbService.getCollection('stay')
        const addedStay = await collection.insertOne(stay)
        return addedStay
    } catch (err) {
        logger.error('cannot insert stay', err)
        throw err
    }
}


function _buildCriteria(queryParams) {
   
    const filterBy = {
        location: queryParams.location || '',
    }
 

    const criteria = {}
    if (filterBy.location) {
        const txtCriteria = { $regex: filterBy.location, $options: 'i' }
        criteria.$or = [
            {
                name: txtCriteria,
            },
            {
                description: txtCriteria,
            },
        ]
    }
    return criteria
}



