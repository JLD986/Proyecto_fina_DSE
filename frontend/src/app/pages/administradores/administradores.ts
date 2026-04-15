import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data';
import { Administrador } from '../../models/user.model';

@Component({
  selector: 'app-administradores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './administradores.html',
  styleUrl: './administradores.scss'
})
export class Administradores {
  private dataService = inject(DataService);
  
  searchTerm = signal('');
  showForm = signal(false);
  
  newAdmin: Administrador = {
    id: '', nombres: '', apellidos: '', email: '', telefono: '', 
    role: 'ADMIN', active: true
  };

  filteredAdmins = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.dataService.administradores().filter(a => 
      a.nombres.toLowerCase().includes(term) || 
      a.apellidos.toLowerCase().includes(term) ||
      a.email.toLowerCase().includes(term)
    );
  });

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  generateEmail() {
    if (this.newAdmin.nombres && this.newAdmin.apellidos) {
      const name = this.newAdmin.nombres.split(' ')[0].toLowerCase();
      const surname = this.newAdmin.apellidos.split(' ')[0].toLowerCase();
      this.newAdmin.email = `${name}.${surname}@bodega.admin.com`;
    }
  }

  save() {
    if (this.newAdmin.nombres && this.newAdmin.apellidos) {
      this.dataService.administradores.update(list => [...list, { ...this.newAdmin, id: 'A' + Date.now() }]);
      this.resetForm();
    } else {
      alert('Nombres y apellidos son obligatorios.');
    }
  }

  toggleStatus(id: string) {
    this.dataService.administradores.update(list => 
      list.map(a => a.id === id ? { ...a, active: !a.active } : a)
    );
  }

  resetForm() {
    this.newAdmin = {
      id: '', nombres: '', apellidos: '', email: '', telefono: '', 
      role: 'ADMIN', active: true
    };
    this.showForm.set(false);
  }
}
