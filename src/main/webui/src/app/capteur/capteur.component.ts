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
  styleUrls: ['./capteur.component.css'],
  standalone: false
})
export class CapteurComponent implements OnInit {

  capteurs: Capteur[] = [];
  private websocket!: WebSocket;

  // 📊 Données pour les graphiques en temps réel
  lineChartDataTemperature: any[] = [{ name: "Température", series: [] }];
  lineChartDataHumidite: any[] = [{ name: "Humidité", series: [] }];
  lineChartDataQualiteAir: any[] = [{ name: "Qualité de l'air", series: [] }];
  lineChartDataBruit: any[] = [{ name: "Bruit", series: [] }];
  lineChartDataECG: any[] = [{ name: "Electrocardiogramme", series: [] }];

  derniereValeurs: { [key: string]: number } = {
    "Température": 0,
    "Humidité": 0,
    "Qualité de l'air": 0,
    "Bruit": 0,
    "Electrocardiogramme": 0
  };

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
      this.updateChart(newData);
    };

    this.websocket.onerror = (event) => {
      console.error('Erreur de WebSocket:', event);
    };
  }

  updateCapteur(newData: Capteur): void {
    const index = this.capteurs.findIndex(capteur => capteur.id === newData.id);
    if (index !== -1) {
      this.capteurs[index] = newData;
    } else {
      this.capteurs.push(newData);
    }
  }

  updateChart(newData: Capteur): void {
    const timestamp = new Date().toLocaleTimeString();

    this.derniereValeurs[newData.type] = newData.valeur;

    let chartData;
    switch (newData.type) {
      case "Température": chartData = this.lineChartDataTemperature; break;
      case "Humidité": chartData = this.lineChartDataHumidite; break;
      case "Qualité de l'air": chartData = this.lineChartDataQualiteAir; break;
      case "Bruit": chartData = this.lineChartDataBruit; break;
      case "Electrocardiogramme": chartData = this.lineChartDataECG; break;
      default: return;
    }

    // Ajout de la nouvelle valeur au graphique
    chartData[0].series.push({ name: timestamp, value: newData.valeur });

    // Limiter à 10 points pour éviter surcharge
    if (chartData[0].series.length > 10) {
      chartData[0].series.shift();
    }

    // ⚠️ **Correction : Angular détecte mieux la mise à jour avec une copie complète**
    this.lineChartDataTemperature = [...this.lineChartDataTemperature];
    this.lineChartDataHumidite = [...this.lineChartDataHumidite];
    this.lineChartDataQualiteAir = [...this.lineChartDataQualiteAir];
    this.lineChartDataBruit = [...this.lineChartDataBruit];
    this.lineChartDataECG = [...this.lineChartDataECG];
  }

  getCouleurAlerte(type: string, valeur: number): string {
    switch (type) {
      case "Température": return valeur > 38 ? "red" : valeur > 35 ? "orange" : "black";
      case "Humidité": return valeur > 70 ? "red" : valeur > 50 ? "orange" : "black";
      case "Qualité de l'air": return valeur < 50 ? "red" : valeur < 70 ? "orange" : "black";
      case "Bruit": return valeur > 85 ? "red" : valeur > 65 ? "orange" : "black";
      case "Electrocardiogramme": return (valeur < 50 || valeur > 120) ? "red" : (valeur < 60 || valeur > 100) ? "orange" : "black";
      default: return "black";
    }
  }
}
