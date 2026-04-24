export interface Recarga {
  id: string;

  // 👤 usuário
  email: string;
  nome: string;

  // 💰 valores
  valor: number;
  moeda?: string; // opcional (BRL, USD etc)

  // 📌 status do fluxo
  status: 'pendente' | 'aprovado' | 'rejeitado';

  // 📎 comprovante (pix, upload, etc)
  comprovante?: string;

  // 🧠 auditoria básica
  saldoAntes?: number;
  saldoDepois?: number;

  // 📊 rastreio
  tipo?: 'auto' | 'manual' | 'sistema';

  // 🌍 contexto
  origem?: string; // ex: "mobile", "web", "admin"
  ip?: string; // futuro backend
  userAgent?: string;

  // 📅 datas
  data: Date;
  dataProcessamento?: Date;

  // 📝 observações internas
  observacao?: string;
}