// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface LogExecution {
  nomTache: string;
  duree: number;
  reussi: boolean;
  momentExecution?: string;
}

export interface Statistiques {
  nombreTotal: number;
  tauxReussite: string;
  tauxEchec: string;
  dureeMoyenne: string;
  derniereExecution?: string;
}

interface LogBackend {
  task: string;
  duration: number;
  success: boolean;
  timestamp?: string;
}

interface StatistiquesBackend {
  total: number;
  successRate: string;
  failureRate: string;
  avgDuration: string;
  lastExecution?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceApi {
  private adresseServeur = 'http://localhost:3000';

  constructor(private clientHttp: HttpClient) {}

  private eviterCache() {
    return { params: { t: Date.now().toString() } };
  }

  recupererLesLogs(): Observable<LogExecution[]> {
    return this.clientHttp.get<LogBackend[]>(`${this.adresseServeur}/logs`, this.eviterCache()).pipe(
      map((logs) => logs.map((log) => ({
        nomTache: log.task,
        duree: log.duration,
        reussi: log.success,
        momentExecution: log.timestamp
      })))
    );
  }

  recupererLesStatistiques(): Observable<Statistiques> {
    return this.clientHttp.get<StatistiquesBackend>(`${this.adresseServeur}/kpi`, this.eviterCache()).pipe(
      map((stats) => ({
        nombreTotal: stats.total,
        tauxReussite: stats.successRate,
        tauxEchec: stats.failureRate,
        dureeMoyenne: stats.avgDuration,
        derniereExecution: stats.lastExecution
      }))
    );
  }
}
