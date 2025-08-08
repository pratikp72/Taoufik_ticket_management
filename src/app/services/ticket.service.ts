import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { Ticket } from '../models/ticket.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private tickets: Ticket[] = [
    {
      id: 1,
      title: 'Login page not working',
      description: 'Users unable to login with correct credentials',
      status: 'open',
      assignee: null,
      assigneeId: null,
      priority: 'high',
      createdDate: new Date('2024-01-15'),
      updatedDate: new Date('2024-01-15'),
    },
    {
      id: 2,
      title: 'Dashboard loading slowly',
      description: 'Dashboard takes more than 10 seconds to load',
      status: 'in-progress',
      assignee: 'John Doe',
      assigneeId: 1,
      priority: 'medium',
      createdDate: new Date('2024-01-16'),
      updatedDate: new Date('2024-01-17'),
    },
    {
      id: 3,
      title: 'Email notifications not sent',
      description: 'System not sending email notifications to users',
      status: 'completed',
      assignee: 'Jane Smith',
      assigneeId: 2,
      priority: 'low',
      createdDate: new Date('2024-01-14'),
      updatedDate: new Date('2024-01-18'),
    },
    {
      id: 4,
      title: 'Mobile responsiveness issues',
      description: 'Layout breaks on mobile devices',
      status: 'open',
      assignee: null,
      assigneeId: null,
      priority: 'medium',
      createdDate: new Date('2024-01-19'),
      updatedDate: new Date('2024-01-19'),
    },
  ];

  private users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com' },
  ];
  // Simulate network delay
  private simulateDelay<T>(data: T, delayMs: number = 1000): Observable<T> {
    return of(data).pipe(delay(delayMs));
  }

  getTickets(): Observable<Ticket[]> {
    return this.simulateDelay(this.tickets);
  }

  getTicket(id: number): Observable<Ticket> {
    const ticket = this.tickets.find((t) => t.id === id);
    if (!ticket) {
      return throwError(() => new Error('Ticket not found'));
    }
    return this.simulateDelay(ticket);
  }

  getUsers(): Observable<User[]> {
    return this.simulateDelay(this.users, 500);
  }

  assignTicket(ticketId: number, userId: number): Observable<Ticket> {
    const ticket = this.tickets.find((t) => t.id === ticketId);
    const user = this.users.find((u) => u.id === userId);

    if (!ticket || !user) {
      return throwError(() => new Error('Ticket or User not found'));
    }

    ticket.assignee = user.name;
    ticket.assigneeId = user.id;
    ticket.status = ticket.status === 'open' ? 'in-progress' : ticket.status;
    ticket.updatedDate = new Date();

    return this.simulateDelay(ticket, 800);
  }

  completeTicket(ticketId: number): Observable<Ticket> {
    const ticket = this.tickets.find((t) => t.id === ticketId);

    if (!ticket) {
      return throwError(() => new Error('Ticket not found'));
    }

    ticket.status = 'completed';
    ticket.updatedDate = new Date();

    return this.simulateDelay(ticket, 800);
  }
}
