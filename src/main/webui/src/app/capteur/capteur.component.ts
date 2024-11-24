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

  constructor(private capteurService: CapteurService) { }

  ngOnInit(): void {
    this.getCapteurs();
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
}
