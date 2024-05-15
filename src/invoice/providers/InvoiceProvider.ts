import { HttpException } from '@/core/exceptions'
import { Invoice } from '../models'
import { HttpCodes } from '@/core/constants'
import { Invoice as IInvoice, InvoiceDocument } from '../interfaces'
import { User } from '@/user/models'
import { Types } from 'mongoose';

class InvoiceProvider {
    public invoiceModel = Invoice
    public userModel = User

    public async createInvoice(payload: IInvoice): Promise<InvoiceDocument> {
        const existingUser = await this.userModel.findById(payload.user)

        if (!existingUser) {
            throw new HttpException(HttpCodes.BAD_REQUEST, 'This user id does not exist')
        }

        const response = await this.invoiceModel.create({
            ...payload,
            items: payload.items.map(item => {
                return {
                    name: item.name,
                    hrsOrQty: item.hrsOrQty,
                    description: item.description,
                    rate: item.rate,
                    subtotal: item.subtotal
                }
            }),
            dueDate: new Date(payload.dueDate),
            user: payload.user
        })


        return response
    }

    public async getUserInvoices(user: string): Promise<InvoiceDocument[]> {
        const response = await this.invoiceModel.find({ user })
            .populate({
                path: 'user',
                select: 'name displayPhoto'
            })

        return response
    }

    public async getInvoiceInfo(id: string): Promise<InvoiceDocument> {
        const response = await this.invoiceModel.findById(id)
            .populate({
                path: 'user',
                select: 'name displayPhoto'
            })

        if (!response) {
            throw new HttpException(HttpCodes.BAD_REQUEST, 'This Invoice does not exist')
        }

        return response
    }

    public async updateInvoice(id: string, payload: IInvoice): Promise<void> {
        await this.getInvoiceInfo(id)

        await this.invoiceModel.findByIdAndUpdate(id, { ...payload })
    }

    public async deleteInvoice(id: string): Promise<void> {
        await this.getInvoiceInfo(id)

        await this.invoiceModel.findByIdAndDelete(id)
    }

}

export { InvoiceProvider }
