// notification.service.ts
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // Stocke l'état (si une alerte a déjà été lancée) par type de capteur
  private dernierSeuilCritique: { [key: string]: boolean } = {};

  constructor(private snackBar: MatSnackBar) {}

  afficherNotification(type: string, valeur: number, unite: string) {
    // Construction du message via template string
    const message = `⚠️ ${type} a atteint un seuil critique : ${valeur} ${unite}. Veuillez vérifier le capteur.`;

    // Si une notification pour ce capteur est déjà affichée (ou a été déclenchée), on ne la relance pas
    if (this.dernierSeuilCritique[type]) {
      return;
    }

    // Marquer comme déjà déclenché pour éviter le spam
    this.dernierSeuilCritique[type] = true;

    // Affichage de la notification avec une durée de 5 secondes et un bouton "Fermer"
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: ['notif-critique']
    });
  }

  // Réinitialise l'état du capteur lorsque la valeur repasse en seuil normal (orange ou noir)
  reinitialiserSeuil(type: string) {
    this.dernierSeuilCritique[type] = false;
  }
}
