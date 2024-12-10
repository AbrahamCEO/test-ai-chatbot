const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const employeeController = require('../controllers/employeeController');
const subscriptionController = require('../controllers/subscriptionController');

// Device routes
router.get('/devices', deviceController.getAllDevices);
router.post('/devices', deviceController.addDevice);
router.put('/devices/:id', deviceController.updateDevice);
router.delete('/devices/:id', deviceController.deleteDevice);

// Employee routes
router.get('/employees', employeeController.getAllEmployees);
router.post('/employees', employeeController.addEmployee);
router.put('/employees/:id', employeeController.updateEmployee);
router.delete('/employees/:id', employeeController.deleteEmployee);

// Subscription routes
router.get('/subscriptions', subscriptionController.getAllSubscriptions);
router.post('/subscriptions', subscriptionController.addSubscription);
router.put('/subscriptions/:id', subscriptionController.updateSubscription);
router.delete('/subscriptions/:id', subscriptionController.deleteSubscription);

module.exports = router;