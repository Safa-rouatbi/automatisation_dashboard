import { Component } from '@angular/core';
import { DashboardComponent } from './features/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardComponent], // ✅ on importe ton dashboard ici
  template: `
    <app-dashboard></app-dashboard>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  monTitre = 'Tableau de bord automatique';
}
