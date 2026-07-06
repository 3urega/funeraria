export interface Session {
  userId: string;
  email: string;
  role: "admin" | "editor" | "operator";
}

export interface FamilySession {
  obituaryId: string;
  visitCode: string;
}

export interface AuthAdapter {
  signIn(email: string, password: string): Promise<Session | null>;
  signOut(): Promise<void>;
  getSession(): Promise<Session | null>;
}
