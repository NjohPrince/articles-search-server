import express from 'express'

import searchController from '../controllers/search.controller'

const router = express.Router()

router.post('/searches', searchController.captureIPAddress, searchController.saveSearch)
router.get('/searches', searchController.getAllSearches)

export default router
