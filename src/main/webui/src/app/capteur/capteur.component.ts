import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';

interface DataPoint {
  time: Date;
  value: number;
}

@Component({
  selector: 'app-capteur',
  templateUrl: './capteur.component.html',
  styleUrls: ['./capteur.component.css'],
})
export class CapteurComponent implements OnInit {
  private allTemperatureData: DataPoint[] = [];
  private allHumidityData: DataPoint[] = [];
  private maxPoints = 50; // Nombre maximum de points conservés

  // Données pour le graphique de température
  public lineChartTemperatureData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Température',
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        fill: 'origin',
        tension: 0.4, // Ligne arrondie
      },
    ],
    labels: [],
  };

  // Données pour le graphique d'humidité
  public lineChartHumidityData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Humidité',
        backgroundColor: 'rgba(54,162,235,0.2)',
        borderColor: 'rgba(54,162,235,1)',
        fill: 'origin',
        tension: 0.4, // Ligne arrondie
      },
    ],
    labels: [],
  };

  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false, // Désactiver complètement les animations
    scales: {
      x: {
        type: 'category',
        ticks: {
          autoSkip: true,
          maxRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  public lineChartType: ChartType = 'line';

  public temperatureStartDate?: string;
  public temperatureEndDate?: string;
  public humidityStartDate?: string;
  public humidityEndDate?: string;

  ngOnInit(): void {
    // Mise à jour toutes les 5 secondes pour la température
    setInterval(() => this.addTemperatureDataPoint(), 5000);

    // Mise à jour toutes les 5 secondes pour l'humidité
    setInterval(() => this.addHumidityDataPoint(), 5000);
  }

  private addTemperatureDataPoint(): void {
    const newValue = this.getRandomTemperatureValue();
    const currentTime = new Date();

    this.allTemperatureData.push({ time: currentTime, value: newValue });

    if (this.allTemperatureData.length > this.maxPoints) {
      this.allTemperatureData.shift();
    }

    this.applyTemperatureFilter();
  }

  private addHumidityDataPoint(): void {
    const newValue = this.getRandomHumidityValue();
    const currentTime = new Date();

    this.allHumidityData.push({ time: currentTime, value: newValue });

    if (this.allHumidityData.length > this.maxPoints) {
      this.allHumidityData.shift();
    }

    this.applyHumidityFilter();
  }

  private getRandomTemperatureValue(): number {
    return Math.floor(Math.random() * (35 - 20 + 1)) + 20; // Température entre 20 et 35
  }

  private getRandomHumidityValue(): number {
    return Math.floor(Math.random() * (100 - 30 + 1)) + 30; // Humidité entre 30% et 100%
  }

  public applyTemperatureFilter(): void {
    let filteredPoints = this.allTemperatureData;

    if (this.temperatureStartDate && this.temperatureEndDate) {
      const start = new Date(this.temperatureStartDate).getTime();
      const end = new Date(this.temperatureEndDate).getTime();

      if (!isNaN(start) && !isNaN(end) && start <= end) {
        filteredPoints = this.allTemperatureData.filter((p) => {
          const t = p.time.getTime();
          return t >= start && t <= end;
        });
      }
    }

    this.lineChartTemperatureData = {
      ...this.lineChartTemperatureData,
      datasets: [
        {
          ...this.lineChartTemperatureData.datasets[0],
          data: filteredPoints.map((p) => p.value),
        },
      ],
      labels: filteredPoints.map((p) => p.time.toLocaleTimeString()),
    };
  }

  public applyHumidityFilter(): void {
    let filteredPoints = this.allHumidityData;

    if (this.humidityStartDate && this.humidityEndDate) {
      const start = new Date(this.humidityStartDate).getTime();
      const end = new Date(this.humidityEndDate).getTime();

      if (!isNaN(start) && !isNaN(end) && start <= end) {
        filteredPoints = this.allHumidityData.filter((p) => {
          const t = p.time.getTime();
          return t >= start && t <= end;
        });
      }
    }

    this.lineChartHumidityData = {
      ...this.lineChartHumidityData,
      datasets: [
        {
          ...this.lineChartHumidityData.datasets[0],
          data: filteredPoints.map((p) => p.value),
        },
      ],
      labels: filteredPoints.map((p) => p.time.toLocaleTimeString()),
    };
  }
}
