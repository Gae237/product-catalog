import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductResponse } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'https://chogan-fetcher.onrender.com'; 

  constructor(private http: HttpClient) { }

  getProducts(page: number = 1, pageSize: number = 20, category?: string): Observable<ProductResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', pageSize.toString());
    
    if (category) {
      params = params.set('category', category);
    }

    return this.http.get<ProductResponse>(`${this.baseUrl}/products`, { params });
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/categories`);
  }
}
