import createHttpError from 'http-errors'

class HttpException {
  public status: number;
  public message: string;

  constructor(status: number, message: string) {
    this.status = status;
    this.message = message;

    this.sendHttpError()
  }

  private sendHttpError() {
    createHttpError(this.status, this.message)
  }
}

export { HttpException }