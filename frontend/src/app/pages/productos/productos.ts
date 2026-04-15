import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data';
import { Producto } from '../../models/user.model';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.scss'
})
export class Productos {
  private dataService = inject(DataService);
  
  searchTerm = signal('');
  showForm = signal(false);
  
  newProducto: Producto = {
    id: '', nombre: '', descripcion: '', precio: 0, stock: 0, categoria: ''
  };

  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.dataService.productos().filter(p => 
      p.nombre.toLowerCase().includes(term) || 
      p.categoria.toLowerCase().includes(term)
    );
  });

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  save() {
    if (this.newProducto.nombre && this.newProducto.precio >= 0) {
      this.dataService.addProducto({ ...this.newProducto });
      this.resetForm();
    } else {
      alert('Nombre y precio son requeridos.');
    }
  }

  deleteProduct(id: string) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.dataService.deleteProducto(id);
    }
  }

  resetForm() {
    this.newProducto = {
      id: '', nombre: '', descripcion: '', precio: 0, stock: 0, categoria: ''
    };
    this.showForm.set(false);
  }
}
