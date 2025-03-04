export interface Product {
  id: number | string;
  title: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  // Add any other properties that your API returns
}

export interface ProductResponse {
  data: Product[];
  pagination: {
    total_items: number;
    total_pages: number;
    current_page: number;
    per_page: number;
  };
}

export interface Categories {
  categories: string[];
}