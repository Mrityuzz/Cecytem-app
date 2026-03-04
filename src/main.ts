import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,   // ✅ carga configuración global (router, zone, etc.)
    provideHttpClient()       // ✅ habilita HttpClient en toda la app
  ]
}).catch(err => console.error(err));
