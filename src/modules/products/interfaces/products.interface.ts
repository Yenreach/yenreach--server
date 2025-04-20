interface IProduct {
  productName: string;
  businessString: string;
  productDescription: string;
  productPrice: number;
  productQuantity: number;
  productColor: string;
  productSafetyTip: string;
  categories: { category: string }[];
  photos: { filename: string }[];
}

export { IProduct }
