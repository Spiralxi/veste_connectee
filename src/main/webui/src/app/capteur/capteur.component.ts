import { Component, OnInit } from '@angular/core';
import { CapteurService } from '../capteur.service';
import { NotificationService } from '../services/notification.service'; // 📌 Import du service de notifications

interface Capteur {
  id?: number;
  type: string;
  emplacement: string;
  valeur: number;
  timestamp?: string;
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

  constructor(
    private capteurService: CapteurService,
    private notificationService: NotificationService // 📌 Ajout du service de notifications
  ) { }

  ngOnInit(): void {
    this.getCapteurs();
    this.initializeWebSocketConnection();

    // Historique ECG (déjà existant)
    this.loadHistoriqueECG();

    // Historique Température (déjà existant)
    this.loadHistoriqueTemperature();

    // Historique Humidité (nouveau)
    this.loadHistoriqueHumidite();

    // Historique Qualité de l'air (nouveau)
    this.loadHistoriqueQualiteAir();

    // Historique Bruit (nouveau)
    this.loadHistoriqueBruit();
  }

  getCapteurs(): void {
    this.capteurService.getCapteurs().subscribe(
      (data) => {
        this.capteurs = data;
      },
      (error) => {
        console.error('❌ Erreur lors de la récupération des capteurs', error);
      }
    );
  }

  // =====================
  // HISTORIQUE ECG
  // =====================
  loadHistoriqueECG(): void {
    this.capteurService.getHistoriqueECG().subscribe(data => {
      console.log("📌 Historique ECG chargé :", data);

      if (data.length > 0) {
        // On remplace directement la série par les 10 points de l’historique
        this.lineChartDataECG[0].series = data;
        // Mise à jour forcée du tableau (requis par ngx-charts)
        this.lineChartDataECG = [...this.lineChartDataECG];

        // Optionnel : on met la dernière valeur dans derniereValeurs
        const lastPoint = data[data.length - 1];
        this.derniereValeurs["Electrocardiogramme"] = lastPoint.value;
      }
    });
  }

  // =====================
  // HISTORIQUE TEMPÉRATURE
  // =====================
  loadHistoriqueTemperature(): void {
    this.capteurService.getHistoriqueTemperature().subscribe(data => {
      console.log("📌 Historique Température chargé :", data);

      if (data.length > 0) {
        this.lineChartDataTemperature[0].series = data;
        this.lineChartDataTemperature = [...this.lineChartDataTemperature];
        const lastPoint = data[data.length - 1];
        this.derniereValeurs["Température"] = lastPoint.value;
      }
    });
  }

  // =====================
  // HISTORIQUE HUMIDITÉ (NOUVEAU)
  // =====================
  loadHistoriqueHumidite(): void {
    this.capteurService.getHistoriqueHumidite().subscribe(data => {
      console.log("📌 Historique Humidité chargé :", data);

      if (data.length > 0) {
        this.lineChartDataHumidite[0].series = data;
        this.lineChartDataHumidite = [...this.lineChartDataHumidite];
        const lastPoint = data[data.length - 1];
        this.derniereValeurs["Humidité"] = lastPoint.value;
      }
    });
  }

  // =====================
  // HISTORIQUE QUALITÉ DE L'AIR (NOUVEAU)
  // =====================
  loadHistoriqueQualiteAir(): void {
    this.capteurService.getHistoriqueQualiteAir().subscribe(data => {
      console.log("📌 Historique Qualité de l'air chargé :", data);

      if (data.length > 0) {
        this.lineChartDataQualiteAir[0].series = data;
        this.lineChartDataQualiteAir = [...this.lineChartDataQualiteAir];
        const lastPoint = data[data.length - 1];
        this.derniereValeurs["Qualité de l'air"] = lastPoint.value;
      }
    });
  }

