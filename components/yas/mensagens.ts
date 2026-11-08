import type { YasRosto } from "@/components/yas/yas-face";

export type PapelYas = "admin" | "aluno";

export interface MensagemYas {
  texto: string;
  rosto: YasRosto;
}

/** Primeiro nome; "Ei" quando o nome não vem preenchido. */
export function vocativo(nome: string): string {
  return nome.trim().split(/\s+/)[0] || "Ei";
}

// Frases curtas, em PT-BR. Admin = personal, aluno = aluno.
const FRASES: Record<PapelYas, Array<{ rosto: YasRosto; texto: (v: string) => string }>> = {
  admin: [
    { rosto: "feliz-orgulhosa", texto: (v) => `${v}, seus alunos contam com você hoje.` },
    { rosto: "pensativa", texto: (v) => `${v}, um ajuste certo no treino faz diferença.` },
    { rosto: "surpresa-orgulho", texto: (v) => `${v}, acompanhar de perto é o que transforma.` },
  ],
  aluno: [
    { rosto: "feliz-orgulhosa", texto: (v) => `${v}, um treino de cada vez. Você já está no caminho.` },
    { rosto: "bebendo-agua", texto: (v) => `${v}, bebe água e mantém o ritmo entre as séries.` },
    { rosto: "pensativa", texto: (v) => `${v}, respira, foca na execução e marca cada série.` },
    { rosto: "surpresa-orgulho", texto: (v) => `${v}, cada treino feito é progresso. Continue.` },
  ],
};

/** Sorteia uma frase do papel. `aleatorio` é injetável para testes. */
export function sortearMensagem(
  papel: PapelYas,
  nome: string,
  aleatorio: () => number = Math.random
): MensagemYas {
  const lista = FRASES[papel];
  const indice = Math.min(Math.floor(aleatorio() * lista.length), lista.length - 1);
  const frase = lista[indice];
  return { texto: frase.texto(vocativo(nome)), rosto: frase.rosto };
}
