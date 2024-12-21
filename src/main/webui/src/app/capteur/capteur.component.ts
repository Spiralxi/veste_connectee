import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';

interface DataPoint {
  time: Date;
  temperature: number;
  humidity: number;
  noise: number;
}

@Component({
  selector: 'app-capteur',
  templateUrl: './capteur.component.html',
  styleUrls: ['./capteur.component.css'],
})
export class CapteurComponent implements OnInit {
  private allDataPoints: DataPoint[] = [];
  private maxPoints = 50; // Nombre maximum de points conservés

  public lineChartDataTemperature: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Température',
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        fill: 'origin',
        tension: 0.4,
      },
    ],
    labels: [],
  };

  public lineChartDataHumidity: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Humidité',
        backgroundColor: 'rgba(192,75,192,0.2)',
        borderColor: 'rgba(192,75,192,1)',
        fill: 'origin',
        tension: 0.4,
      },
    ],
    labels: [],
  };

  public lineChartDataNoise: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Bruit',
        backgroundColor: 'rgba(192,192,75,0.2)',
        borderColor: 'rgba(192,192,75,1)',
        fill: 'origin',
        tension: 0.4,
      },
    ],
    labels: [],
  };

  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false, // Désactiver les animations
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
  public noiseStartDate?: string;
  public noiseEndDate?: string;

  ngOnInit(): void {
    // Mise à jour toutes les 5 secondes
    setInterval(() => this.addDataPoint(), 5000);
  }

  private addDataPoint(): void {
    const newTemperature = this.getRandomValue(20, 35);
    const newHumidity = this.getRandomValue(30, 70);
    const newNoise = this.getRandomValue(40, 100);
    const currentTime = new Date();

    this.allDataPoints.push({
      time: currentTime,
      temperature: newTemperature,
      humidity: newHumidity,
      noise: newNoise,
    });

    if (this.allDataPoints.length > this.maxPoints) {
      this.allDataPoints.shift();
    }

    this.applyCustomFilter('temperature');
    this.applyCustomFilter('humidity');
    this.applyCustomFilter('noise');
  }

  private getRandomValue(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public applyCustomFilter(type: 'temperature' | 'humidity' | 'noise'): void {
    let filteredPoints = this.allDataPoints;

    let startDate: number | undefined;
    let endDate: number | undefined;

    if (type === 'temperature') {
      startDate = this.temperatureStartDate
        ? new Date(this.temperatureStartDate).getTime()
        : undefined;
      endDate = this.temperatureEndDate
        ? new Date(this.temperatureEndDate).getTime()
        : undefined;
    } else if (type === 'humidity') {
      startDate = this.humidityStartDate
        ? new Date(this.humidityStartDate).getTime()
        : undefined;
      endDate = this.humidityEndDate
        ? new Date(this.humidityEndDate).getTime()
        : undefined;
    } else if (type === 'noise') {
      startDate = this.noiseStartDate
        ? new Date(this.noiseStartDate).getTime()
        : undefined;
      endDate = this.noiseEndDate
        ? new Date(this.noiseEndDate).getTime()
        : undefined;
    }

    if (startDate !== undefined && endDate !== undefined) {
      filteredPoints = this.allDataPoints.filter((p) => {
        const t = p.time.getTime();
        return t >= (startDate ?? 0) && t <= (endDate ?? Infinity);
      });
    }

    const chartData = filteredPoints.map((p) =>
      type === 'temperature'
        ? p.temperature
        : type === 'humidity'
        ? p.humidity
        : p.noise
    );

    const chartLabels = filteredPoints.map((p) =>
      p.time.toLocaleTimeString()
    );

    if (type === 'temperature') {
      this.lineChartDataTemperature = {
        ...this.lineChartDataTemperature,
        datasets: [
          {
            ...this.lineChartDataTemperature.datasets[0],
            data: chartData,
          },
        ],
        labels: chartLabels,
      };
    } else if (type === 'humidity') {
      this.lineChartDataHumidity = {
        ...this.lineChartDataHumidity,
        datasets: [
          {
            ...this.lineChartDataHumidity.datasets[0],
            data: chartData,
          },
        ],
        labels: chartLabels,
      };
    } else if (type === 'noise') {
      this.lineChartDataNoise = {
        ...this.lineChartDataNoise,
        datasets: [
          {
            ...this.lineChartDataNoise.datasets[0],
            data: chartData,
          },
        ],
        labels: chartLabels,
      };
    }
  }
}
