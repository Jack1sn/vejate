export interface Recarga {

  // =========================
  // IDENTIFICAÇÃO
  // =========================
  id: string;

  // =========================
  // USUÁRIO
  // =========================
  usuarioId: string;
  email?: string;
  nome?: string;

  // =========================
  // DADOS DA RECARGA
  // =========================
  numero: string;
  valor: number;
  moeda: string;

  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO';

  tipo: 'MANUAL' | 'AUTO' | 'SISTEMA';

  origem?: string;

  // =========================
  // AUDITORIA DE SALDO
  // =========================
  saldo?: number;
  chequeo:boolean;
  

  // =========================
  // COMPROVANTE
  // =========================
  comprovante?: string;

  // =========================
  // CONTEXTO
  // =========================
  ip?: string;
  userAgent?: string;

  // =========================
  // DATAS (IMPORTANTE: STRING!)
  // =========================
  data: string;
  dataProcessamento?: string;

  // =========================
  // OBSERVAÇÃO
  // =========================
  observacao?: string;
}