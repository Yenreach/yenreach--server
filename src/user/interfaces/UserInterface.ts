interface User {
  _id: string;
  name: {
    first: string
    last: string
    full: string
  }
  username: string
  address: string
  city: string
  state: string
  country: string
  street?: string;
  zipCode: string | number;
  dob: string
  gender: "male" | "female";
  number: string
  phoneNumber: number | string;
  email: string;
  role: string
  phoneVerified: boolean;
  isVerified: boolean
  isDeactivated: boolean
  accountType: string
  password: string;
  displayPhoto: string;
  tokens?: string[];
  stripeID?: string;
  kycID?: string;
  currency?: string;
  documents?: {
    passportFront: String,
    passportBack: String,
    driverLicenseFront: String,
    driverLicenseBack: String,
    selfie: String,
    idCardFront: String,
    idCardBack: String,
    utilityBill: String,
    bankStatement: String,
    creditCardSystem: String,
    videoVerification: String,
  },
}

export { User }
