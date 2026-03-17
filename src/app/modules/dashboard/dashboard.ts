import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  credencial$: Observable<any> | null = null;
  currentYear: number = new Date().getFullYear();

  // ✅ usar inject en lugar de constructor directo
  private firestore = inject(Firestore);

  ngOnInit() {
    const numeroControl = localStorage.getItem('numeroControl');
    if (numeroControl) {
      const ref = doc(this.firestore, `alumnos/${numeroControl}`);
      this.credencial$ = docData(ref); 
    }
  }
}
