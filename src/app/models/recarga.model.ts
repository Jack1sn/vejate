export interface Recarga {
  id: string;
  email: string;
  valor: number;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  comprovante?: string;
  data: Date;
}