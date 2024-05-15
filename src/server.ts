import App from '@/app';
import {
    AccountRoute, AddressRoute, AdminRoutes, AuthOptionRoute, AuthRoute, BillRoute, CardRoute,
    ContactRoute, ConversationRoute, IndexRoute, InvoiceRoute, PaymentRequestRoute, 
    TransactionRoute, 
    UploadRoute, UserRoute, WalletExtendedRoute, WalletRoute
} from '@/core/routes';
import { validateEnv } from '@/core/utils/validateEnv';

validateEnv();

const app = new App([new AuthRoute(), new IndexRoute(), new UserRoute(), new TransactionRoute(),
new AccountRoute(), new CardRoute(), new ContactRoute(), new BillRoute(), new AddressRoute(),
new UploadRoute(), new PaymentRequestRoute(), new InvoiceRoute(), new WalletRoute(),
new WalletExtendedRoute(), new ConversationRoute(), new AuthOptionRoute(), new AdminRoutes()
]);

app.listen()


