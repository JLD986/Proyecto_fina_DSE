import { Injectable, signal } from '@angular/core';
import { Cliente, Trabajador, Administrador, Producto, BaseUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private STORAGE_KEY = 'BODEGA_DATA_V1';

  clientes = signal<Cliente[]>([]);
  trabajadores = signal<Trabajador[]>([]);
  administradores = signal<Administrador[]>([]);
  productos = signal<Producto[]>([]);
  currentUser = signal<BaseUser | null>(null);

  constructor() {
    this.loadFromStorage();
    if (this.clientes().length === 0 && this.trabajadores().length === 0) {
      this.initDummyData();
    }
  }

  // --- AUTENTICACIÓN ---
  login(email: string): boolean {
    const user = [...this.administradores(), ...this.trabajadores(), ...this.clientes()]
      .find(u => u.email.toLowerCase() === email.toLowerCase());

    if (user && user.active) {
      this.currentUser.set(user);
      localStorage.setItem('LOGGED_USER', JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('LOGGED_USER');
  }

  private saveToStorage() {
    const data = {
      clientes: this.clientes(),
      trabajadores: this.trabajadores(),
      administradores: this.administradores(),
      productos: this.productos()
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  private loadFromStorage() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        this.clientes.set(parsed.clientes || []);
        this.trabajadores.set(parsed.trabajadores || []);
        this.administradores.set(parsed.administradores || []);
        this.productos.set(parsed.productos || []);
      }
      
      const loggedUser = localStorage.getItem('LOGGED_USER');
      if (loggedUser) {
        this.currentUser.set(JSON.parse(loggedUser));
      }
    } catch (e) {
      console.error('Error loading data from storage', e);
    }
  }

  private initDummyData() {
    this.clientes.set([
      { id: 'C1', nombres: 'Carlos', apellidos: 'Gomez', email: 'carlos@mail.com', telefono: '77665544', role: 'CLIENT', active: true, direccion: 'Av. Las Palmeras 123' },
      { id: 'C2', nombres: 'Maria', apellidos: 'López', email: 'maria@mail.com', telefono: '99887766', role: 'CLIENT', active: true, direccion: 'Calle Central 456', numeroOrden: 'ORD-001' }
    ]);

    this.trabajadores.set([
      { id: 'W1', nombres: 'Roberto', apellidos: 'Sosa', email: 'rsosa@bodega.com', telefono: '11223344', role: 'WORKER', active: true, afp: 'Integra' }
    ]);

    this.administradores.set([
      { id: 'A1', nombres: 'Admin', apellidos: 'Principal', email: 'admin@bodega.com', telefono: '00000000', role: 'ADMIN', active: true }
    ]);

    this.productos.set([
      { id: 'P1', nombre: 'Caja Térmica X-200', descripcion: 'Mantiene frío por 24h', precio: 45.99, stock: 150, categoria: 'Equipamiento' },
      { id: 'P2', nombre: 'Estante Metálico HD', descripcion: 'Soporta hasta 500kg', precio: 89.00, stock: 40, categoria: 'Mobiliario' }
    ]);

    this.saveToStorage();
  }

  // --- CRUD CLIENTES ---
  addCliente(cliente: Cliente) {
    this.clientes.update(list => [...list, { ...cliente, id: 'C' + Date.now() }]);
    this.saveToStorage();
  }

  updateCliente(id: string, updated: Partial<Cliente>) {
    this.clientes.update(list => list.map(c => c.id === id ? { ...c, ...updated } as Cliente : c));
    this.saveToStorage();
  }

  // --- CRUD TRABAJADORES ---
  addTrabajador(t: Trabajador) {
    this.trabajadores.update(list => [...list, { ...t, id: 'W' + Date.now() }]);
    this.saveToStorage();
  }

  updateTrabajador(id: string, updated: Partial<Trabajador>) {
    this.trabajadores.update(list => list.map(t => t.id === id ? { ...t, ...updated } as Trabajador : t));
    this.saveToStorage();
  }

  // --- CRUD PRODUCTOS ---
  addProducto(p: Producto) {
    this.productos.update(list => [...list, { ...p, id: 'P' + Date.now() }]);
    this.saveToStorage();
  }

  deleteProducto(id: string) {
    this.productos.update(list => list.filter(p => p.id !== id));
    this.saveToStorage();
  }

  // --- ACCIÓN GENERAL: BLOQUEAR ACCESO ---
  toggleUserStatus(id: string, role: 'CLIENT' | 'WORKER' | 'ADMIN') {
    if (role === 'CLIENT') this.updateCliente(id, { active: !this.clientes().find(c => c.id === id)?.active });
    if (role === 'WORKER') this.updateTrabajador(id, { active: !this.trabajadores().find(t => t.id === id)?.active });
    this.saveToStorage();
  }
}
