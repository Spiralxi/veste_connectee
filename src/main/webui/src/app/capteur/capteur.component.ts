import { Component, OnInit } from '@angular/core';
import { CapteurService } from '../capteur.service';

interface Capteur {
  id?: number;
  type: string;
  emplacement: string;
  valeur: number;
}

@Component({
  selector: 'app-capteur',
  templateUrl: './capteur.component.html',
  styleUrls: ['./capteur.component.css']
})
export class CapteurComponent implements OnInit {

  capteurs: Capteur[] = [];
  private websocket!: WebSocket;

  constructor(private capteurService: CapteurService) { }

  ngOnInit(): void {
    this.getCapteurs();
    this.initializeWebSocketConnection();
  }

  getCapteurs(): void {
    this.capteurService.getCapteurs().subscribe(
      (data) => {
        this.capteurs = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des capteurs', error);
      }
    );
  }

  initializeWebSocketConnection(): void {
    this.websocket = new WebSocket('ws://localhost:8080/capteurs-ws');

    this.websocket.onmessage = (event) => {
      console.log('Message reçu via WebSocket:', event.data);
      const newData: Capteur = JSON.parse(event.data);
      this.updateCapteur(newData);
    };

    this.websocket.onerror = (event) => {
      console.error('Erreur de WebSocket:', event);
    };
  }

  // Méthode pour mettre à jour ou ajouter un capteur
  updateCapteur(newData: Capteur): void {
    const index = this.capteurs.findIndex(capteur => capteur.id === newData.id);
    if (index !== -1) {
      // Si trouvé, mettre à jour les données
      this.capteurs[index] = newData;
    } else {
      // Sinon, ajouter le nouveau capteur
      this.capteurs.push(newData);
    }
  }
}
