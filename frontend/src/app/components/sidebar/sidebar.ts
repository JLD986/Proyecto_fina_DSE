import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { DataService } from '../../services/data';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private dataService = inject(DataService);
  private router = inject(Router);

  logout() {
    this.dataService.logout();
    this.router.navigate(['/login']);
  }
}
