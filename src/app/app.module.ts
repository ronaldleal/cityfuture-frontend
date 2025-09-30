import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiService } from './services/api.service';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { ConstructionListComponent } from './components/construction-list/construction-list.component';
import { ConstructionFormComponent } from './components/construction-form/construction-form.component';
import { MaterialListComponent } from './components/material-list/material-list.component';
import { MaterialFormComponent } from './components/material-form/material-form.component';
import { StockAlertsComponent } from './components/stock-alerts/stock-alerts.component';
import { MaterialRequirementsComponent } from './components/material-requirements/material-requirements.component';
import { ReportsDashboardComponent } from './components/reports-dashboard/reports-dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';

@NgModule({
  declarations: [
    AppComponent,
    ConstructionListComponent,
    ConstructionFormComponent,
    MaterialListComponent,
    MaterialFormComponent,
    StockAlertsComponent,
    MaterialRequirementsComponent,
    ReportsDashboardComponent,
    LoginComponent,
    UnauthorizedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }