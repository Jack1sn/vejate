import { Injectable, signal } from '@angular/core';

export interface Remedio {
  id: number;
  nome: string;
  descricao: string;
  beneficios: string;
  modoPreparo: string;
  imagem: string;
}

@Injectable({
  providedIn: 'root'
})
export class RemedioService {

  private remediosSignal = signal<Remedio[]>([
    {
      id: 1,
      nome: 'Chá de Camomila',
      descricao: 'Remédio natural calmante.',
      beneficios: 'Reduz ansiedade e melhora o sono.',
      modoPreparo: '1 colher em água quente por 10 minutos.',
      imagem: 'https://via.placeholder.com/300'
    }
  ]);

  remedios = this.remediosSignal.asReadonly();

  adicionar(remedio: Remedio) {
    this.remediosSignal.update(lista => [...lista, remedio]);
  }

  remover(id: number) {
    this.remediosSignal.update(lista =>
      lista.filter(r => r.id !== id)
    );
  }
}
