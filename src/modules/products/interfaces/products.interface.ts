interface IProduct {
  productname: string;
  businessString: string;
  productDescription: string;
  productPrice: number;
  productQuantity: number;
  productColor: string;
  productSafetyTip: string;
  productCategories: { category: string }[];
  productPhotos: { filename: string }[];
}

export { IProduct }
