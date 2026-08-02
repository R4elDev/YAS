// Tipos manuais espelhando supabase/migrations/0001_init.sql.
// Se o schema mudar, atualize aqui (ou gere via `supabase gen types typescript`
// depois que o projeto estiver criado e as migrations aplicadas).

export type Tipo = "aluno" | "admin";
export type StatusTreino = "pendente" | "concluido";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nome: string;
          email: string;
          tipo: Tipo;
          avatar_url: string | null;
          ativo: boolean;
          senha_provisoria: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          nome: string;
          email: string;
          tipo: Tipo;
          avatar_url?: string | null;
          ativo?: boolean;
          senha_provisoria?: boolean;
        };
        Update: Partial<{
          nome: string;
          avatar_url: string | null;
          ativo: boolean;
          senha_provisoria: boolean;
        }>;
        Relationships: [];
      };
      treinos: {
        Row: {
          id: string;
          aluno_id: string;
          criado_por: string | null;
          nome: string;
          data: string;
          status: StatusTreino;
          finalizado_em: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          aluno_id: string;
          criado_por?: string | null;
          nome: string;
          data: string;
          status?: StatusTreino;
        };
        Update: Partial<{
          aluno_id: string;
          nome: string;
          data: string;
          status: StatusTreino;
        }>;
        Relationships: [
          {
            foreignKeyName: "treinos_aluno_id_fkey";
            columns: ["aluno_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "treinos_criado_por_fkey";
            columns: ["criado_por"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      exercicios: {
        Row: {
          id: string;
          treino_id: string;
          catalogo_id: string | null;
          nome: string;
          imagem_url: string | null;
          imagem_fim_url: string | null;
          series: number;
          repeticoes: string;
          carga: number | null;
          concluido: boolean;
          observacoes: string | null;
          ordem: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          treino_id: string;
          catalogo_id?: string | null;
          nome: string;
          imagem_url?: string | null;
          imagem_fim_url?: string | null;
          series: number;
          repeticoes: string;
          carga?: number | null;
          concluido?: boolean;
          observacoes?: string | null;
          ordem?: number;
        };
        Update: Partial<{
          nome: string;
          catalogo_id: string | null;
          imagem_url: string | null;
          imagem_fim_url: string | null;
          series: number;
          repeticoes: string;
          carga: number | null;
          concluido: boolean;
          observacoes: string | null;
          ordem: number;
        }>;
        Relationships: [
          {
            foreignKeyName: "exercicios_treino_id_fkey";
            columns: ["treino_id"];
            isOneToOne: false;
            referencedRelation: "treinos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "exercicios_catalogo_id_fkey";
            columns: ["catalogo_id"];
            isOneToOne: false;
            referencedRelation: "exercicios_catalogo";
            referencedColumns: ["id"];
          },
        ];
      };
      exercicios_catalogo: {
        Row: {
          id: string;
          nome: string;
          nome_original: string;
          categoria: string;
          nivel: string;
          forca: string | null;
          mecanica: string | null;
          equipamento: string | null;
          musculos_primarios: string[];
          musculos_secundarios: string[];
          instrucoes: string[];
          imagem_inicio_url: string | null;
          imagem_fim_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          nome: string;
          nome_original: string;
          categoria: string;
          nivel: string;
          forca?: string | null;
          mecanica?: string | null;
          equipamento?: string | null;
          musculos_primarios?: string[];
          musculos_secundarios?: string[];
          instrucoes?: string[];
          imagem_inicio_url?: string | null;
          imagem_fim_url?: string | null;
        };
        Update: Partial<{
          nome: string;
          categoria: string;
          nivel: string;
          forca: string | null;
          mecanica: string | null;
          equipamento: string | null;
          musculos_primarios: string[];
          musculos_secundarios: string[];
          instrucoes: string[];
          imagem_inicio_url: string | null;
          imagem_fim_url: string | null;
        }>;
        Relationships: [];
      };
      progresso_peso: {
        Row: {
          id: string;
          aluno_id: string;
          data: string;
          peso: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          aluno_id: string;
          data?: string;
          peso: number;
        };
        Update: Partial<{ data: string; peso: number }>;
        Relationships: [
          {
            foreignKeyName: "progresso_peso_aluno_id_fkey";
            columns: ["aluno_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      progresso_fotos: {
        Row: {
          id: string;
          aluno_id: string;
          data: string;
          foto_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          aluno_id: string;
          data?: string;
          foto_url: string;
        };
        Update: Partial<{ data: string; foto_url: string }>;
        Relationships: [
          {
            foreignKeyName: "progresso_fotos_aluno_id_fkey";
            columns: ["aluno_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      atualizar_exercicio_aluno: {
        Args: {
          p_exercicio_id: string;
          p_carga: number | null;
          p_concluido: boolean;
        };
        Returns: void;
      };
      finalizar_treino: {
        Args: { p_treino_id: string };
        Returns: void;
      };
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Treino = Database["public"]["Tables"]["treinos"]["Row"];
export type Exercicio = Database["public"]["Tables"]["exercicios"]["Row"];
export type ExercicioCatalogo =
  Database["public"]["Tables"]["exercicios_catalogo"]["Row"];
export type ProgressoPeso =
  Database["public"]["Tables"]["progresso_peso"]["Row"];
export type ProgressoFoto =
  Database["public"]["Tables"]["progresso_fotos"]["Row"];
