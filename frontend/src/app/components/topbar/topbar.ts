import { Component, signal, computed } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {
  pageTitle = signal('Dashboard');

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      this.updateTitle(url);
    });
  }

  private updateTitle(url: string) {
    if (url.includes('clientes')) this.pageTitle.set('Gestión de Clientes');
    else if (url.includes('trabajadores')) this.pageTitle.set('Gestión de Trabajadores');
    else if (url.includes('administradores')) this.pageTitle.set('Administradores');
    else if (url.includes('productos')) this.pageTitle.set('Inventario de Almacén');
    else if (url.includes('dashboard')) this.pageTitle.set('Dashboard');
    else this.pageTitle.set('Bodega Gestión');
  }
}
