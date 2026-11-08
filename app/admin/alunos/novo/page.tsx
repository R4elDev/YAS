import { AlunoForm } from "@/components/admin/aluno-form";

export default function NovoAlunoPage() {
  return (
    <main className="flex flex-col gap-6 px-5 pt-8">
      <h1 className="text-3xl font-semibold tracking-tight">Adicionar aluno</h1>
      <AlunoForm />
    </main>
  );
}
