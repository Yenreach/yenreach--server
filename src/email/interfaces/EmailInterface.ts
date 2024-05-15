interface EmailPayload {
    to: string,
    subject: string,
    payload?: object
    text?: string
    template: string
}

export { EmailPayload }