export interface PaymentStatus {
  status: 'pending' | 'failed' | 'submitted';
  message: string;
  controlNumber?: string;
  dueDate?: string;
}