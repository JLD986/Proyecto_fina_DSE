import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data';
import { Trabajador } from '../../models/user.model';

@Component({
  selector: 'app-trabajadores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trabajadores.html',
  styleUrl: './trabajadores.scss'
})
export class Trabajadores {
  private dataService = inject(DataService);
  
  searchTerm = signal('');
  showForm = signal(false);
  
  newWorker: Trabajador = {
    id: '', nombres: '', apellidos: '', email: '', telefono: '', 
    role: 'WORKER', active: true, afp: ''
  };

  filteredWorkers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.dataService.trabajadores().filter(t => 
      t.nombres.toLowerCase().includes(term) || 
      t.apellidos.toLowerCase().includes(term) ||
      t.email.toLowerCase().includes(term)
    );
  });

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  // Genera correo empresarial automáticamente
  generateEmail() {
    if (this.newWorker.nombres && this.newWorker.apellidos) {
      const name = this.newWorker.nombres.split(' ')[0].toLowerCase();
      const surname = this.newWorker.apellidos.split(' ')[0].toLowerCase();
      this.newWorker.email = `${name}.${surname}@bodega.com`;
    }
  }

  save() {
    if (this.newWorker.nombres && this.newWorker.afp) {
      this.dataService.addTrabajador({ ...this.newWorker });
      this.resetForm();
    } else {
      alert('Por favor, completa los campos obligatorios (Nombres y AFP).');
    }
  }

  toggleStatus(id: string) {
    this.dataService.toggleUserStatus(id, 'WORKER');
  }

  resetForm() {
    this.newWorker = {
      id: '', nombres: '', apellidos: '', email: '', telefono: '', 
      role: 'WORKER', active: true, afp: ''
    };
    this.showForm.set(false);
  }
}
