const express = require('express');
const router = express.Router();
const childrenController = require('../controllers/childrenController');
const requireAuth = require('../middleware/requireAuth');

// Public: list children
router.get('/', childrenController.getChildren);

// Admin: create child
router.post('/', requireAuth, childrenController.createChild);

// Admin: update child
router.put('/:id', requireAuth, childrenController.updateChild);

// Admin: delete child
router.delete('/:id', requireAuth, childrenController.deleteChild);

module.exports = router;
