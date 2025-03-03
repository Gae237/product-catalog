import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatFormFieldModule
  ]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: string[] = [];
  selectedCategory: string = '';
  isLoading = true;
  
  // Pagination variables
  totalItems = 0;
  pageSize = 20;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  constructor(private productService: ProductService) { }
  
  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }
  
  loadCategories(): void {
    this.productService.getCategories().subscribe(
      categories => {
        this.categories = categories;
      },
      error => {
        console.error('Error fetching categories', error);
      }
    );
  }
  
  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts(this.currentPage + 1, this.pageSize, this.selectedCategory)
      .subscribe(
        response => {
          this.products = response.data
          console.log(this.products);
          this.totalItems = response.pagination.total_items;
          this.isLoading = false;
        },
        error => {
          console.error('Error fetching products', error);
          this.isLoading = false;
        }
      );
  }
  
  onCategoryChange(event: MatSelectChange): void {
    this.selectedCategory = event.value;
    this.currentPage = 0;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadProducts();
  }
  
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }
}