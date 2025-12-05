import { Component, Input, Output, EventEmitter, OnChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions, ChartType } from 'chart.js';
import { CategorySpending } from '../../../core/services/analysis.service';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="chart-container">
      <canvas baseChart
              [data]="pieChartData"
              [type]="pieChartType"
              [options]="pieChartOptions"
              (chartClick)="chartClicked($event)">
      </canvas>
    </div>
  `
})
export class PieChartComponent implements OnChanges {
  @Input() data: CategorySpending[] = [];
  @Input() type: ChartType = 'pie';
  @Output() categoryClicked = new EventEmitter<string>();

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public pieChartOptions: ChartOptions = { responsive: true, maintainAspectRatio: false };
  public pieChartData: { labels: string[], datasets: { data: number[] }[] } = {
    labels: [],
    datasets: [{ data: [] }]
  };
  public pieChartType: ChartType = 'pie';

  ngOnChanges(): void {
    this.pieChartType = this.type;

    if (this.data && this.data.length > 0) {
      this.pieChartData = {
        labels: this.data.map(item => item.category),
        datasets: [{
          data: this.data.map(item => item.totalAmount)
        }]
      };
    } else {
      // If data is empty or null, clear the chart data
      this.pieChartData = {
        labels: [],
        datasets: [{ data: [] }]
      };
    }

    // Force the chart to redraw with the new (or empty) data
    this.chart?.update();
  }

  public chartClicked(event: any): void {
    if (event.active && event.active.length > 0) {
      const clickedIndex = event.active[0].index;
      const clickedLabel = this.pieChartData.labels[clickedIndex];
      this.categoryClicked.emit(clickedLabel);
    }
  }
}
