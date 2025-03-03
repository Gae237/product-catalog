import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-filter',
  imports: [CommonModule],
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.css'],
  standalone: true
})
export class CategoryFilterComponent implements OnInit {
  categories: string[] = [];
  selectedCategory: string = '';
  @Output() categorySelected = new EventEmitter<string>();

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (response) => {
        this.categories = response;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.categorySelected.emit(category);
  }
}
