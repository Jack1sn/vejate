export interface Recarga {
  id: string;
  email: string;
  nome: string; 
  valor: number;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  comprovante?: string;
  data: Date;
}