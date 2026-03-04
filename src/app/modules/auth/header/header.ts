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
