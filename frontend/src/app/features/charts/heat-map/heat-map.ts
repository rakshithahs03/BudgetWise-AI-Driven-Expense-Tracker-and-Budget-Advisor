import {Component, Input, OnChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgApexchartsModule} from 'ng-apexcharts'; // ✅ Use ApexCharts

@Component({
  selector: 'app-heat-map',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule], // ✅ Use ApexCharts
  templateUrl: './heat-map.html',
  styleUrls: ['./heat-map.scss']
})
export class HeatMapComponent implements OnChanges {
  @Input() data: { date: string, value: number }[] = [];

  public heatMapSeries: any[] = [];
  public heatMapOptions: any = {};

  ngOnChanges(): void {
    if (this.data && this.data.length > 0) {
      this.prepareHeatMapData(this.data);
    }
  }

  prepareHeatMapData(data: { date: string, value: number }[]): void {
    this.heatMapSeries = this.transformDataForHeatMap(data);
    this.heatMapOptions = {
      chart: { type: 'heatmap', height: 200, toolbar: { show: false } },
      plotOptions: { heatmap: { radius: 3, enableShades: false, colorScale: { ranges: [{ from: 1, to: 500, color: '#D8E6E7'}, { from: 501, to: 1000, color: '#81C7D4'}, { from: 1001, to: 5000, color: '#2A628F'}] } } },
      dataLabels: { enabled: false },
      title: { text: 'Daily Spending Heat Map (This Month)' },
    };
  }

  // This function groups the daily data into weeks for the chart
  transformDataForHeatMap(data: { date: string, value: number }[]): any[] {
    const series: { name: string, data: { x: string, y: number }[] }[] = [];
    const weeks: { [week: string]: { name: string, data: { x: string, y: number }[] } } = {};
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    data.forEach(item => {
      const date = new Date(item.date);
      const dayOfWeek = days[date.getUTCDay()];
      // Group by week number
      const weekNumber = `Week ${Math.ceil(date.getUTCDate() / 7)}`;

      if (!weeks[weekNumber]) {
        weeks[weekNumber] = { name: weekNumber, data: [] };
      }
      weeks[weekNumber].data.push({ x: dayOfWeek, y: item.value });
    });

    // Convert the weeks object into an array for the chart
    for(const week in weeks) {
      series.push(weeks[week]);
    }

    return series.reverse(); // Show Week 1 at the top
  }
}
