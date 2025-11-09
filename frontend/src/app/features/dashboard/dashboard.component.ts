// src/app/features/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartesIndicateursComponent } from '../kpi-cartes/kpi-cartes.component';
import { TableauLogsComponent } from '../logs-table/logs-table.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CartesIndicateursComponent, TableauLogsComponent],
  template: `
    <main class="conteneur">
      <header>
        <h1>Tableau de bord — Automatisations</h1>
        <p>Vue synthétique des tâches automatisées</p>
      </header>

      <app-kpi-cartes></app-kpi-cartes>

      <app-logs-table></app-logs-table>
    </main>
  `,
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {}
