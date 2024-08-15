import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LobbyComponent } from './lobby/lobby.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'lobby', component: LobbyComponent }
];

//@NgModule({
//  imports: [RouterModule.forRoot(routes)],
//  exports: [RouterModule]
//})
//export class AppRoutingModule { }
