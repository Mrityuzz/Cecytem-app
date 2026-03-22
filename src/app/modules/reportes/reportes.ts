import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReportesService } from './reportes.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// 🔹 Importar Chart.js
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

  registros: { entrada: string; salida: string; veces: string }[] = [];

  constructor(private reportesService: ReportesService) {}

  ngOnInit(): void {
    this.reportesService.obtenerDatosReportes().subscribe({
      next: (rows) => {
        this.registros = rows;

        const entradas = rows.filter((r) => r.entrada);
        const salidas = rows.filter((r) => r.salida);

        this.totalEntradas = entradas.length;
        this.totalSalidas = salidas.length;

        const diasEntradas = [...new Set(entradas.map((e) => e.entrada.split(' ')[0]))];
        const diasSalidas = [...new Set(salidas.map((s) => s.salida.split(' ')[0]))];

        this.promedioEntradas =
          diasEntradas.length > 0 ? +(this.totalEntradas / diasEntradas.length).toFixed(1) : 0;

        this.promedioSalidas =
          diasSalidas.length > 0 ? +(this.totalSalidas / diasSalidas.length).toFixed(1) : 0;

        // 🔹 Generar gráfica después de calcular datos
        this.generarGraficaEntradasSalidas();
      },
      error: (err) => console.error('Error al cargar estadísticas:', err),
    });
  }
  // 🔹 Gráfica Entradas vs Salidas con soporte para modo claro/oscuro
  generarGraficaEntradasSalidas() {
    const ctx = document.getElementById('graficaEntradasSalidas') as HTMLCanvasElement;
    if (!ctx) return;

    // Detectar si está en modo oscuro
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Colores dinámicos según tema
    const colorEntradas = '#00ff99'; // verde neón para entradas
    const colorSalidas = '#f44336'; // rojo institucional para salidas
    const tituloColor = isDarkMode ? '#00ff99' : '#008000'; // verde neón en oscuro, verde institucional en claro
    const legendColor = isDarkMode ? '#eee' : '#333'; // texto claro en oscuro, oscuro en claro

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
            labels: {
              color: legendColor,
              font: { size: 12 },
            },
          },
          title: {
            display: true,
            text: 'Distribución de Entradas vs Salidas',
            color: tituloColor,
            font: { size: 14, weight: 'bold' },
          },
        },
      },
    });
  }

  descargarPDF() {
    const doc = new jsPDF();

    // 🔹 Logo institucional desde assets
    const logoPath = 'assets/logo/CECYTEM.png';
    const img = new Image();
    img.src = logoPath;

    img.onload = () => {
      // Insertar logo
      doc.addImage(img, 'PNG', 14, 10, 30, 20);

      // Encabezado con colores institucionales
      doc.setFontSize(16);
      doc.setTextColor('#FF6600'); // naranja institucional
      doc.text('CECyTE Michoacán', 50, 20);

      doc.setFontSize(12);
      doc.setTextColor('#008000'); // verde institucional
      doc.text('Reporte de Asistencia - Estadísticas Generales', 50, 28);

      // Fecha automática
      const fecha = new Date().toLocaleDateString();
      doc.setFontSize(10);
      doc.setTextColor('#000');
      doc.text(`Fecha: ${fecha}`, 14, 40);

      // Tabla de estadísticas generales
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

      // Tabla detallada de registros
      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [['Entrada', 'Salida', 'Veces']],
        body: this.registros.map((r) => [r.entrada, r.salida, r.veces]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: '#FF6600', textColor: '#fff', fontStyle: 'bold' },
        bodyStyles: { fillColor: '#fff' },
      });

      // Pie de página institucional
      doc.setFontSize(10);
      doc.setTextColor('#555');
      doc.text(
        'CECyTE Michoacán - Plantel 12 Morelia | Reporte automático',
        14,
        doc.internal.pageSize.height - 10,
      );

      // Guardar archivo
      doc.save('reporte-asistencia.pdf');
    };
  }
}
