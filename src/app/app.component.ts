import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ProductListComponent } from "./components/product-list/product-list.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductListComponent, HttpClientModule],
  template: `
    <div class="app-container">
      <header>
        <h1>Product Catalog</h1>
      </header>
      <main>
        <app-product-list></app-product-list>
      </main>
      
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    header {
      background-color: #673ab7;
      color: white;
      padding: 16px;
      text-align: center;
    }
    
    main {
      flex: 1;
    }
    
    footer {
      background-color: #f5f5f5;
      padding: 16px;
      text-align: center;
    }
  `]
})
export class AppComponent {}