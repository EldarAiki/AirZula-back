const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {log} = require('../../middlewares/logger.middleware')
const {getOrderById, getOrders, updateOrder, addOrder,deleteOrder} = require('./order.controller')
const router = express.Router()

router.get('/', getOrders)
router.get('/:id', getOrderById)
router.put('/:id', requireAuth,  updateOrder)
router.post('/', requireAuth,  addOrder)
router.delete('/:id',  requireAuth, deleteOrder)

module.exports = router