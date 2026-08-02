"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import {
  ExercicioFormRow,
  type ExercicioDraft,
} from "@/components/treino/exercicio-form-row";

interface ExerciciosDndListProps {
  exercicios: ExercicioDraft[];
  onChange: (exercicios: ExercicioDraft[]) => void;
}

export function ExerciciosDndList({
  exercicios,
  onChange,
}: ExerciciosDndListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = exercicios.findIndex((e) => e.clientId === active.id);
    const newIndex = exercicios.findIndex((e) => e.clientId === over.id);
    onChange(arrayMove(exercicios, oldIndex, newIndex));
  }

  function updateExercicio(clientId: string, patch: Partial<ExercicioDraft>) {
    onChange(
      exercicios.map((e) => (e.clientId === clientId ? { ...e, ...patch } : e))
    );
  }

  function removeExercicio(clientId: string) {
    onChange(exercicios.filter((e) => e.clientId !== clientId));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={exercicios.map((e) => e.clientId)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3">
          {exercicios.map((exercicio) => (
            <ExercicioFormRow
              key={exercicio.clientId}
              exercicio={exercicio}
              onChange={(patch) => updateExercicio(exercicio.clientId, patch)}
              onRemove={() => removeExercicio(exercicio.clientId)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
