import { Injectable, signal, computed } from '@angular/core';

export interface Usuario {
  nome: string;
  email: string;
  senha: string;
  saldo: number;
  role: 'admin' | 'cliente';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly STORAGE_KEY = 'vejate_user';
  private readonly STORAGE_USERS = 'vejate_users';

  private usuarioSignal = signal<Usuario | null>(this.getUsuarioFromStorage());

  // 🔥 Computeds
  usuario = computed(() => this.usuarioSignal());
  estaLogado = computed(() => !!this.usuarioSignal());
  ehAdmin = computed(() => this.usuarioSignal()?.role === 'admin');

  nomeUsuario = computed(() => {
    const user = this.usuarioSignal();
    if (!user) return '';
    return user.nome?.split(' ')[0] || user.email.split('@')[0];
  });

  constructor() {
    const usuarios = this.getUsuariosCadastrados();

    // Admin padrão
    if (!usuarios.find(u => u.email === 'admin@vejate.com')) {
      this.salvarUsuario({
        nome: 'Administrador',
        email: 'admin@vejate.com',
        senha: '123',
        role: 'admin',
        saldo: 0
      });
    }

    // Cliente padrão
    if (!usuarios.find(u => u.email === 'cliente@vejate.com')) {
      this.salvarUsuario({
        nome: 'Cliente Teste',
        email: 'cliente@vejate.com',
        senha: '123',
        role: 'cliente',
        saldo: 50
      });
    }
  }

  /**
   * 🔐 Login
   */
  login(email: string, senha: string): boolean {
    const usuarios = this.getUsuariosCadastrados();

    const usuario = usuarios.find(
      u => u.email === email && u.senha === senha
    );

    if (!usuario) return false;

    const usuarioSeguro: Usuario = {
      ...usuario,
      nome: usuario.nome ?? email.split('@')[0],
      saldo: usuario.saldo ?? 0
    };

    this.usuarioSignal.set(usuarioSeguro);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuarioSeguro));

    return true;
  }

  /**
   * 🚪 Logout
   */
  logout() {
    this.usuarioSignal.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * 📝 Cadastro
   */
  cadastrarCliente(nome: string, email: string, senha: string): boolean {
    const usuarios = this.getUsuariosCadastrados();

    if (usuarios.find(u => u.email === email)) {
      return false;
    }

    const novoUsuario: Usuario = {
      nome,
      email,
      senha,
      role: 'cliente',
      saldo: 0
    };

    this.salvarUsuario(novoUsuario);
    return true;
  }

  /**
   * 💰 ADICIONAR SALDO (usado pelo gerente)
   */
  adicionarSaldo(valor: number) {
    const user = this.usuarioSignal();

    if (!user) return;

    if (valor <= 0) return; // proteção básica

    const atualizado: Usuario = {
      ...user,
      saldo: (user.saldo || 0) + valor
    };

    this.usuarioSignal.set(atualizado);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(atualizado));

    this.atualizarListaUsuarios(atualizado);
  }

  /**
   * 💸 DESCONTAR SALDO (quando cliente usa)
   */
  descontarSaldo(valor: number): boolean {
    const user = this.usuarioSignal();

    if (!user) return false;

    if (valor <= 0) return false;

    if ((user.saldo || 0) < valor) {
      return false; // saldo insuficiente
    }

    const atualizado: Usuario = {
      ...user,
      saldo: user.saldo - valor
    };

    this.usuarioSignal.set(atualizado);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(atualizado));

    this.atualizarListaUsuarios(atualizado);

    return true;
  }

  /**
   * 🔄 Atualiza usuário na lista geral
   */
  private atualizarListaUsuarios(usuarioAtualizado: Usuario) {
    const usuarios = this.getUsuariosCadastrados();

    const index = usuarios.findIndex(u => u.email === usuarioAtualizado.email);

    if (index !== -1) {
      usuarios[index] = usuarioAtualizado;
      localStorage.setItem(this.STORAGE_USERS, JSON.stringify(usuarios));
    }
  }

  /**
   * 👤 Recupera usuário logado
   */
  private getUsuarioFromStorage(): Usuario | null {
    const data = localStorage.getItem(this.STORAGE_KEY);

    if (!data) return null;

    try {
      const user = JSON.parse(data);

      return {
        ...user,
        nome: user.nome ?? user.email?.split('@')[0],
        saldo: user.saldo ?? 0
      };
    } catch {
      return null;
    }
  }

  /**
   * 👥 Lista de usuários
   */
  private getUsuariosCadastrados(): Usuario[] {
    const data = localStorage.getItem(this.STORAGE_USERS);
    return data ? JSON.parse(data) : [];
  }

  /**
   * 💾 Salvar usuário
   */
  private salvarUsuario(usuario: Usuario) {
    const usuarios = this.getUsuariosCadastrados();
    usuarios.push(usuario);
    localStorage.setItem(this.STORAGE_USERS, JSON.stringify(usuarios));
  }

  /**
   * 👀 Método clássico
   */
  getUsuario(): Usuario | null {
    return this.usuarioSignal();
  }

  adicionarSaldoUsuario(email: string, valor: number) {
  const usuarios = this.getUsuariosCadastrados();

  const index = usuarios.findIndex(u => u.email === email);

  if (index === -1) return;

  usuarios[index].saldo = (usuarios[index].saldo ?? 0) + valor;

  localStorage.setItem(this.STORAGE_USERS, JSON.stringify(usuarios));

  // atualiza se for o usuário logado
  const atual = this.usuarioSignal();
  if (atual?.email === email) {
    this.usuarioSignal.set({
      ...atual,
      saldo: usuarios[index].saldo
    });
  }
}
}