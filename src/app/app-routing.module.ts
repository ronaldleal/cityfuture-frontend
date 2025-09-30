import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Guards temporalmente deshabilitados
// import { AuthGuard } from './guards/auth.guard';
// import { ArquitectoGuard } from './guards/arquitecto.guard';

// Componentes
import { LoginComponent } from './components/login/login.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { ConstructionListComponent } from './components/construction-list/construction-list.component';
import { ConstructionFormComponent } from './components/construction-form/construction-form.component';
import { MaterialListComponent } from './components/material-list/material-list.component';
import { MaterialFormComponent } from './components/material-form/material-form.component';
import { ReportsDashboardComponent } from './components/reports-dashboard/reports-dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // Rutas temporalmente sin protección para pruebas
  {
    path: 'dashboard',
    component: ReportsDashboardComponent
    // canActivate: [AuthGuard] // Comentado temporalmente
  },
  {
    path: 'constructions',
    component: ConstructionListComponent
    // canActivate: [AuthGuard] // Comentado temporalmente
  },
  {
    path: 'constructions/new',
    component: ConstructionFormComponent
    // canActivate: [ArquitectoGuard] // Comentado temporalmente
  },
  {
    path: 'constructions/:id/edit',
    component: ConstructionFormComponent
    // canActivate: [ArquitectoGuard] // Comentado temporalmente
  },
  {
    path: 'materials',
    component: MaterialListComponent
    // canActivate: [AuthGuard] // Comentado temporalmente
  },
  {
    path: 'materials/new',
    component: MaterialFormComponent
    // canActivate: [ArquitectoGuard] // Comentado temporalmente
  },
  {
    path: 'materials/:id/edit',
    component: MaterialFormComponent
    // canActivate: [ArquitectoGuard] // Comentado temporalmente
  },

  // Página de no autorizado
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },

  // Ruta comodín - debe ir al final
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }