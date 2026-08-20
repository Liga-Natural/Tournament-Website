export interface Adapter {
  getAll<T>(table: string): Promise<T[]>;
  getById<T>(table: string, id: string): Promise<T | null>;
  insert<T extends { id: string }>(table: string, row: T): Promise<T>;
  update<T extends { id: string }>(table: string, id: string, patch: Partial<T>): Promise<T | null>;
  remove(table: string, id: string): Promise<void>;
  getKV(key: string): Promise<string | null>;
  setKV(key: string, value: string): Promise<void>;
}

export const TABLES = {
  events: "events",
  divisions: "divisions",
  teams: "teams",
  players: "players",
  fixtures: "fixtures",
  referees: "referees",
  editionAwards: "edition_awards",
  partners: "partners",
  galleryImages: "gallery_images",
  contactSubmissions: "contact_submissions",
  partnerEnquiries: "partner_enquiries",
  joinSubmissions: "join_submissions",
} as const;
