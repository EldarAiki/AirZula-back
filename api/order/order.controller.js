const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const authService = require('../auth/auth.service')
// const socketService = require('../../services/socket.service')
const orderService = require('./order.service')

async function getOrders(req, res) {
    try {
        const orders = await orderService.query(req.query)
        res.send(orders)
    } catch (err) {
        logger.error('Cannot get orders', err)
        res.status(500).send({ err: 'Failed to get orders' })
    }
}

async function getOrderById(req, res) {
    try {
      const orderId = req.params.id;
      const order = await orderService.getById(orderId)
      res.json(order)
    } catch (err) {
      logger.error('Failed to get order', err)
      res.status(500).send({ err: 'Failed to get order' })
    }
  }

async function deleteOrder(req, res) {
    
    try {
        const deletedCount = await deleteService.remove(req.params.id)
        console.log(req.params.id);
        if (deletedCount === 1) {
            res.send({ msg: 'Deleted successfully' })
        } else {
            res.status(400).send({ err: 'Cannot remove delete' })
        }
    } catch (err) {
        logger.error('Failed to delete delete', err)
        res.status(500).send({ err: 'Failed to delete delete' })
    }
}


async function addOrder(req, res) {

    var loggedinUser = authService.validateToken(req.cookies.loginToken)
    console.log(loggedinUser)
    try {
        var order = req.body
        order.byUserId = loggedinUser._id
        order = await orderService.add(order)
        
        // prepare the updated order for sending out
        order.aboutUser = await userService.getById(order.aboutUserId)

        loggedinUser = await userService.update(loggedinUser)
        order.byUser = loggedinUser

        // User info is saved also in the login-token, update it
        const loginToken = authService.getLoginToken(loggedinUser)
        res.cookie('loginToken', loginToken)

        res.send(order)

    } catch (err) {
        console.log(err)
        logger.error('Failed to add order', err)
        res.status(500).send({ err: 'Failed to add order' })
    }
}

async function updateOrder(req, res) {

    var loggedinUser = authService.validateToken(req.cookies.loginToken)
 
    try {
        var order = req.body
        order.byUserId = loggedinUser._id
        order = await orderService.update(order)
        
        // prepare the updated order for sending out
        order.aboutUser = await userService.getById(order.aboutUserId)

        loggedinUser = await userService.update(loggedinUser)
        order.byUser = loggedinUser

        // User info is saved also in the login-token, update it
        const loginToken = authService.getLoginToken(loggedinUser)
        res.cookie('loginToken', loginToken)

        res.send(order)

    } catch (err) {
        console.log(err)
        logger.error('Failed to update order', err)
        res.status(500).send({ err: 'Failed to update order' })
    }
}

module.exports = {
    getOrders,
    getOrderById,
    deleteOrder,
    updateOrder,
    addOrder
}