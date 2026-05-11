import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private URL = 'https://producto-inventario-backend.onrender.com';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  // Auth
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.URL}/login`, { email, password });
  }

  // Productos
  getProductos(): Observable<any> {
    return this.http.get(`${this.URL}/productos`, { headers: this.getHeaders() });
  }

  crearProducto(producto: any): Observable<any> {
    return this.http.post(`${this.URL}/productos`, producto, { headers: this.getHeaders() });
  }

  editarProducto(id: string, producto: any): Observable<any> {
    return this.http.put(`${this.URL}/productos/${id}`, producto, { headers: this.getHeaders() });
  }

  eliminarProducto(id: string): Observable<any> {
    return this.http.delete(`${this.URL}/productos/${id}`, { headers: this.getHeaders() });
  }

  // Categorias
  getCategorias(): Observable<any> {
    return this.http.get(`${this.URL}/categorias`);
  }

  // Clientes
  getClientes(): Observable<any> {
    return this.http.get(`${this.URL}/clientes`, { headers: this.getHeaders() });
  }
}