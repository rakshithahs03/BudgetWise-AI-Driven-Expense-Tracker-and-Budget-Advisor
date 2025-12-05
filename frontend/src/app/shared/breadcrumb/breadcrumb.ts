import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Breadcrumb, BreadcrumbService } from '../../core/services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumb.html',
  styleUrls: ['./breadcrumb.scss']
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs$!: Observable<Breadcrumb[]>;

  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit(): void {
    this.breadcrumbs$ = this.breadcrumbService.breadcrumbs$;
  }
}
