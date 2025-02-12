import env from "../../config/env.config"

const getFileLink = (req: any,) => {
  console.log(env.NODE_ENV)
  if (env.NODE_ENV == "development") {
    return `${req.protocol}://${req.hostname}:${env.PORT}/uploads/${(req.file.filename)}`
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  return `${"https" ?? req.protocol}://${req.hostname}/uploads/${(req.file.filename)}`
}

export { getFileLink }
