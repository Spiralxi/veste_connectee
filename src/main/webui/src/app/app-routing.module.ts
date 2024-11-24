import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CapteurComponent } from './capteur/capteur.component';

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'capteurs', component: CapteurComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
