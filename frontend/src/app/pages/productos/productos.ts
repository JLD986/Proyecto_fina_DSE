import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class Productos {

  productos = [
    { nombre: 'Monitor Samsung 24"', categoria: 'Electrónica', stock: 10, precio: '$250.00' },
    { nombre: 'Teclado Mecánico', categoria: 'Periféricos', stock: 5, precio: '$80.00' },
    { nombre: 'Mouse Inalámbrico', categoria: 'Periféricos', stock: 2, precio: '$35.00' }
  ];

  mostrarModal = false;
  modoEdicion = false;
  indiceEdicion = -1;

  productoActual = { nombre: '', categoria: '', stock: 0, precio: '' };

  abrirModal() {
    this.modoEdicion = false;
    this.productoActual = { nombre: '', categoria: '', stock: 0, precio: '' };
    this.mostrarModal = true;
  }

  editarProducto(i: number) {
    this.modoEdicion = true;
    this.indiceEdicion = i;
    this.productoActual = { ...this.productos[i] };
    this.mostrarModal = true;
  }

  eliminarProducto(i: number) {
    this.productos.splice(i, 1);
  }

  guardarProducto() {
    if (this.modoEdicion) {
      this.productos[this.indiceEdicion] = { ...this.productoActual };
    } else {
      this.productos.push({ ...this.productoActual });
    }
    this.cerrarModal();
  }

  cerrarModal() {
    this.mostrarModal = false;
  }
}