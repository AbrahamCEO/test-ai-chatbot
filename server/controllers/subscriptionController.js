const Subscription = require('../models/Subscription');

exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addSubscription = async (req, res) => {
  try {
    const subscription = new Subscription(req.body);
    const savedSubscription = await subscription.save();
    res.status(201).json(savedSubscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(subscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteSubscription = async (req, res) => {
  try {
    await Subscription.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};