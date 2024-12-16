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
  private allDataPoints: DataPoint[] = [];
  private maxPoints = 50; // Nombre maximum de points conservés

  public lineChartData: ChartConfiguration['data'] = {
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

  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutCubic'
    },
    scales: {
      x: {
        type: 'category',
        ticks: {
          autoSkip: true,
          maxRotation: 0
        }
      },
      y: {
        beginAtZero: true
      }
    }
  };

  public lineChartType: ChartType = 'line';

  public startDate?: string;
  public endDate?: string;

  ngOnInit(): void {
    // Mise à jour toutes les 5 secondes
    setInterval(() => this.addDataPoint(), 5000);
  }

  private addDataPoint(): void {
    const newValue = this.getRandomValue();
    const currentTime = new Date();

    this.allDataPoints.push({ time: currentTime, value: newValue });

    // Si le nombre de points dépasse maxPoints, on enlève le plus ancien
    if (this.allDataPoints.length > this.maxPoints) {
      this.allDataPoints.shift();
    }

    this.applyCustomFilter();
  }

  private getRandomValue(): number {
    return Math.floor(Math.random() * (35 - 20 + 1)) + 20;
  }

  public applyCustomFilter(): void {
    let filteredPoints = this.allDataPoints;

    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate).getTime();
      const end = new Date(this.endDate).getTime();

      if (isNaN(start) || isNaN(end)) {
        console.warn("Dates invalides, utilisez le widget de sélection de date/heure.");
        filteredPoints = [];
      } else if (start > end) {
        console.warn('La date de début est supérieure à la date de fin.');
        filteredPoints = [];
      } else {
        filteredPoints = this.allDataPoints.filter(p => {
          const t = p.time.getTime();
          return t >= start && t <= end;
        });
      }
    }

    this.lineChartData = {
      ...this.lineChartData,
      datasets: [
        {
          ...this.lineChartData.datasets[0],
          data: filteredPoints.map((p) => p.value),
        },
      ],
      labels: filteredPoints.map((p) => p.time.toLocaleTimeString()),
    };
  }
}
