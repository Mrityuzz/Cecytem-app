/* La clase HeaderComponent es un componente de Angular con una propiedad de entrada para el título del módulo. */
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  standalone: true,
  imports: [RouterModule]
})
export class HeaderComponent {
  @Input() tituloModulo: string = ''; 
}
