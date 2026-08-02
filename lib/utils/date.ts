import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday,
  parseISO,
} from "date-fns";
import { ptBR } from "date-fns/locale";

export function getWeekRange(reference = new Date()) {
  return {
    start: startOfWeek(reference, { weekStartsOn: 1 }),
    end: endOfWeek(reference, { weekStartsOn: 1 }),
  };
}

export interface DiaSemana {
  data: string;
  label: string;
  numero: number;
  isHoje: boolean;
}

export function getDiasDaSemana(reference = new Date()): DiaSemana[] {
  const { start, end } = getWeekRange(reference);
  return eachDayOfInterval({ start, end }).map((date) => ({
    data: toISODate(date),
    label: format(date, "EEEEEE", { locale: ptBR }).toUpperCase(),
    numero: date.getDate(),
    isHoje: isToday(date),
  }));
}

export function toISODate(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function todayISODate() {
  return toISODate(new Date());
}

export function isDataDeHoje(data: string) {
  return isToday(parseISO(data));
}

export function formatDiaSemanaCurto(data: string) {
  return format(parseISO(data), "EEEEEE", { locale: ptBR });
}

export function formatDataCurta(data: string) {
  return format(parseISO(data), "d 'de' MMM", { locale: ptBR });
}

export function formatDataLonga(data: string) {
  return format(parseISO(data), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
}
