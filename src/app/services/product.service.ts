import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, of, map } from 'rxjs';
import { Categories, Product, ProductResponse } from '../models/product.interface';

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
    
    return this.http.get<ProductResponse>(`${this.baseUrl}/products`, { params })
      .pipe(
        catchError(this.handleError<ProductResponse>('getProducts', {
          data: [],
          pagination: { 
            total_items: 0, 
            total_pages: 0, 
            current_page: page, 
            per_page: pageSize 
          }
        }))
      );
  }
  
  // Fixed method to get all products for CSV export
  getAllProducts(category?: string): Observable<Product[]> {
    let params = new HttpParams()
      .set('page', '1')
      .set('per_page', '20'); // Request a large number to get all or most products
      
    if (category) {
      params = params.set('category', category);
    }
    
    return this.http.get<ProductResponse>(`${this.baseUrl}/products`, { params })
      .pipe(
        map(response => response.data), // Extract just the data array from the response
        catchError(this.handleError<Product[]>('getAllProducts', []))
      );
  }

  getCategories(): Observable<Categories> {
    return this.http.get<Categories>(`${this.baseUrl}/categories`)
      .pipe(
        catchError(this.handleError<Categories>('getCategories', {categories: []}))
      );
  }
  
  // Added method to get a single product by ID
  getProductById(id: string | number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`)
      .pipe(
        catchError(this.handleError<Product>('getProductById', {} as Product))
      );
  }
  
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}