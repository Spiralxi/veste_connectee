import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}