  // =====================
  // HISTORIQUE BRUIT (NOUVEAU)
  // =====================
  loadHistoriqueBruit(): void {
    this.capteurService.getHistoriqueBruit().subscribe(data => {
      console.log("📌 Historique Bruit chargé :", data);

      if (data.length > 0) {
        this.lineChartDataBruit[0].series = data;
        this.lineChartDataBruit = [...this.lineChartDataBruit];
        const lastPoint = data[data.length - 1];
        this.derniereValeurs["Bruit"] = lastPoint.value;
      }
    });
  }

  initializeWebSocketConnection(): void {
    this.websocket = new WebSocket('ws://localhost:8080/capteurs-ws');

    this.websocket.onmessage = (event) => {
      console.log('📩 Message reçu via WebSocket:', event.data);
      const newData: Capteur = JSON.parse(event.data);
      this.updateCapteur(newData);
      this.updateChart(newData);
    };

    this.websocket.onerror = (event) => {
      console.error('⚠️ Erreur de WebSocket:', event);
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

  // Fonction utilitaire pour récupérer l'unité associée à chaque type de capteur
  getUnit(sensorType: string): string {
    switch (sensorType) {
      case "Température": return "°C";
      case "Humidité": return "%";
      case "Qualité de l'air": return "%";
      case "Bruit": return "dB";
      case "Electrocardiogramme": return "BPM";
      default: return "";
    }
  }

  updateChart(newData: Capteur): void {
    const timestamp = new Date().toLocaleTimeString();
    this.derniereValeurs[newData.type] = newData.valeur;

    let chartData;
    switch (newData.type) {
      case "Electrocardiogramme":
        chartData = this.lineChartDataECG;
        break;
      case "Température":
        chartData = this.lineChartDataTemperature;
        break;
      case "Humidité":
        chartData = this.lineChartDataHumidite;
        break;
      case "Qualité de l'air":
        chartData = this.lineChartDataQualiteAir;
        break;
      case "Bruit":
        chartData = this.lineChartDataBruit;
        break;
      default:
        return;
    }

    // Limiter à 10 points
    if (chartData[0].series.length >= 10) {
      chartData[0].series.shift();
    }

    // Ajout de la nouvelle valeur
    chartData[0].series = [
      ...chartData[0].series,
      { name: timestamp, value: newData.valeur }
    ];

    // Mise à jour forcée
    if (newData.type === "Electrocardiogramme") {
      this.lineChartDataECG = [...this.lineChartDataECG];
    } else if (newData.type === "Température") {
      this.lineChartDataTemperature = [...this.lineChartDataTemperature];
    } else if (newData.type === "Humidité") {
      this.lineChartDataHumidite = [...this.lineChartDataHumidite];
    } else if (newData.type === "Qualité de l'air") {
      this.lineChartDataQualiteAir = [...this.lineChartDataQualiteAir];
    } else if (newData.type === "Bruit") {
      this.lineChartDataBruit = [...this.lineChartDataBruit];
    }

    console.log("🟢 Mise à jour graphique", newData.type, "avec :", chartData[0].series);

    // Vérification du seuil pour déclencher la notification
    const couleur = this.getCouleurAlerte(newData.type, newData.valeur);
    if (couleur === "red") {
      this.notificationService.afficherNotification(newData.type, newData.valeur, this.getUnit(newData.type));
    } else {
      this.notificationService.reinitialiserSeuil(newData.type);
    }
  }

  getCouleurAlerte(type: string, valeur: number): string {
    switch (type) {
      case "Température":
        return valeur > 38 ? "red" : valeur > 35 ? "orange" : "black";
      case "Humidité":
        return valeur > 70 ? "red" : valeur > 50 ? "orange" : "black";
      case "Qualité de l'air":
        return valeur < 50 ? "red" : valeur < 70 ? "orange" : "black";
      case "Bruit":
        return valeur > 85 ? "red" : valeur > 65 ? "orange" : "black";
      case "Electrocardiogramme":
        return (valeur < 50 || valeur > 120) ? "red"
             : (valeur < 60 || valeur > 100) ? "orange"
             : "black";
      default:
        return "black";
    }
  }
}
