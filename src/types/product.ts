export interface ProductSpecification {
  [key: string]: string;
}

export interface Product {
  id: string;
  name: string;
  vendor_name: string;
  price: number;
  original_price: number;
  discount_percentage: number;
  image: string;
  category: string;
  description: string;
  rating: number;
  review_count: number;
  stock_count: number;
  badge?: "best-seller" | "limited-stock" | "deal";
  specifications: ProductSpecification;
  sku: string;
}
