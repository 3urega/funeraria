export type EsquelaContact = {
  address: string;
  phone: string;
  email: string;
  website?: string;
};

export type EsquelaPrintData = {
  brandName: string;
  brandColor?: string;
  contact: EsquelaContact;
  deceasedName: string;
  photoUrl: string | null;
  deathLine: string | null;
  showEpd: boolean;
  funeralLine1: string | null;
  funeralLine2: string | null;
  mortuaryLine: string | null;
  wakeLine1: string | null;
  wakeLine2: string | null;
};
