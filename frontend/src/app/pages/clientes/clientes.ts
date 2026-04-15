import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data';
import { Cliente } from '../../models/user.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.scss'
})
export class Clientes {
  private dataService = inject(DataService);
  
  searchTerm = signal('');
  showForm = signal(false);
  
  // Formulario reactivo simplificado
  newCliente: Cliente = {
    id: '', nombres: '', apellidos: '', email: '', telefono: '', 
    direccion: '', role: 'CLIENT', active: true
  };

  filteredClientes = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.dataService.clientes().filter(c => 
      c.nombres.toLowerCase().includes(term) || 
      c.apellidos.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term)
    );
  });

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  save() {
    if (this.newCliente.nombres && this.newCliente.email) {
      this.dataService.addCliente({ ...this.newCliente });
      this.resetForm();
    } else {
      alert('Por favor, completa los campos obligatorios.');
    }
  }

  toggleStatus(id: string) {
    this.dataService.toggleUserStatus(id, 'CLIENT');
  }

  resetForm() {
    this.newCliente = {
      id: '', nombres: '', apellidos: '', email: '', telefono: '', 
      direccion: '', role: 'CLIENT', active: true
    };
    this.showForm.set(false);
  }
}
