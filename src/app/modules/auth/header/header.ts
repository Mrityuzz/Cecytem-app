/* El componente AuthHeader en TypeScript se define con una propiedad de entrada para el título 
y la información de estilos.. */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class AuthHeader {
  @Input() titulo: string = 'Login'; 
}
