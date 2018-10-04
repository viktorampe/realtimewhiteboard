export interface EmailInterface {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
  id?: number;
}
