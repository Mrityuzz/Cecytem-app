#  CECYTEM-APP-ASISTENCIAS

##  Descripción
Aplicación Angular desarrollada para la gestión de **asistencias y reportes estudiantiles** en el CECyTEM Plantel 12 Morelia.  
Integra **Firebase** (Auth, Firestore, Storage), **Google Sheets API**, generación de **gráficos** y exportación de reportes a **PDF**.  

##  Requisitos
- Node.js (versión LTS recomendada)  
- Angular CLI  
- Cuenta de Firebase configurada con autenticación y Firestore  
- API de Google Sheets habilitada  

##  Instalación

Instalación de Node.js
Ve a la página oficial de Node.js.

Descarga la versión LTS (Long Term Support) recomendada.

Instálala con el asistente (incluye npm automáticamente).

Verifica la instalación en la terminal:

```bash
node -v
npm -v

Instalación de Angular CLI
Una vez instalado Node.js, abre la terminal.

Instala Angular CLI globalmente:

bash
npm install -g @angular/cli
Verifica la instalación:

bash
ng version

```bash
git clone https://github.com/Mrityuzz/Cecytem-app.git
cd Cecytem-app
npm install

##  Ejecución
```bash
npm start

La aplicación estará disponible en: http://localhost:4200/

## Estructura principal
src/app/dashboard → Módulo y componente para credenciales de usuario

src/app/reportes → Módulo, servicio y componente de reportes de asistencia

src/app/alumno → Servicio para datos de alumnos desde Firestore

src/app/auth → Servicio de autenticación con AngularFire (login/logout)

src/app/app.component.ts → Componente raíz que gestiona título, layout y navegación

## Funcionalidades
 Autenticación con correo y contraseña (Firebase Auth)

 Consulta de credenciales desde Firestore

 Reportes de asistencia con estadísticas y gráficos (Chart.js)

 Exportación de reportes a PDF (jsPDF + autotable)

 Integración con Google Sheets para historial

 Uso de fuentes de íconos (Font Awesome) para interfaz más clara

## Dependencias principales
Angular 20.x → Framework base

@angular/fire → Integración con Firebase

Firebase → SDK oficial

RxJS → Librería de programación reactiva

Chart.js → Gráficos estadísticos

jsPDF / jspdf-autotable → Exportación de reportes a PDF

Font Awesome → Íconos en la interfaz

Alta de API Key en Google Cloud (para Google Sheets)
Ingresa a la Google Cloud Console.

Crea un nuevo proyecto (ejemplo: cecytem-asistencias).

Ve a APIs & Services → Library.

## Habilita la Google Sheets API.

Ve a APIs & Services → Credentials.

Crea una nueva credencial → selecciona API Key.

Copia la API Key generada.

Pega la API Key en tu archivo environment.ts de Angular:

ts
export const environment = {
  production: false,
  googleSheetsApiKey: "TU_API_KEY"
};
(Opcional) Restringe la API Key para mayor seguridad:

Limita el uso a tu dominio o aplicación.

Configura permisos solo para la Google Sheets API.

##  Configuración de Firebase

Para que la aplicación funcione correctamente, es necesario configurar un proyecto en Firebase:

1. **Crear proyecto en Firebase Console**  
   - Ingresa a [Firebase Console](https://console.firebase.google.com/)  
   - Crea un nuevo proyecto y habilita Google Analytics si lo requieres.

2. **Habilitar Authentication**  
   - Ve a la sección *Authentication*.  
   - Activa el método de inicio de sesión con **correo y contraseña**.  
   - Opcional: agrega otros métodos de autenticación si lo deseas.

3. **Configurar Firestore Database**  
   - Ve a *Firestore Database*.  
   - Crea una base de datos en modo producción.  
   - Define las colecciones necesarias, por ejemplo:  
     - `alumnos` → datos de los estudiantes.  
     - `asistencias` → registros de entradas y salidas.  

4. **Configurar Storage**  
   - Ve a *Storage*.  
   - Crea un bucket para almacenar fotos de alumnos y credenciales digitales.  
   - Ajusta las reglas de seguridad para permitir lectura/escritura autenticada.

5. **Descargar archivo de configuración**  
   - En *Project Settings* → *General*, selecciona tu aplicación web.  
   - Copia el objeto de configuración de Firebase (`apiKey`, `authDomain`, `projectId`, etc.).  
   - Pega estos valores en tu archivo `environment.ts` de Angular:

   ```ts
   export const environment = {
     production: false,
     firebaseConfig: {
       apiKey: "TU_API_KEY",
       authDomain: "TU_PROJECT.firebaseapp.com",
       projectId: "TU_PROJECT_ID",
       storageBucket: "TU_PROJECT.appspot.com",
       messagingSenderId: "TU_SENDER_ID",
       appId: "TU_APP_ID"
     }
   };

## Scripts disponibles
```bash
npm start        # Ejecuta la app en modo desarrollo (ng serve)
npm run build    # Compila la app para producción
npm run watch    # Compila en modo desarrollo y observa cambios
npm test         # Ejecuta pruebas unitarias

##  Instalación en Android (APK)
Para generar el APK desde Angular + Capacitor:

```bash
ng build --configuration production
npx cap copy android
npx cap open android

## En Android Studio:
Build → Build Bundle(s) / APK(s) → Build APK(s)  
El APK estará disponible en android/app/build/outputs/apk/

##  Estado del proyecto
Este proyecto se encuentra en desarrollo activo y se utiliza como parte de la gestión institucional en el **CECyTEM Plantel 12 Morelia**.  
Se busca mantener la aplicación modular, escalable y alineada con los estándares académicos y tecnológicos.

---

 Gracias por revisar este proyecto.  
El objetivo es ofrecer una herramienta confiable y moderna para la **gestión de asistencias y reportes estudiantiles**, integrando tecnologías web y móviles con Firebase y Google Sheets.
