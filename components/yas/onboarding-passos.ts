import type { YasRosto } from "@/components/yas/yas-face";

export type PapelOnboarding = "admin" | "aluno";

export interface PassoOnboarding {
  id: string;
  rosto: YasRosto;
  titulo: string;
  texto: string;
}

export const ONBOARDING_VERSAO = "v1";

export function chaveOnboarding(userId: string) {
  return `yas:onboarding:${ONBOARDING_VERSAO}:${userId}`;
}

export function passosOnboarding(
  papel: PapelOnboarding,
  nome: string
): PassoOnboarding[] {
  const primeiro = nome.trim().split(/\s+/)[0] || "";
  if (papel === "admin") {
    return [
      {
        id: "alunos",
        rosto: "feliz-orgulhosa",
        titulo: primeiro ? `Bem-vinda, ${primeiro}!` : "Bem-vinda!",
        texto:
          "Em Alunos você cadastra e acompanha cada pessoa. É o ponto de partida de tudo.",
      },
      {
        id: "treinos",
        rosto: "pensativa",
        titulo: "Monte treinos em minutos",
        texto:
          "Crie o treino de um aluno e escolha exercícios no catálogo, com GIF de demonstração e carga sugerida.",
      },
      {
        id: "progresso",
        rosto: "surpresa-orgulho",
        titulo: "Veja a evolução",
        texto:
          "Acompanhe peso, cargas e fotos de cada aluno e ajuste os treinos conforme o progresso.",
      },
    ];
  }
  return [
    {
      id: "boas-vindas",
      rosto: "feliz-orgulhosa",
      titulo: primeiro ? `Oi, ${primeiro}!` : "Oi!",
      texto:
        "Eu sou a Yas e vou te mostrar rapidinho como o app funciona. Leva menos de um minuto.",
    },
    {
      id: "treino",
      rosto: "surpresa-orgulho",
      titulo: "Seu treino do dia",
      texto:
        "No Início e em Treinos você vê o que fazer hoje. Toque no exercício para ver o GIF e anotar a carga.",
    },
    {
      id: "progresso",
      rosto: "gargalhada",
      titulo: "Acompanhe sua evolução",
      texto:
        "Em Progresso registre seu peso, veja o gráfico das cargas e envie fotos para comparar.",
    },
    {
      id: "perfil",
      rosto: "beijo-finalizacao",
      titulo: "Tudo pronto!",
      texto: "No Perfil você troca sua foto e seu nome. Bons treinos!",
    },
  ];
}
