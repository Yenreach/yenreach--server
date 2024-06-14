import { Request } from "express"
import { Document, FilterQuery } from "mongoose"

interface CustomPaginationOptions {
  page?: number
  limit?: number
  sort?: any
  filter?: object
  select?: string | string[]
  populate?: string | object
  allowDiskUse?: boolean
}

const paginate = async (model: any, query: FilterQuery<Document>, req: Request, populateOptions?: CustomPaginationOptions["populate"]) => {
  const options: CustomPaginationOptions = {
    page: Number(req.query.page || 0),
    limit: Number(req.query.limit || 10),
    populate: populateOptions || undefined,
    sort: "createdAt"
  }
  const page = parseInt(String(options.page), 10) || 1
  const limit = parseInt(String(options.limit), 10) || 10
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await model.find(query).countDocuments()
  const totalPages = Math.ceil(total / limit)

  let modelResponse = model.find(query)

  if (limit !== 0) {
    modelResponse = modelResponse.skip(startIndex).limit(limit)
  }

  if (options.populate) {
    modelResponse = modelResponse.populate(options.populate)
  }

  if (options.sort) {
    const sortBy = options.sort.split(',').join('')

    modelResponse = modelResponse.sort(sortBy)
  }

  if (options.select) {
    modelResponse = modelResponse.select(options.select)
  }

  if (options.filter) {
    modelResponse = modelResponse.filter(options.filter)
  }

  if (options.allowDiskUse) {
    modelResponse = modelResponse.allowDiskUse(options.allowDiskUse)
  }

  const results = await modelResponse.populate({
    path: 'user',
    select: 'name username displayPhoto bio approved'
  }).lean()

  // Pagination result
  const pagination = { next: {}, prev: {} }

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }

  return {
    total,
    page,
    limit,
    totalPages,
    results,
    pagination
  }
}

export { paginate }
