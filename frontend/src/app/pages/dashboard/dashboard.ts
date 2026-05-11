import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  totalProductos = 0;
  enStock = 0;
  stockBajo = 0;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.api.getProductos().subscribe({
      next: (productos) => {
        this.totalProductos = productos.length;
        this.enStock = productos.filter((p: any) => p.stock > 3).length;
        this.stockBajo = productos.filter((p: any) => p.stock <= 3).length;
        this.cdr.detectChanges();
      }
    });
  }
}