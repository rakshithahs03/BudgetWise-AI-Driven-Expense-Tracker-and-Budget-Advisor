import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AnalysisService } from '../../../core/services/analysis.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-monthly-heatmap',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './monthly-heatmap.html',
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    apx-chart {
      flex-grow: 1;
    }
  `]
})
export class MonthlyHeatmapComponent implements OnChanges {
  @Input() year!: number;
  @Input() month!: number;

  public chartSeries: any[] = [];
  public chartOptions: any = {};

  constructor(
    private analysisService: AnalysisService,
    private authService: AuthService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['year'] || changes['month']) && this.year && this.month) {
      this.fetchAndPrepareData();
    }
  }

  fetchAndPrepareData(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.analysisService.getExpenseHeatMapData(userId, this.year, this.month)
      .subscribe(data => {
        this.prepareCalendarData(this.year, this.month, data);
      });
  }

  prepareCalendarData(year: number, month: number, data: { [date: string]: number }): void {
    const series: { name: string, data: { x: string, y: number }[] }[] = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dataMap = new Map(Object.entries(data));
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = new Date(year, month, 0).getDate();

    let currentDay = 1;
    for (let week = 0; week < 6; week++) {
      const weekData: { x: string, y: number }[] = [];
      for (let day = 0; day < 7; day++) {
        if ((week === 0 && day < startingDayOfWeek) || currentDay > daysInMonth) {
          // Use -1 for days outside the month to make them transparent
          weekData.push({ x: days[day], y: -1 });
        } else {
          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;
          const value = dataMap.get(dateStr) || 0;
          weekData.push({ x: days[day], y: value });
          currentDay++;
        }
      }
      // Use short week names for the y-axis labels
      series.push({ name: `W${week + 1}`, data: weekData });
      if (currentDay > daysInMonth) break;
    }

    this.chartSeries = series;
    this.chartOptions = {
      chart: {
        type: 'heatmap',
        height: '100%',
        toolbar: { show: false }
      },
      plotOptions: {
        heatmap: {
          enableShades: false,
          // ✅ This is the corrected color scale
          colorScale: {
            ranges: [
              { from: -1, to: -1, name: 'out-of-month', color: '#ffffff' }, // Makes empty tiles white
              { from: 0, to: 0, name: 'no-expense', color: '#f8f9fa' },   // Light grey for no-spend days
              { from: 1, to: 150, name: 'low', color: '#ffcdd2' },         // Light Red
              { from: 151, to: 800, name: 'medium', color: '#ef5350' },   // Medium Red
              { from: 801, to: 1500, name: 'high', color: '#e53935' },    // Darker Red
              { from: 1501, to: 99999, name: 'very-high', color: '#b71c1c' } // Very Dark Red
            ]
          }
        }
      },
      dataLabels: { enabled: false },
      stroke: { width: 2, colors: ['#fff'] },
      yaxis: { labels: { show: true } }, // ✅ Ensure y-axis labels (weeks) are shown
      title: { text: 'Monthly Spending Calendar', align: 'center' }
    };
  }
}
