import { Component, signal, computed } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';
import { Topbar } from './components/topbar/topbar';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Topbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = signal('Bodega Gestión');
  
  // Simulación simple de login
  isLoggedIn = signal(true);
  
  constructor(private router: Router) {
    // Opcional: Ocultar sidebar en login
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isLoggedIn.set(event.url !== '/login');
    });
  }
}
