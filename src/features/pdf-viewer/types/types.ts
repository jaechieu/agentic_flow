interface ProcessedData {
  [key: string]: number;
}

export interface ProcessedPDFData {
  message: string;
  data: {
    meeting_room_cost_per_person: number;
    sleeping_room_cost_per_night: number;
    breakout_room_cost_per_person: number;
    meeting_room_quote: number;
    sleeping_room_quote: number;
    total_quote: number;
  };
} 