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
  selectedCapteur: CapteurKey | null = null;
  selectedCapteurDetails: any = null; // Détails du capteur sélectionné
  chart: Chart | null = null;

  capteurs: Record<CapteurKey, { title: string; description: string; history: DataPoint[]; unit: string; min: number; max: number }> = {
    temperature: {
      title: 'Capteur de Température',
      description: 'Ce capteur mesure la température ambiante en temps réel.',
      history: [],
      unit: '°C',
      min: 20,
      max: 35,
    },
    humidite: {
      title: 'Capteur d\'Humidité',
      description: 'Ce capteur mesure le taux d\'humidité relative.',
      history: [],
      unit: '%',
      min: 30,
      max: 70,
    },
    bruit: {
      title: 'Capteur de Bruit',
      description: 'Ce capteur mesure le niveau sonore en décibels.',
      history: [],
      unit: 'dB',
      min: 40,
      max: 100,
    },
    qualiteAir: {
      title: 'Capteur de Qualité de l\'Air',
      description: 'Ce capteur évalue la qualité de l\'air.',
      history: [],
      unit: 'AQI',
      min: 0,
      max: 100,
    },
  };

  maxPoints = 50;

  ngOnInit(): void {
    setInterval(() => {
      this.addRandomDataPoints(); // Ajouter des données aléatoires
      this.updateGraph(); // Mettre à jour le graphique
    }, 5000); // Intervalle d'ajout de données (5 secondes)
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  goToHome() {
    this.selectedCapteur = null; // Retour à l'accueil
    this.selectedCapteurDetails = null; // Réinitialiser les détails
  }

  selectCapteur(capteur: CapteurKey) {
    this.selectedCapteur = capteur;
    this.selectedCapteurDetails = this.capteurs[capteur]; // Récupération des détails du capteur

    if (this.chart) {
      this.chart.data.datasets[0].label = this.selectedCapteurDetails.title;
      this.updateGraph(); // Mettre à jour les données du graphique
    } else {
      this.renderGraph(); // Créer le graphique si ce n'est pas encore fait
    }
  }

  renderGraph() {
    if (!this.selectedCapteur) return;

    const ctx = (document.getElementById('capteurChart') as HTMLCanvasElement).getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: this.capteurs[this.selectedCapteur].title,
            data: [],
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
          y: {
            title: { display: true, text: `Valeur (${this.capteurs[this.selectedCapteur].unit})` },
            beginAtZero: true,
          },
        },
      },
    });
  }

  private addRandomDataPoints(): void {
    for (const capteurKey in this.capteurs) {
      const capteur = this.capteurs[capteurKey as CapteurKey];
      const newValue = this.getRandomValue(capteur.min, capteur.max);
      const newPoint: DataPoint = {
        time: new Date(),
        value: newValue,
      };

      capteur.history.push(newPoint);

      if (capteur.history.length > this.maxPoints) {
        capteur.history.shift(); // Supprimer les points les plus anciens
      }
    }
  }

  private updateGraph(): void {
    if (this.selectedCapteur && this.chart) {
      const capteurData = this.capteurs[this.selectedCapteur];
      const labels = capteurData.history.map((point: DataPoint) => point.time.toLocaleTimeString());
      const data = capteurData.history.map((point: DataPoint) => point.value);

      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = data;

      this.chart.update('none'); // Mise à jour
    }
  }

  private getRandomValue(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
