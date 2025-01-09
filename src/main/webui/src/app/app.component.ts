import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

interface DataPoint {
  time: Date;
  value: number;
}

type CapteurKey = 'temperature' | 'humidite' | 'bruit' | 'qualiteAir';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'quinoa-angular';
  isMenuOpen = false;
  isSidebarCollapsed = false;
  selectedCapteur: CapteurKey | 'all' | null = null;
  selectedCapteurDetails: any = null;
  chart: Chart | null = null;
  capteursKeys: CapteurKey[] = ['temperature', 'humidite', 'bruit', 'qualiteAir'];
  charts: Record<string, Chart | null> = {};

  capteurs: Record<CapteurKey, { title: string; description: string; history: DataPoint[]; unit: string; min: number; max: number }> = {
    temperature: { title: 'Capteur de Température', description: 'Ce capteur mesure la température ambiante en temps réel.', history: [], unit: '°C', min: 20, max: 35 },
    humidite: { title: 'Capteur d\'Humidité', description: 'Ce capteur mesure le taux d\'humidité relative.', history: [], unit: '%', min: 30, max: 70 },
    bruit: { title: 'Capteur de Bruit', description: 'Ce capteur mesure le niveau sonore en décibels.', history: [], unit: 'dB', min: 40, max: 100 },
    qualiteAir: { title: 'Capteur de Qualité de l\'Air', description: 'Ce capteur évalue la qualité de l\'air.', history: [], unit: 'AQI', min: 0, max: 100 },
  };

  maxPoints = 50;

  ngOnInit(): void {
    setInterval(() => {
      this.addRandomDataPoints();
      if (this.selectedCapteur === 'all') {
        this.updateAllGraphs();
      } else {
        this.updateGraph();
      }
    }, 5000); // Rafraîchissement des données toutes les 5 secondes
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  goToHome() {
    this.selectedCapteur = null;
    this.selectedCapteurDetails = null;
  }

  selectCapteur(capteur: CapteurKey) {
    this.selectedCapteur = capteur;
    this.selectedCapteurDetails = this.capteurs[capteur];
    this.renderGraph();
  }

  showAllGraphs() {
    this.selectedCapteur = 'all';
    this.selectedCapteurDetails = null;
    setTimeout(() => {
      this.renderAllGraphs(); // Attendre que le DOM soit prêt
    }, 0);
  }

  renderGraph() {
    if (!this.selectedCapteur || this.selectedCapteur === 'all') return;

    const ctx = (document.getElementById('capteurChart') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;

    const capteur = this.capteurs[this.selectedCapteur];
    if (this.chart) {
      this.chart.destroy(); // Détruire l'ancien graphique
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: capteur.history.map((point: DataPoint) => point.time.toLocaleTimeString()),
        datasets: [
          {
            label: capteur.title,
            data: capteur.history.map((point: DataPoint) => point.value),
            backgroundColor: 'rgba(75,192,192,0.2)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 2,
            fill: 'origin',
            tension: 0.4,
            pointBackgroundColor: '#42A5F5',
          },
        ],
      },
      options: {
        responsive: true,
        animation: false,
        plugins: {
          legend: { display: true },
        },
        scales: {
          x: { title: { display: true, text: 'Temps' } },
          y: { title: { display: true, text: `Valeur (${capteur.unit})` }, beginAtZero: true },
        },
      },
    });
  }

  renderAllGraphs() {
    this.capteursKeys.forEach((capteurKey) => {
      const canvasElement = document.getElementById(`chart-${capteurKey}`) as HTMLCanvasElement;
      const ctx = canvasElement?.getContext('2d');
      if (!ctx) {
        console.error(`Canvas introuvable pour ${capteurKey}`);
        return;
      }

      const capteur = this.capteurs[capteurKey];
      if (this.charts[capteurKey]) {
        this.charts[capteurKey]?.destroy(); // Détruire l'ancien graphique pour éviter les doublons
      }

      this.charts[capteurKey] = new Chart(ctx, {
        type: 'line',
        data: {
          labels: capteur.history.map((point: DataPoint) => point.time.toLocaleTimeString()),
          datasets: [
            {
              label: capteur.title,
              data: capteur.history.map((point: DataPoint) => point.value),
              backgroundColor: 'rgba(75,192,192,0.2)',
              borderColor: 'rgba(75,192,192,1)',
              borderWidth: 2,
              fill: 'origin',
              tension: 0.4,
              pointBackgroundColor: '#42A5F5',
            },
          ],
        },
        options: {
          responsive: true,
          animation: false,
          plugins: {
            legend: { display: true },
          },
          scales: {
            x: { title: { display: true, text: 'Temps' } },
            y: { title: { display: true, text: `Valeur (${capteur.unit})` }, beginAtZero: true },
          },
        },
      });
    });
  }

  private addRandomDataPoints(): void {
    for (const capteurKey of this.capteursKeys) {
      const capteur = this.capteurs[capteurKey];
      const newValue = this.getRandomValue(capteur.min, capteur.max);
      const newPoint: DataPoint = { time: new Date(), value: newValue };

      capteur.history.push(newPoint);
      if (capteur.history.length > this.maxPoints) capteur.history.shift();
    }
  }

  private updateGraph(): void {
    if (this.selectedCapteur && this.selectedCapteur !== 'all' && this.chart) {
      const capteurData = this.capteurs[this.selectedCapteur];
      const labels = capteurData.history.map((point: DataPoint) => point.time.toLocaleTimeString());
      const data = capteurData.history.map((point: DataPoint) => point.value);

      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = data;
      this.chart.update('none');
    }
  }

  private updateAllGraphs(): void {
    this.capteursKeys.forEach((capteurKey) => {
      const chart = this.charts[capteurKey];
      const capteurData = this.capteurs[capteurKey];

      if (chart) {
        chart.data.labels = capteurData.history.map((point: DataPoint) => point.time.toLocaleTimeString());
        chart.data.datasets[0].data = capteurData.history.map((point: DataPoint) => point.value);
        chart.update('none');
      }
    });
  }

  private getRandomValue(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
