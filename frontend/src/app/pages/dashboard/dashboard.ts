import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  private dataService = inject(DataService);
  
  totalClientes = computed(() => this.dataService.clientes().length);
  totalTrabajadores = computed(() => this.dataService.trabajadores().length);
  totalProductos = computed(() => this.dataService.productos().length);
  
  productosBajoStock = computed(() => 
    this.dataService.productos().filter(p => p.stock < 10)
  );

  stats = computed(() => [
    { label: 'Clientes Registrados', value: this.totalClientes(), icon: '👥', color: '#3498db' },
    { label: 'Personal Activo', value: this.totalTrabajadores(), icon: '👷', color: '#2ecc71' },
    { label: 'Productos en Almacén', value: this.totalProductos(), icon: '📦', color: '#e67e22' },
    { label: 'Alertas de Stock', value: this.productosBajoStock().length, icon: '⚠️', color: '#e74c3c' }
  ]);
}
