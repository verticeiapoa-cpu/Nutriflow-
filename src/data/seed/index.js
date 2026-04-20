// src/data/seed/index.js
// Importa os planos-modelo da biblioteca e exporta como array
import planoHipertrofia from "./planos_alimentares/plano_hipertrofia_sugerido.json";
import planoEmagrecimento from "./planos_alimentares/plano_perda_peso_sugerido.json";

export const BIBLIOTECA_PLANOS = [
  planoHipertrofia,
  planoEmagrecimento,
];

export { planoHipertrofia, planoEmagrecimento };
