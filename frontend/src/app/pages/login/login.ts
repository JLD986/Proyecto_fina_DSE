import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../services/data';
import { Cliente } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private dataService = inject(DataService);
  private router = inject(Router);

  isLoginMode = signal(true);
  loginEmail = signal('');
  loginPassword = signal(''); // Simulación para el frontend
  
  // Para Registro de Clientes
  regCliente: Cliente = {
    id: '', nombres: '', apellidos: '', email: '', telefono: '', 
    direccion: '', role: 'CLIENT', active: true
  };

  onLogin() {
    const success = this.dataService.login(this.loginEmail());
    if (success) {
      this.router.navigate(['/dashboard']);
    } else {
      alert('Credenciales inválidas o usuario bloqueado.');
    }
  }

  onRegister() {
    if (this.regCliente.nombres && this.regCliente.email) {
      this.dataService.addCliente({ ...this.regCliente });
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      this.isLoginMode.set(true);
      this.loginEmail.set(this.regCliente.email);
    } else {
      alert('Por favor completa todos los campos.');
    }
  }

  toggleMode() {
    this.isLoginMode.update(val => !val);
  }
}
