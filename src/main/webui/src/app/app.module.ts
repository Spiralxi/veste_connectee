import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // ✅ Ajouté pour résoudre @animationState
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CapteurComponent } from './capteur/capteur.component';

// 📌 Ajout de l'import pour NgxChartsModule
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
    declarations: [
        AppComponent,
        CapteurComponent
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule, // ✅ Ajouté ici pour activer les animations
        AppRoutingModule,
        NgxChartsModule // 📊 Module pour les graphiques
    ],
    providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule { }
