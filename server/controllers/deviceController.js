const Device = require('../models/Device');

exports.getAllDevices = async (req, res) => {
  try {
    const devices = await Device.find().populate('assignedTo');
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addDevice = async (req, res) => {
  try {
    const device = new Device(req.body);
    const savedDevice = await device.save();
    res.status(201).json(savedDevice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateDevice = async (req, res) => {
  try {
    const device = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(device);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteDevice = async (req, res) => {
  try {
    await Device.findByIdAndDelete(req.params.id);
    res.json({ message: 'Device deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};