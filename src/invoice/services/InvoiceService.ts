import cote from 'cote'
import { CtxObject } from '@/interfaces'
import { InvoiceProvider } from '../providers'

const InvoiceRequester = new cote.Requester({
    name: 'Invoice Requester',
    key: 'invoice',
    requests: [
        'create_invoice',
        'get_user_invoices',
        'get_invoice_info',
        'delete_invoice'
    ]
})

const InvoiceResponder = new cote.Responder({
    name: 'Invoice Responder',
    key: 'invoice',
    respondsTo: [
        'create_invoice',
        'get_user_invoices',
        'get_invoice_info',
        'delete_invoice'
    ],
})

const invoiceProvider = new InvoiceProvider()

InvoiceResponder.on('create_invoice', async (ctx: CtxObject, cb) => {
    return await invoiceProvider.createInvoice(ctx.payload.data)
})

InvoiceResponder.on('get_user_invoices', async (ctx: CtxObject, cb) => {
    return await invoiceProvider.getUserInvoices(ctx.payload.userId)
})

InvoiceResponder.on('get_invoice_info', async (ctx: CtxObject, cb) => {
    return await invoiceProvider.getInvoiceInfo(ctx.payload.id)
})

InvoiceResponder.on('delete_invoice', async (ctx: CtxObject, cb) => {
    return await invoiceProvider.deleteInvoice(ctx.payload.id)
})


export { InvoiceRequester }