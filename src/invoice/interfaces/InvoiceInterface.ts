import { Document } from "mongoose"

interface Invoice {
    from: string
    to: {
        name: string,
        email: string
    }
    invoiceNo: number
    invoiceDate: Date
    dueDate: Date
    logo: string
    items: [{
        name: string,
        hrsOrQty: number
        rate: number
        subtotal: number,
        description: string
    }]
    pdf: string
    user: string
}

interface InvoiceDocument extends Invoice, Document{}

export { Invoice, InvoiceDocument }