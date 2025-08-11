export enum CategoryType {
  Business = 'business',
  Product = 'product',
}

export enum FeedbackStatus {
  Pending = 'pending',
  Acknowledged = 'acknowledged',
}

export enum BillboardStatus {
  Schedules = 'scheduled',
  Pending = 'pending',
  Approved = 'approved',
  Expired = 'expired',
  Rejected = 'rejected',
}

export enum SettingsValueType {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Enum = 'enum',
  Options = 'options',
  Object = 'object',
  StringArray = 'string_array',
  NumberArray = 'number_array',
  ObjectArray = 'object_array',
}
