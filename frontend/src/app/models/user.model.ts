export type UserRole = 'ADMIN' | 'WORKER' | 'CLIENT';

export interface BaseUser {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  role: UserRole;
  active: boolean;
}

export interface Cliente extends BaseUser {
  role: 'CLIENT';
  direccion: string;
  numeroOrden?: string; // Brindado por el sistema al comprar
}

export interface Trabajador extends BaseUser {
  role: 'WORKER';
  afp: string;
  contactoEmergencia?: string;
}

export interface Administrador extends BaseUser {
  role: 'ADMIN';
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
}
