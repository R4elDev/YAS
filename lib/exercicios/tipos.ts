export interface ItemCatalogoExterno {
  /** `exercicios_catalogo.id` (ex.: "exdb:0CXGHya"): é o que vira `exercicios.catalogo_id`. */
  id: string;
  /** Nome em PT quando há tradução no banco; senão o original. Vira snapshot do treino. */
  nome: string;
  nomeOriginal: string;
  /** Mídia opcional: o catálogo do banco não depende de GIF. */
  gifUrl: string | null;
  musculos: string[];
  equipamento: string | null;
}

export interface PaginaCatalogo {
  itens: ItemCatalogoExterno[];
  total: number;
  pagina: number;
  temMais: boolean;
}
