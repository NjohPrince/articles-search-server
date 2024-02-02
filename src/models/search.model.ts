import mongoose, { Document, Schema } from 'mongoose'
import { z } from 'zod'

const SearchValidationSchema = z.object({
  search: z.string().min(2, { message: 'Search must be at least 2 characters' }),
  clientIP: z.string().min(2, { message: 'Client IP must be at least 2 characters' }),
})

export interface SearchType extends z.infer<typeof SearchValidationSchema> {}

export interface SearchDocument extends Document, SearchType {}

const searchSchema = new Schema<SearchDocument>({
  search: { type: String, required: true },
  clientIP: { type: String, required: true },
})

const SearchModel = mongoose.model<SearchDocument>('Search', searchSchema)

export { SearchModel, SearchValidationSchema }
