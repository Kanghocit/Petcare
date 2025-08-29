export interface VoicherInterface {
    _id: string;
    name: string;
    code: string;
    discountValue: number | string;
    startDate: string;
    endDate: string;
    maxUsers: number;
    usedCount?: number;
    status: "active" | "inactive";
  }
  