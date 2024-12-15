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
  chartData: any[] = []; // Données pour le graphique

  constructor(private capteurService: CapteurService) { }

  ngOnInit(): void {
    this.getCapteurs();
    this.initializeWebSocketConnection();
    this.simulateTemperatureData(); // Simulation de données fictives pour les tests
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
      this.updateChartData(newData); // Mise à jour des données pour le graphique
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

  // Simulation de données pour la température
  simulateTemperatureData(): void {
    setInterval(() => {
      const simulatedValue = (Math.random() * (30 - 20) + 20).toFixed(1); // Température aléatoire entre 20 et 30°C
      const simulatedCapteur: Capteur = {
        type: 'Température',
        emplacement: 'Torse',
        valeur: parseFloat(simulatedValue)
      };

      console.log('Simulation de température:', simulatedCapteur);
      this.capteurs.push(simulatedCapteur);
      this.updateChartData(simulatedCapteur); // Mettre à jour les données du graphique
    }, 1000); // Intervalle : 1 seconde
  }

  // Mise à jour des données pour les graphiques
  updateChartData(capteur: Capteur): void {
    if (capteur.type === 'Température') {
      this.chartData.push({ name: new Date().toLocaleTimeString(), value: capteur.valeur });
      if (this.chartData.length > 10) {
        this.chartData.shift(); // Limite à 10 dernières valeurs
      }
    }
  }
}
