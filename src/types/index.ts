export interface AppSettingType {
  id: string;
  appName: string;
  activityName: string;
  activityDesc?: string | null;
  isAnnouncementOpen: boolean;
  announcementDate?: string | null; // e.g. "2026-09-04T08:00"
  announcementMode?: "OPEN" | "SCHEDULED" | "CLOSED" | string;
  passedMessage?: string | null;
  failedMessage?: string | null;
  contactInfo?: string | null;
}

export interface ValidationFieldType {
  id: string;
  fieldKey: string;
  label: string;
  placeholder?: string | null;
  fieldType: string; // "text" | "number" | "date" | "password"
  category: "VALIDATION" | "DISPLAY" | string; // VALIDATION = Input Cek di Depan, DISPLAY = Informasi Hasil / Biodata
  showOnResult: boolean;
  isRequired: boolean;
  isCaseSensitive: boolean;
  sortOrder: number;
}

export interface SearchResultType {
  success: boolean;
  message?: string;
  data?: {
    name: string;
    position?: string | null;
    status: "LULUS" | "TIDAK_LULUS" | string;
    score?: number | null;
    notes?: string | null;
    activityName: string;
    passedMessage?: string | null;
    failedMessage?: string | null;
    contactInfo?: string | null;
    matchedFields?: Record<string, string>;
    displayDetails?: { key: string; label: string; value: string }[];
  };
}
