import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Capteur {
  id?: number;
  type: string;
  emplacement: string;
  valeur: number;
}

@Injectable({
  providedIn: 'root'
})
export class CapteurService {

  private baseUrl = 'http://localhost:8080/capteurs';

  constructor(private http: HttpClient) { }

  // Méthode pour obtenir tous les capteurs
  getCapteurs(): Observable<Capteur[]> {
    return this.http.get<Capteur[]>(this.baseUrl);
  }

  // Méthode pour créer un capteur
  addCapteur(capteur: Capteur): Observable<Capteur> {
    return this.http.post<Capteur>(this.baseUrl, capteur);
  }

  // Méthode pour récupérer l'historique ECG
  getHistoriqueECG(): Observable<{ name: Date, value: number }[]> {
    return this.http
      .get<{ valeur: number; timestamp: string }[]>(`${this.baseUrl}/historique/ecg`)
      .pipe(
        map(data => {
          // data est en DESC => on le renverse pour un ordre chronologique ASC
          return data.reverse().map(point => ({
            name: new Date(point.timestamp),
            value: point.valeur
          }));
        })
      );
  }

  // Méthode pour récupérer l'historique Température
  getHistoriqueTemperature(): Observable<{ name: Date, value: number }[]> {
    return this.http
      .get<{ valeur: number; timestamp: string }[]>(`${this.baseUrl}/historique/temperature`)
      .pipe(
        map(data => {
          // data est en DESC => on le renverse pour un ordre chronologique ASC
          return data.reverse().map(point => ({
            name: new Date(point.timestamp),
            value: point.valeur
          }));
        })
      );
  }

  // Méthode pour récupérer l'historique Humidité (nouveau)
  getHistoriqueHumidite(): Observable<{ name: Date, value: number }[]> {
    return this.http
      .get<{ valeur: number; timestamp: string }[]>(`${this.baseUrl}/historique/humidite`)
      .pipe(
        map(data => {
          return data.reverse().map(point => ({
            name: new Date(point.timestamp),
            value: point.valeur
          }));
        })
      );
  }

  // Méthode pour récupérer l'historique Qualité de l'air (nouveau)
  getHistoriqueQualiteAir(): Observable<{ name: Date, value: number }[]> {
    return this.http
      .get<{ valeur: number; timestamp: string }[]>(`${this.baseUrl}/historique/qualiteair`)
      .pipe(
        map(data => {
          return data.reverse().map(point => ({
            name: new Date(point.timestamp),
            value: point.valeur
          }));
        })
      );
  }

  // Méthode pour récupérer l'historique Bruit (nouveau)
  getHistoriqueBruit(): Observable<{ name: Date, value: number }[]> {
    return this.http
      .get<{ valeur: number; timestamp: string }[]>(`${this.baseUrl}/historique/bruit`)
      .pipe(
        map(data => {
          return data.reverse().map(point => ({
            name: new Date(point.timestamp),
            value: point.valeur
          }));
        })
      );
  }
}
