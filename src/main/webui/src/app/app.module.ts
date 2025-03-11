import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CapteurComponent } from './capteur/capteur.component';

// 📌 Modules Angular Material
import { MatSnackBarModule } from '@angular/material/snack-bar';

// 📌 Ajout du module pour les graphiques
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
    declarations: [
        AppComponent,
        CapteurComponent
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule, // ✅ Requis pour Angular Material
        AppRoutingModule,
        NgxChartsModule, // 📊 Module pour les graphiques
        MatSnackBarModule // 📌 Module pour afficher les notifications
    ],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideAnimationsAsync()]
})
export class AppModule { }
