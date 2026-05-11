import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class Productos implements OnInit {

  productos: any[] = [];
  mostrarModal = false;
  modoEdicion = false;
  indiceEdicion = '';

  productoActual = { nombre: '', categoria: '', stock: 0, precio: '' };

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.api.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  abrirModal() {
    this.modoEdicion = false;
    this.productoActual = { nombre: '', categoria: '', stock: 0, precio: '' };
    this.mostrarModal = true;
  }

  editarProducto(producto: any) {
    this.modoEdicion = true;
    this.indiceEdicion = producto._id;
    this.productoActual = { ...producto };
    this.mostrarModal = true;
  }

  eliminarProducto(id: string) {
    this.api.eliminarProducto(id).subscribe({
      next: () => this.cargarProductos(),
      error: (err) => console.error(err)
    });
  }

  guardarProducto() {
    if (this.modoEdicion) {
      this.api.editarProducto(this.indiceEdicion, this.productoActual).subscribe({
        next: () => { this.cargarProductos(); this.cerrarModal(); }
      });
    } else {
      this.api.crearProducto(this.productoActual).subscribe({
        next: () => { this.cargarProductos(); this.cerrarModal(); }
      });
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
  }
}