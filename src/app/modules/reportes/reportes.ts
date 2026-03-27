import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReportesService } from './reportes.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './reportes.html',
  styleUrls: ['./reportes.scss'],
})
export class ReportesComponent implements OnInit {
  totalEntradas = 0;
  totalSalidas = 0;
  promedioEntradas = 0;
  promedioSalidas = 0;

  registrosSheets: { numero_control: string; entrada: string; salida: string; veces: string }[] = [];
  registrosFirebase: any[] = [];
  alumnoActual: string = ''; // Se asigna dinámicamente según el login

  constructor(private reportesService: ReportesService) {}

  ngOnInit(): void {
    this.alumnoActual = localStorage.getItem('numero_control') || '';

    // 🔹 Google Sheets
    this.reportesService.obtenerDatosReportes().subscribe({
      next: (rows) => {
        this.registrosSheets = rows.filter(r => r.numero_control === this.alumnoActual);

        const entradas = this.registrosSheets.filter((r) => r.entrada);
        const salidas = this.registrosSheets.filter((r) => r.salida);

        this.totalEntradas = entradas.length;
        this.totalSalidas = salidas.length;

        const diasEntradas = [...new Set(entradas.map((e) => e.entrada.split(' ')[0]))];
        const diasSalidas = [...new Set(salidas.map((s) => s.salida.split(' ')[0]))];

        this.promedioEntradas =
          diasEntradas.length > 0 ? +(this.totalEntradas / diasEntradas.length).toFixed(1) : 0;

        this.promedioSalidas =
          diasSalidas.length > 0 ? +(this.totalSalidas / diasSalidas.length).toFixed(1) : 0;

        this.generarGraficaEntradasSalidas();
      },
      error: (err) => console.error('Error al cargar estadísticas de Sheets:', err),
    });

    //  Firebase
    this.reportesService.obtenerHistorial(this.alumnoActual).subscribe({
      next: (historial) => {
        this.registrosFirebase = historial;
      },
      error: (err) => console.error('Error al cargar historial de Firebase:', err),
    });
  }

  generarGraficaEntradasSalidas() {
    const ctx = document.getElementById('graficaEntradasSalidas') as HTMLCanvasElement;
    if (!ctx) return;

    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const colorEntradas = '#00ff99';
    const colorSalidas = '#f44336';
    const tituloColor = isDarkMode ? '#00ff99' : '#008000';
    const legendColor = isDarkMode ? '#eee' : '#333';

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Entradas', 'Salidas'],
        datasets: [
          {
            data: [this.totalEntradas, this.totalSalidas],
            backgroundColor: [colorEntradas, colorSalidas],
            borderColor: '#fff',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: legendColor, font: { size: 12 } },
          },
          title: {
            display: true,
            text: 'Distribución de Entradas vs Salidas (Sheets)',
            color: tituloColor,
            font: { size: 14, weight: 'bold' },
          },
        },
      },
    });
  }

  //  Convierte string "YYYY-MM-DD" a "DD/MM/AAAA"
  private formatearFecha(fecha: any): string {
    if (!fecha) return '-';
    if (typeof fecha === 'string') {
      const partes = fecha.split('-'); // ["2026","03","27"]
      if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`; // "27/03/2026"
      }
    }
    return String(fecha);
  }

  descargarPDF() {
    const doc = new jsPDF();
    const logoPath = 'assets/logo/CECYTEM.png';
    const img = new Image();
    img.src = logoPath;

    img.onload = () => {
      doc.addImage(img, 'PNG', 14, 10, 30, 20);

      doc.setFontSize(16);
      doc.setTextColor('#FF6600');
      doc.text('CECyTE Michoacán', 50, 20);

      doc.setFontSize(12);
      doc.setTextColor('#008000');
      doc.text(`Reporte de Asistencia - Alumno ${this.alumnoActual}`, 50, 28);

      const fecha = new Date().toLocaleDateString('es-MX');
      doc.setFontSize(10);
      doc.setTextColor('#000');
      doc.text(`Fecha: ${fecha}`, 14, 40);

      //  Tabla de estadísticas (Google Sheets)
      autoTable(doc, {
        startY: 45,
        head: [['Total Entradas', 'Total Salidas', 'Promedio Entradas', 'Promedio Salidas']],
        body: [
          [this.totalEntradas, this.totalSalidas, this.promedioEntradas, this.promedioSalidas],
        ],
        styles: { halign: 'center' },
        headStyles: { fillColor: '#008000', textColor: '#fff', fontStyle: 'bold' },
        bodyStyles: { fillColor: '#f9f9f9' },
      });

      //  Tabla de registros (Google Sheets)
      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [['Entrada', 'Salida', 'Veces']],
        body: this.registrosSheets.map((r) => [r.entrada, r.salida, r.veces]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: '#FF6600', textColor: '#fff', fontStyle: 'bold' },
        bodyStyles: { fillColor: '#fff' },
      });

      //  Tabla de historial (Firebase con fecha como string)
      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [['Fecha', 'Hora', 'Tipo']],
        body: this.registrosFirebase.map((r) => [
          this.formatearFecha(r.fecha),   //  convierte "2026-03-27" a "27/03/2026"
          r.hora || '-', 
          r.tipo || '-'
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: '#008000', textColor: '#fff', fontStyle: 'bold' },
        bodyStyles: { fillColor: '#fff' },
      });

      doc.setFontSize(10);
      doc.setTextColor('#555');
      doc.text(
        'CECyTE Michoacán - Plantel 12 Morelia | Reporte automático',
        14,
        doc.internal.pageSize.height - 10,
      );

      doc.save(`reporte-${this.alumnoActual}.pdf`);
    };
  }
}
