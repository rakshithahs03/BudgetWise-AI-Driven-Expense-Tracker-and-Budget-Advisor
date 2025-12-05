import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './line-chart.html',
})
export class LineChartComponent implements OnChanges {
  @Input() data: { labels: string[], datasets: { label: string, data: number[] }[] } = { labels: [], datasets: [] };

  // Predefined colors for the chart lines
  private chartColors: string[] = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6f42c1'];

  public lineChartOptions: ChartOptions = { responsive: true, maintainAspectRatio: true };
  public lineChartData: { labels: string[], datasets: ChartDataset[] } = {
    labels: [],
    datasets: []
  };
  public lineChartType: ChartType = 'line';

  ngOnChanges(): void {
    if (this.data && this.data.labels && this.data.datasets) {
      this.lineChartData = {
        labels: this.data.labels,
        datasets: this.data.datasets.map((dataset, index) => ({
          ...dataset,
          borderColor: this.chartColors[index % this.chartColors.length],
          backgroundColor: `${this.chartColors[index % this.chartColors.length]}33`, // Adds transparency
          fill: true,
          tension: 0.3
        }))
      };
    }
  }
}
