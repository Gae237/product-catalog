import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="app-container">
      <header>
        <h1>Product Catalog</h1>
      </header>
      <main>
        <router-outlet></router-outlet>
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