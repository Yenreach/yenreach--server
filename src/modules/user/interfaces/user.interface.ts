interface IUser {
  id: number;
  verifyString: string;
  name: string;
  email: string;
  timer: number;
  password: string;
  image: string;
  listed: number;
  referMethod: string;
  admin: number;
  dateCreated: Date;
  lastModified: Date;
  modifiedBy: string;
  activation: number;
  authoLevel: number;
  created: number;
  lastUpdated: number;
  confirmedEmail: number;
  emailTrack?: number | null;
  smsTrack: number;
  cv: string;
  dob: string;
  phone: string;
  gender: string;
}

export { IUser }
