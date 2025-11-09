// src/app/features/kpi-cartes/kpi-cartes.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceApi, Statistiques } from '../../services/api.service';

@Component({
  selector: 'app-kpi-cartes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="kpi-header">
      <span>Dernière mise à jour: {{ derniereMiseAJour || '—' }}</span>
      <span *ngIf="estEnChargement" class="loading-indicator"></span>
      <span *ngIf="estEnChargement">Chargement…</span>
    </div>

    <section *ngIf="mesStatistiques; else chargement" class="kpi-container">
      <div class="carte">
        <div class="titre">Tâches totales</div>
        <div class="valeur">{{ mesStatistiques.nombreTotal }}</div>
      </div>
      <div class="carte">
        <div class="titre">Taux de succès</div>
        <div class="valeur">{{ mesStatistiques.tauxReussite }}</div>
      </div>
      <div class="carte">
        <div class="titre">Taux d'échec</div>
        <div class="valeur">{{ mesStatistiques.tauxEchec }}</div>
      </div>
      <div class="carte">
        <div class="titre">Durée moyenne</div>
        <div class="valeur">{{ mesStatistiques.dureeMoyenne }}</div>
      </div>
      <div class="carte">
        <div class="titre">Dernière exécution</div>
        <div class="valeur">{{ mesStatistiques.derniereExecution || '—' }}</div>
      </div>
    </section>

    <ng-template #chargement>
      <p class="loading-message">Chargement des indicateurs…</p>
    </ng-template>
  `,
  styleUrl: './kpi-cartes.component.css'
})
export class CartesIndicateursComponent implements OnInit, OnDestroy {
  mesStatistiques?: Statistiques;
  estEnChargement = false;
  derniereMiseAJour = '';
  private identifiantIntervalle: any;
  private gestionnaireVisibilite = () => this.quandLaVisibiliteChange();

  constructor(private monService: ServiceApi, private detecteurChangements: ChangeDetectorRef, private zoneAngular: NgZone) {}

  ngOnInit() {
    this.chargerLesStatistiques();
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
      console.debug('[KPI] Auto-refresh tick');
      this.chargerLesStatistiques();
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
      this.chargerLesStatistiques();
      this.demarrerLIntervalle();
    } else {
      this.arreterLIntervalle();
    }
  }

  private mettreAJourLaDate() {
    const maintenant = new Date();
    this.derniereMiseAJour = maintenant.toLocaleTimeString();
  }

  chargerLesStatistiques() {
    this.estEnChargement = true;
    this.monService.recupererLesStatistiques().subscribe({
      next: (donnees) => {
        this.zoneAngular.run(() => {
          this.mesStatistiques = donnees;
          this.estEnChargement = false;
          this.mettreAJourLaDate();
          this.detecteurChangements.markForCheck();
        });
      },
      error: (erreur) => {
        console.error('Erreur chargement KPI', erreur);
        this.zoneAngular.run(() => {
          this.estEnChargement = false;
          this.mettreAJourLaDate();
          this.detecteurChangements.markForCheck();
        });
      }
    });
  }

  rafraichir() {
    this.chargerLesStatistiques();
  }
}
