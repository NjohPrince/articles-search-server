import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

import { SearchType, SearchValidationSchema } from '../models/search.model'
import searchService from '../services/search.service'

interface CustomRequest extends Request {
  clientIP?: string
}

class SearchController {
  captureIPAddress = (req: CustomRequest, res: Response, next: NextFunction) => {
    req.clientIP = Array.isArray(req.headers['x-forwarded-for'])
      ? req.headers['x-forwarded-for'][0]
      : req.headers['x-forwarded-for'] || req.socket.remoteAddress
    next()
  }

  async saveSearch(req: CustomRequest, res: Response): Promise<void> {
    try {
      const search = req.body as SearchType
      const clientIP = req.clientIP || ''

      SearchValidationSchema.parse({ search, clientIP })

      const existingSearch = await searchService.getSearchByName(search.search)

      if (existingSearch) {
        res.status(409).json({ message: 'Already saved!' })
        return
      }

      const newSearch = await searchService.saveSearch({ search: search.search, clientIP })
      res.status(201).json(newSearch)
    } catch (error) {
      console.error('Error saving search: ', error)

      if (error instanceof z.ZodError) {
        const firstError = error.errors[0]

        if (firstError) {
          const errorDetails = {
            field: firstError.path.join('.'),
            message: firstError.message,
          }

          res.status(400).json({
            error: 'Validation error',
            message: errorDetails.message,
            field: errorDetails.field,
          })
        } else {
          res.status(400).json({ error: 'Validation error', message: 'Unknown validation error' })
        }
      } else {
        res.status(500).json({ message: 'Internal server error' })
      }
    }
  }

  async getAllSearches(req: CustomRequest, res: Response): Promise<void> {
    const clientIP = req.clientIP || ''

    try {
      const searches = await searchService.getAllSearches(clientIP)
      res.status(200).json(searches)
    } catch (error) {
      console.error('Error getting searches: ', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export default new SearchController()
