import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceApi, LogExecution } from '../../services/api.service';

@Component({
  selector: 'app-logs-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="logs-container">
      <div class="logs-header">
        <h3>Historique des exécutions</h3>
        <div class="logs-meta">
          <span>Total: {{ mesLogs.length }}</span>
          <span>Dernière mise à jour: {{ derniereMiseAJour || '—' }}</span>
          <span *ngIf="estEnChargement" class="loading-indicator"></span>
          <span *ngIf="estEnChargement">Chargement…</span>
        </div>
      </div>

      <p *ngIf="messageErreur" class="error-message">{{ messageErreur }}</p>

      <table *ngIf="mesLogs && mesLogs.length; else vide" class="table-logs">
        <thead>
          <tr>
            <th>Tâche</th>
            <th>Durée (s)</th>
            <th>Succès</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let log of mesLogs">
            <td>{{ log.nomTache }}</td>
            <td>{{ log.duree }}</td>
            <td>
              <span [class]="log.reussi ? 'status-badge status-success' : 'status-badge status-failure'">
                {{ log.reussi ? 'OK' : 'Échec' }}
              </span>
            </td>
            <td>{{ log.momentExecution || '—' }}</td>
          </tr>
        </tbody>
      </table>

      <ng-template #vide>
        <p class="empty-message">Aucun log trouvé.</p>
      </ng-template>
    </div>
  `,
  styleUrl: './logs-table.component.css'
})
export class TableauLogsComponent implements OnInit, OnDestroy {
  mesLogs: LogExecution[] = [];
  estEnChargement = false;
  messageErreur = '';
  derniereMiseAJour = '';
  private identifiantIntervalle: any;
  private gestionnaireVisibilite = () => this.quandLaVisibiliteChange();

  constructor(private monService: ServiceApi, private detecteurChangements: ChangeDetectorRef, private zoneAngular: NgZone) {}

  ngOnInit() {
    this.chargerLesLogs();
    this.demarrerLIntervalle();
    document.addEventListener('visibilitychange', this.gestionnaireVisibilite);
  }

  ngOnDestroy() {
    this.arreterLIntervalle();
    document.removeEventListener('visibilitychange', this.gestionnaireVisibilite);
  }

  private demarrerLIntervalle() {
    this.arreterLIntervalle();
    this.identifiantIntervalle = setInterval(() => {
      console.debug('[LogsTable] Auto-refresh tick');
      this.chargerLesLogs();
    }, 10000);
  }

  private arreterLIntervalle() {
    if (this.identifiantIntervalle) {
      clearInterval(this.identifiantIntervalle);
      this.identifiantIntervalle = undefined;
    }
  }

  private quandLaVisibiliteChange() {
    if (document.visibilityState === 'visible') {
      this.chargerLesLogs();
      this.demarrerLIntervalle();
    } else {
      this.arreterLIntervalle();
    }
  }

  private mettreAJourLaDate() {
    const maintenant = new Date();
    this.derniereMiseAJour = maintenant.toLocaleTimeString();
  }

  chargerLesLogs() {
    this.estEnChargement = true;
    this.messageErreur = '';

    this.monService.recupererLesLogs().subscribe({
      next: (donnees) => {
        const tries = (donnees || []).slice().sort((a, b) => {
          const dateA = a.momentExecution ? new Date(a.momentExecution).getTime() : 0;
          const dateB = b.momentExecution ? new Date(b.momentExecution).getTime() : 0;
          return dateB - dateA; // plus récent en premier
        });
        const dernierTimestamp = tries[0]?.momentExecution || '—';
        console.debug(`[LogsTable] Reçu ${tries.length} entrées, dernier ts = ${dernierTimestamp}`);
        this.zoneAngular.run(() => {
          this.mesLogs = tries;
          this.estEnChargement = false;
          this.mettreAJourLaDate();
          this.detecteurChangements.markForCheck();
        });
      },
      error: (erreur) => {
        console.error('Erreur chargement logs', erreur);
        this.zoneAngular.run(() => {
          this.messageErreur = 'Impossible de charger les logs.';
          this.estEnChargement = false;
          this.mettreAJourLaDate();
          this.detecteurChangements.markForCheck();
        });
      }
    });
  }

  rafraichir() {
    this.chargerLesLogs();
  }
}
