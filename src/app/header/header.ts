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
