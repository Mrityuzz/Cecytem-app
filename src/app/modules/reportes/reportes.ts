import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReportesService } from './reportes.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Chart, registerables } from 'chart.js';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
Chart.register(...registerables);

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
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
  alumnoActual: string = '';
  nombreAlumno: string = '';

  mesSeleccionado: number = new Date().getMonth() + 1;
  anioSeleccionado: number = new Date().getFullYear();

  private auth = inject(Auth);

  constructor(private reportesService: ReportesService) {}

  ngOnInit(): void {
    onAuthStateChanged(this.auth, user => {
      if (user?.email) {
        this.alumnoActual = user.email.split('@')[0];

        this.reportesService.obtenerDatosReportes().subscribe({
          next: (rows) => {
            this.registrosSheets = rows.filter(r => r.numero_control === this.alumnoActual);
            this.recalcularEstadisticas(this.registrosSheets);
            this.generarGraficaEntradasSalidas();
          },
          error: (err) => console.error('Error al cargar estadísticas de Sheets:', err),
        });

        this.reportesService.obtenerHistorial(this.alumnoActual).subscribe({
          next: (historial) => {
            this.registrosFirebase = historial;
          },
          error: (err) => console.error('Error al cargar historial de Firebase:', err),
        });

        this.reportesService.getAlumno(this.alumnoActual).subscribe({
          next: (alumno) => {
            this.nombreAlumno = alumno?.nombre || '';
          },
          error: (err) => console.error('Error al cargar datos del alumno:', err),
        });
      }
    });
  }

  private recalcularEstadisticas(registros: any[]) {
    const entradas = registros.filter(r => r.entrada);
    const salidas = registros.filter(r => r.salida);

    this.totalEntradas = entradas.length;
    this.totalSalidas = salidas.length;

    const diasEntradas = [...new Set(entradas.map(e => e.entrada.split(' ')[0]))];
    const diasSalidas = [...new Set(salidas.map(s => s.salida.split(' ')[0]))];

    this.promedioEntradas = diasEntradas.length > 0 ? +(this.totalEntradas / diasEntradas.length).toFixed(1) : 0;
    this.promedioSalidas = diasSalidas.length > 0 ? +(this.totalSalidas / diasSalidas.length).toFixed(1) : 0;
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

  private formatearFecha(fecha: any): string {
    if (!fecha) return '-';
    if (typeof fecha === 'string') {
      const partes = fecha.split('-');
      if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
      }
    }
    return String(fecha);
  }

  private filtrarPorMes(registros: any[]): any[] {
    return registros.filter(r => {
      const fechaStr = r.entrada || r.fecha;
      if (!fechaStr) return false;
      const soloFecha = fechaStr.split(' ')[0];
      const partes = soloFecha.split('-');
      if (partes.length !== 3) return false;
      const anio = Number(partes[0]);
      const mes = Number(partes[1]);
      return anio === this.anioSeleccionado && mes === this.mesSeleccionado;
    });
  }

  private calcularPromediosDesdeFirebase(registros: any[]) {
    const entradas = registros.filter(r => r.tipo === 'entrada');
    const salidas = registros.filter(r => r.tipo === 'salida');
    const diasEntradas = [...new Set(entradas.map(e => e.fecha))];
    const diasSalidas = [...new Set(salidas.map(s => s.fecha))];
    const totalEntradas = entradas.length;
    const totalSalidas = salidas.length;
    const promEntradas = diasEntradas.length > 0 ? +(totalEntradas / diasEntradas.length).toFixed(1) : 0;
    const promSalidas = diasSalidas.length > 0 ? +(totalSalidas / diasSalidas.length).toFixed(1) : 0;
    return { totalEntradas, totalSalidas, promEntradas, promSalidas };
  }

  descargarPDF() {
    const doc = new jsPDF();
    const logoPath = 'assets/logo/CECYTEM.png';
    const img = new Image();
    img.src = logoPath;

    const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

    img.onload = () => {
      doc.addImage(img, 'PNG', 14, 10, 30, 20);
      doc.setFontSize(16);
      doc.setTextColor('#FF6600');
      doc.text('CECyTE Michoacán', 50, 20);
      doc.setFontSize(12);
      doc.setTextColor('#008000');
      doc.text(`Reporte de Asistencia - ${meses[this.mesSeleccionado - 1]} ${this.anioSeleccionado}`, 50, 28);
      doc.setFontSize(11);
      doc.setTextColor('#FF6600');
      doc.text(`Alumno: ${this.nombreAlumno} - ${this.alumnoActual}`, 50, 34);
      const fecha = new Date().toLocaleDateString('es-MX');
      doc.setFontSize(10);
      doc.setTextColor('#008000');
      doc.text(`Fecha: ${fecha}`, 14, 40);

      const registrosFirebaseFiltrados = this.filtrarPorMes(this.registrosFirebase);
      const { totalEntradas, totalSalidas, promEntradas, promSalidas } = this.calcularPromediosDesdeFirebase(registrosFirebaseFiltrados);

      autoTable(doc, {
        startY: 50,
        head: [['Total Entradas', 'Total Salidas', 'Promedio Entradas', 'Promedio Salidas']],
        body: [[totalEntradas, totalSalidas, promEntradas, promSalidas]],
        styles: { halign: 'center' },
        headStyles: { fillColor: '#008000', textColor: '#fff', fontStyle: 'bold' },
        bodyStyles: { fillColor: '#f9f9f9' },
      });

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [['Fecha', 'Hora', 'Tipo']],
        body: registrosFirebaseFiltrados.map(r => [this.formatearFecha(r.fecha), r.hora || '-', r.tipo || '-']),
        styles: { fontSize: 9 },
        headStyles: { fillColor: '#008000', textColor: '#fff', fontStyle: 'bold' },
        bodyStyles: { fillColor: '#fff' },
      });
      doc.setFontSize(10);
      doc.setTextColor('#555');
      doc.text('CECyTE Michoacán - Plantel 12 Morelia | Reporte automático', 14, doc.internal.pageSize.height - 10);

      doc.save(`reporte-${this.alumnoActual}-${this.mesSeleccionado}-${this.anioSeleccionado}.pdf`);
    };
  }
}
