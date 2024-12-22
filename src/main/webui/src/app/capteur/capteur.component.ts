import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';

interface DataPoint {
  time: Date;
  temperature: number;
  humidity: number;
  noise: number;
  ecg: number; // Données ECG
}

@Component({
  selector: 'app-capteur',
  templateUrl: './capteur.component.html',
  styleUrls: ['./capteur.component.css'],
})
export class CapteurComponent implements OnInit {
  private allDataPoints: DataPoint[] = [];
  private maxPoints = 50; // Nombre maximum de points conservés

  // Données pour les diagrammes de ligne
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

  public lineChartDataECG: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'ECG',
        backgroundColor: 'rgba(75,75,192,0.2)',
        borderColor: 'rgba(75,75,192,1)',
        fill: 'origin',
        tension: 0.4,
      },
    ],
    labels: [],
  };

  // Données pour les diagrammes circulaires
  public gaugeChartDataAirQuality: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [50, 50],
        backgroundColor: ['#8E44AD', '#EAEDED'],
        hoverBackgroundColor: ['#8E44AD', '#EAEDED'],
        borderWidth: 0,
      },
    ],
    labels: ['Qualité de l\'air', 'Reste'],
  };

  public gaugeChartDataECG: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [70, 30],
        backgroundColor: ['#2E86C1', '#EAEDED'],
        hoverBackgroundColor: ['#2E86C1', '#EAEDED'],
        borderWidth: 0,
      },
    ],
    labels: ['Fréquence moyenne ECG', 'Reste'],
  };

  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
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
  public ecgStartDate?: string;
  public ecgEndDate?: string;

  ngOnInit(): void {
    setInterval(() => {
      this.addDataPoint();
      this.updateAirQualityData();
      this.updateECGAverageData();
    }, 5000);
  }

  private addDataPoint(): void {
    const newTemperature = this.getRandomValue(20, 35);
    const newHumidity = this.getRandomValue(30, 70);
    const newNoise = this.getRandomValue(40, 100);
    const newECG = this.getRandomValue(60, 100);
    const currentTime = new Date();

    this.allDataPoints.push({
      time: currentTime,
      temperature: newTemperature,
      humidity: newHumidity,
      noise: newNoise,
      ecg: newECG,
    });

    if (this.allDataPoints.length > this.maxPoints) {
      this.allDataPoints.shift();
    }

    this.applyCustomFilter('temperature');
    this.applyCustomFilter('humidity');
    this.applyCustomFilter('noise');
    this.applyCustomFilter('ecg');
  }

  private updateAirQualityData(): void {
    const newAirQuality = this.getRandomValue(0, 100);
    this.gaugeChartDataAirQuality = {
      datasets: [
        {
          data: [newAirQuality, 100 - newAirQuality],
          backgroundColor: ['#8E44AD', '#EAEDED'],
          hoverBackgroundColor: ['#8E44AD', '#EAEDED'],
          borderWidth: 0,
        },
      ],
      labels: ['Qualité de l\'air', 'Reste'],
    };
  }

  private updateECGAverageData(): void {
    const ecgValues = this.allDataPoints.map((p) => p.ecg);
    const averageECG = ecgValues.reduce((a, b) => a + b, 0) / ecgValues.length || 0;

    this.gaugeChartDataECG = {
      datasets: [
        {
          data: [averageECG, 100 - averageECG],
          backgroundColor: ['#2E86C1', '#EAEDED'],
          hoverBackgroundColor: ['#2E86C1', '#EAEDED'],
          borderWidth: 0,
        },
      ],
      labels: ['Fréquence moyenne ECG', 'Reste'],
    };
  }

  private getRandomValue(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public applyCustomFilter(type: 'temperature' | 'humidity' | 'noise' | 'ecg'): void {
    let filteredPoints = this.allDataPoints;

    let startDate: number = 0;
    let endDate: number = Infinity;

    if (type === 'temperature') {
      startDate = this.temperatureStartDate
        ? new Date(this.temperatureStartDate).getTime()
        : 0;
      endDate = this.temperatureEndDate
        ? new Date(this.temperatureEndDate).getTime()
        : Infinity;
    } else if (type === 'humidity') {
      startDate = this.humidityStartDate
        ? new Date(this.humidityStartDate).getTime()
        : 0;
      endDate = this.humidityEndDate
        ? new Date(this.humidityEndDate).getTime()
        : Infinity;
    } else if (type === 'noise') {
      startDate = this.noiseStartDate
        ? new Date(this.noiseStartDate).getTime()
        : 0;
      endDate = this.noiseEndDate
        ? new Date(this.noiseEndDate).getTime()
        : Infinity;
    } else if (type === 'ecg') {
      startDate = this.ecgStartDate
        ? new Date(this.ecgStartDate).getTime()
        : 0;
      endDate = this.ecgEndDate
        ? new Date(this.ecgEndDate).getTime()
        : Infinity;
    }

    filteredPoints = this.allDataPoints.filter((p) => {
      const t = p.time.getTime();
      return t >= startDate && t <= endDate;
    });

    const chartData = filteredPoints.map((p) =>
      type === 'temperature'
        ? p.temperature
        : type === 'humidity'
        ? p.humidity
        : type === 'noise'
        ? p.noise
        : p.ecg
    );

    const chartLabels = filteredPoints.map((p) => p.time.toLocaleTimeString());

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
    } else if (type === 'ecg') {
      this.lineChartDataECG = {
        ...this.lineChartDataECG,
        datasets: [
          {
            ...this.lineChartDataECG.datasets[0],
            data: chartData,
          },
        ],
        labels: chartLabels,
      };
    }
  }
}
