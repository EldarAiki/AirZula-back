const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const authService = require('../auth/auth.service')
// const socketService = require('../../services/socket.service')
const stayService = require('./stay.service')

async function getStays(req, res) {
    try {
        const stays = await stayService.query(req.query)
        res.send(stays)
    } catch (err) {
        logger.error('Cannot get stays', err)
        res.status(500).send({ err: 'Failed to get stays' })
    }
}

async function getStayById(req, res) {
    try {
      const stayId = req.params.id;
      const stay = await stayService.getById(stayId)
      res.json(stay)
    } catch (err) {
      logger.error('Failed to get stay', err)
      res.status(500).send({ err: 'Failed to get stay' })
    }
  }

async function deleteStay(req, res) {
    
    try {
        const deletedCount = await stayService.remove(req.params.id)
        console.log(req.params.id);
        if (deletedCount === 1) {
            res.send({ msg: 'Deleted successfully' })
        } else {
            res.status(400).send({ err: 'Cannot remove stay' })
        }
    } catch (err) {
        logger.error('Failed to delete stay', err)
        res.status(500).send({ err: 'Failed to delete stay' })
    }
}


async function addStay(req, res) {

    console.log('got to controller');
    // var loggedinUser = authService.validateToken(req.cookies.loginToken)
    try {
        var stay = req.body
        // stay.byUserId = loggedinUser._id
        stay = await stayService.add(stay)
        
        // prepare the updated stay for sending out
        // stay.aboutUser = await userService.getById(stay.aboutUserId)

        // loggedinUser = await userService.update(loggedinUser)
        // stay.byUser = loggedinUser

        // User info is saved also in the login-token, update it
        // const loginToken = authService.getLoginToken(loggedinUser)
        // res.cookie('loginToken', loginToken)

        res.send(stay)

    } catch (err) {
        console.log(err)
        logger.error('Failed to add stay', err)
        res.status(500).send({ err: 'Failed to add stay' })
    }
}

async function updateStay(req, res) {

    var loggedinUser = authService.validateToken(req.cookies.loginToken)
 
    try {
        var stay = req.body
        stay.byUserId = loggedinUser._id
        stay = await stayService.update(stay)
        
        // prepare the updated stay for sending out
        stay.aboutUser = await userService.getById(stay.aboutUserId)

        loggedinUser = await userService.update(loggedinUser)
        stay.byUser = loggedinUser

        // User info is saved also in the login-token, update it
        const loginToken = authService.getLoginToken(loggedinUser)
        res.cookie('loginToken', loginToken)

        res.send(stay)

    } catch (err) {
        console.log(err)
        logger.error('Failed to update stay', err)
        res.status(500).send({ err: 'Failed to update stay' })
    }
}

module.exports = {
    getStays,
    getStayById,
    deleteStay,
    updateStay,
    addStay
}