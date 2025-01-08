import { Component, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'quinoa-angular';

  isMenuOpen = false;

  capteurs = {
    temperature: {
      title: 'Capteur de Température',
      description: 'Ce capteur mesure la température ambiante en temps réel.',
      history: [
        { date: '2024-01-01 12:00', value: 20 },
        { date: '2024-01-01 13:00', value: 21 },
        { date: '2024-01-01 14:00', value: 22 },
      ],
      unit: '°C',
    },
    humidite: {
      title: 'Capteur d\'Humidité',
      description: 'Ce capteur mesure le taux d\'humidité relative.',
      history: [
        { date: '2024-01-01 12:00', value: 50 },
        { date: '2024-01-01 13:00', value: 55 },
        { date: '2024-01-01 14:00', value: 60 },
      ],
      unit: '%',
    },
    bruit: {
      title: 'Capteur de Bruit',
      description: 'Ce capteur mesure le niveau sonore en décibels.',
      history: [
        { date: '2024-01-01 12:00', value: 30 },
        { date: '2024-01-01 13:00', value: 35 },
        { date: '2024-01-01 14:00', value: 40 },
      ],
      unit: 'dB',
    },
    qualiteAir: {
      title: 'Capteur de Qualité de l\'Air',
      description: 'Ce capteur évalue la qualité de l\'air.',
      history: [
        { date: '2024-01-01 12:00', value: 80 },
        { date: '2024-01-01 13:00', value: 90 },
        { date: '2024-01-01 14:00', value: 85 },
      ],
      unit: 'AQI',
    },
  };

  selectedCapteur: string | null = null;
  selectedCapteurDetails: any = null;
  chart: any;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  goToHome() {
    console.log('Retour à l\'accueil');
  }

  selectCapteur(capteur: keyof typeof this.capteurs) {
    this.selectedCapteur = capteur;
    this.selectedCapteurDetails = this.capteurs[capteur];
    this.renderGraph();
  }

  renderGraph() {
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = (document.getElementById('capteurChart') as HTMLCanvasElement).getContext('2d');
    this.chart = new Chart(ctx!, {
      type: 'line',
      data: {
        labels: this.selectedCapteurDetails.history.map((data: any) => data.date),
        datasets: [{
          label: this.selectedCapteurDetails.title,
          data: this.selectedCapteurDetails.history.map((data: any) => data.value),
          backgroundColor: 'rgba(33, 150, 243, 0.2)',
          borderColor: 'rgba(33, 150, 243, 1)',
          borderWidth: 2,
          pointBackgroundColor: '#1976d2',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        },
        scales: {
          x: { title: { display: true, text: 'Date' } },
          y: { title: { display: true, text: `Valeur (${this.selectedCapteurDetails.unit})` } },
        },
      }
    });
  }

  ngAfterViewInit() {
    this.renderGraph();
  }
}
