import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
})
export class ProductListComponent implements OnInit, AfterViewInit {
  // Table data source
  dataSource = new MatTableDataSource<Product>([]);
  
  // Define the columns to display in the table
  displayedColumns: string[] = ['id', 'title', 'price', 'category'];
  
  categories: string[] = [];
  selectedCategory: string = '';
  isLoading = true;
  
  // Pagination variables
  totalItems = 0;
  pageSize = 2000;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 50, 100, 500,1000,2000];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private productService: ProductService) { }
  
  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }
  
  ngAfterViewInit() {
    // Connect paginator and sort to the data source after view initialization
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  loadCategories(): void {
    this.productService.getCategories().subscribe(
      categories => {
        this.categories = categories.categories;
        console.log(this.categories);
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
          this.dataSource.data = response.data;
          this.totalItems = response.pagination.total_items;
          this.isLoading = false;
        },
        error => {
          console.error('Error fetching products', error);
          this.dataSource.data = [];
          this.totalItems = 0;
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

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }
  
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  exportToCsv(): void {
    // Get all data for export
    this.isLoading = true;
    this.productService.getAllProducts(this.selectedCategory).subscribe(
      products => {
        this.generateCsv(products);
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching all products for export', error);
        this.isLoading = false;
      }
    );
  }
  
  private generateCsv(products: Product[]): void {
    if (!products || products.length === 0) {
      console.warn('No data to export');
      return;
    }
    
    // Define CSV headers based on product properties
    const headers = Object.keys(products[0]).join(',');
    
    // Map the products to CSV rows
    const csvRows = products.map(product => {
      return Object.values(product).map(value => {
        // Handle strings with commas by wrapping in quotes
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',');
    });
    
    // Combine headers and rows
    const csvContent = [headers, ...csvRows].join('\n');
    
    // Create a Blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `products_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}