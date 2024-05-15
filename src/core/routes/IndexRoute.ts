import { Request, Response, NextFunction, Router, response } from 'express';
import { generate } from 'otp-generator'
// import { IndexController } from '@controllers/index.controller';
import { Routes } from '@/core/routes/interfaces/RouteInterface';
import { APP_NAME, GBP_PRICE } from '../../config';
import mongoose, { Model, model, mongo } from 'mongoose';
import { User } from '@/user/models';
import { Otp, PasswordToken, Token } from '@/auth/models';
import { Account } from '@/account/models';
import { Card } from '@/card/models';
import { Transaction } from '@/transaction/models';
import { Bill } from '@/bill/models';
import { Address } from '@/address/models';
import { Contact } from '@/contact/models';
import { Wallet } from '@/wallet/models';
import { Invoice } from '@/invoice/models';
import { PaymentRequest } from '@/payment-request/models';
import { sendResponse } from '../utils';
import { HttpCodes } from '../constants';
import { authMiddleware } from '../middlewares';
import { RequestWithUser } from '@/auth/interfaces';
import { axiosInstance } from '../../wallet/utils';
import { countryList } from '../../config/countryList';
import { UserController } from '../../user';
import { Country, State, City } from 'country-state-city';

class IndexRoute implements Routes {
    public path = '/';
    public router = Router();
    //   public indexController = new IndexController();
    public userController = new UserController

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {

        this.router.get(`${this.path}`, (req: Request, res: Response, next: NextFunction) => {
            return res.status(200)
                .json({
                    msg: `Welcome to ${APP_NAME} Backend`
                })
        });


        this.router.get(`${this.path}klines/:symbol`, async (req: Request, res: Response) => {
            const response = (await axiosInstance({
                url: `klines/${req.params.symbol}`,
                method: "get"
            }))


            return res.json({
                symbol: response.data.symbol, prices: (response.data.prices || []).map(price => {
                    price[1] *= GBP_PRICE
                    return price
                })
            })
        })


        this.router.get(`${this.path}klines`, async (req: Request, res: Response) => {
            const response = (await axiosInstance({
                url: `klines`,
                method: "get"
            }))

            return res.json(response.data)
        })

        // Query Country lists
        this.router.get(`${this.path}countries`, async (req: Request, res: Response, next: NextFunction) => {
            return res.json(Country.getAllCountries())
        })
        /**
         * 
         */
        this.router.get(`${this.path}countryStates`, async (req: Request, res: Response, next: NextFunction) => {
            const { countryCode } = req.query
            if (!countryCode) {
                return next(Error("stateCode must be provided!"))
            }
            return res.json(State.getStatesOfCountry(req.query.countryCode.toString() || ''))
        })
        /**
         * 
         */
        this.router.get(`${this.path}stateCities`, async (req: Request, res: Response, next: NextFunction) => {
            const { countryCode, stateCode } = req.query
            if (!countryCode || !stateCode) {
                return next(Error("countryCode and stateCode must be provided!"))
            }
            // data.countryCode == countryCode && 
            return res.json(City.getAllCities().filter((data) => data.stateCode == stateCode).map((city) => {
                return { ...city, countryCode }
            }))
        })

        //Generatte invoice
        this.router.get(`${this.path}invoice/generate`, async (req: Request, res: Response, next: NextFunction) => {
            const invoiceNo = String(generate(12, {
                upperCaseAlphabets: false, lowerCaseAlphabets: false,
                digits: true, specialChars: false,
            }))

            const formattedNo = invoiceNo.match(/.{1,4}/g).join('-');

            return sendResponse(res, HttpCodes.OK, 'Invoice number generated successfully', {
                number: Number(invoiceNo),
                formattedNo
            })
        })

        this.router.put(`${this.path}notificationToken`, this.userController.uploadNotificationTokenHandler);

        //Delete db
        // this.router.post(`${this.path}drop`, async (req: Request, res: Response, next: NextFunction) => {
        //     await Promise.all([
        //         User.deleteMany(),
        //         Token.deleteMany(),
        //         Account.deleteMany(),
        //         Card.deleteMany(),
        //         Otp.deleteMany(),
        //         PasswordToken.deleteMany(),
        //         Transaction.deleteMany(),
        //         Bill.deleteMany(),
        //         Address.deleteMany(),
        //         Contact.deleteMany(),
        //         Invoice.deleteMany(),
        //         PaymentRequest.deleteMany(),
        //         Wallet.deleteMany()
        //     ])

        //     return res.status(200)
        //         .json({
        //             msg: 'Data deleted successfully'
        //         })
        // })

        // this.router.post(`${this.path}user/delete`, async (req: RequestWithUser, res: Response, next: NextFunction) => {
        //     const user = await User.findOne({ email: req.body.email })

        //     if (!user) {
        //         return res.status(400)
        //             .json({
        //                 msg: 'User does not exist'
        //             })
        //     }

        //     await Promise.all([
        //         User.findByIdAndDelete(user._id),
        //         Token.findOneAndDelete({ userId: user._id }),
        //         Account.findOneAndDelete({ user: user._id }),
        //         Card.findOneAndDelete({ user: user._id }),
        //         PasswordToken.findOneAndDelete({ user: user._id }),
        //         Transaction.deleteMany({ user: user._id }),
        //         Bill.deleteMany({ user: user._id }),
        //         Address.deleteMany({ user: user._id }),
        //         Contact.findOneAndDelete({ user: user._id }),
        //         Invoice.deleteMany({ user: user._id }),
        //         PaymentRequest.deleteMany({ user: user._id }),
        //         Wallet.deleteMany({ user: user._id })
        //     ])

        //     return res.status(200)
        //         .json({
        //             msg: 'Data deleted successfully'
        //         })
        // })
    }
}

export { IndexRoute };
