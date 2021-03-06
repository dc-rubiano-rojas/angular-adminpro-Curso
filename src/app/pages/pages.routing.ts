import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../guards/auth.guard';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PerfilComponent } from './perfil/perfil.component';

// Mantenimientos
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
import { MedicoComponent } from './mantenimientos/medicos/medico.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: PagesComponent,
        canActivate: [AuthGuard],
        children: [
          {path: '', component: DashboardComponent, data: {titulo: 'Dashboard'}},
          {path: 'progress', component: ProgressComponent, data: {titulo: 'Progress'}},
          {path: 'chart', component: Grafica1Component, data: {titulo: 'Chart'}},
          {path: 'account-settings', component: AccountSettingsComponent, data: {titulo: 'Account Setting'}},
          {path: 'promesas', component: PromesasComponent, data: {titulo: 'Promise'}},
          {path: 'rxjs', component: RxjsComponent, data: {titulo: 'RxJs'}},
          {path: 'profile', component: PerfilComponent, data: {titulo: 'User Profile'}},

          // Mantenimientos
          {path: 'usuarios', component: UsuariosComponent, data: {titulo: 'Mantenimiento Usuarios'}},
          {path: 'hospitales', component: HospitalesComponent, data: {titulo: 'Mantenimiento Hospitales'}},
          {path: 'medicos', component: MedicosComponent, data: {titulo: 'Mantenimiento Medicos'}},
          {path: 'medico/:id', component: MedicoComponent, data: {titulo: 'Mantenimiento Medicos'}},

        ]
      },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule{}
