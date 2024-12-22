import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { CapteurComponent } from './capteur/capteur.component';

const routes: Routes = [
  { path: '', component: CapteurComponent },
];

@NgModule({
  declarations: [AppComponent, CapteurComponent],
  imports: [
    BrowserModule,
    FormsModule,
    NgChartsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
