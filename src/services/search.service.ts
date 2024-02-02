import { SearchModel, SearchType, SearchValidationSchema } from '../models/search.model'

class SearchService {
  async saveSearch(search: SearchType): Promise<SearchType> {
    try {
      const validatedSearch = SearchValidationSchema.parse(search)
      const newSearch = new SearchModel(validatedSearch)
      await newSearch.save()

      return newSearch.toObject()
    } catch (error) {
      console.error('Error saving search: ', error)
      throw new Error('Invalid search data')
    }
  }

  async getAllSearches(clientIP: string): Promise<SearchType[]> {
    return SearchModel.find({ clientIP }).lean()
  }

  async getSearchByName(search: string) {
    return SearchModel.findOne({ search })
  }
}

export default new SearchService()
