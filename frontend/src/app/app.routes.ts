import { Routes } from '@angular/router';
import { Clientes } from './pages/clientes/clientes';
import { Trabajadores } from './pages/trabajadores/trabajadores';
import { Administradores } from './pages/administradores/administradores';
import { Productos } from './pages/productos/productos';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'clientes', component: Clientes },
  { path: 'trabajadores', component: Trabajadores },
  { path: 'administradores', component: Administradores },
  { path: 'productos', component: Productos },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
