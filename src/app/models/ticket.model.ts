export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'completed';
  assignee: string | null;
  assigneeId: number | null;
  priority: 'low' | 'medium' | 'high';
  createdDate: Date;
  updatedDate: Date;
}
