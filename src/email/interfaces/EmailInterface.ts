interface EmailPayload {
  to: string | string[],
  subject: string,
  payload?: object
  text?: string
  template: string
}

interface IEmail {
  to: string,
  subject: string,
  name: string,
  heading: string,
  message: string
}



export { EmailPayload, IEmail }
