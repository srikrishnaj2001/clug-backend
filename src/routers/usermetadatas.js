const express = require('express');
const router = express.Router();
const service = require('../services/usermetadatas');
const { sendResponse } = require('../utils/helpers');

router.get('/', async (req, res) => {
  const result = await service.findAll();
  return sendResponse(res, result);
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid id' });
  }
  const result = await service.findOne(id);
  return sendResponse(res, result);
});

module.exports = router; 