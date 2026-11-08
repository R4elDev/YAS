export interface ItemCatalogoExterno {
  /** exerciseId da ExerciseDB (não é gravado em `exercicios`; ver docs). */
  id: string;
  /** Nome em PT (dicionário parcial) — é o que vira snapshot do treino. */
  nome: string;
  nomeOriginal: string;
  /** GIF animado. Novos exercícios não têm imagem de "fim". */
  gifUrl: string;
  musculos: string[];
  equipamento: string | null;
}

export interface PaginaCatalogo {
  itens: ItemCatalogoExterno[];
  total: number;
  pagina: number;
  temMais: boolean;
}
