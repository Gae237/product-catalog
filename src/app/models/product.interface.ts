export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationInfo {
  current_page: number;
  total_pages: number;
  per_page: number;
  total_items: number;
}

export interface CategoryResponse {
  categories: string[];
}

export interface ProductResponse {
  data: Product[];
  pagination: PaginationInfo;
}