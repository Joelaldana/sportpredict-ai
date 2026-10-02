export interface AIPredictionResult {
  probabilidad: {
    local: number;
    empate: number;
    visitante: number;
  };
  analisis_tactico: string;
  mercado_sugerido: string;
  nivel_confianza: 'Bajo' | 'Medio' | 'Alto';
  modelo_utilizado?: string;
  fecha_analisis?: string;
}
