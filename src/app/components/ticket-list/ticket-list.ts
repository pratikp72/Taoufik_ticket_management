import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ticket } from '../../models/ticket.model';
import { User } from '../../models/user.model';
import { TicketService } from '../../services/ticket.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ticket-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-list.html',
  styleUrl: './ticket-list.scss',
})
export class TicketList implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  users: User[] = [];
  loading = false;
  error = '';
  statusFilter = '';
  assigneeFilter = '';

  constructor(private ticketService: TicketService, private router: Router) {}

  ngOnInit(): void {
    this.loadTickets();
    this.loadUsers();
  }

  loadTickets(): void {
    this.loading = true;
    this.error = '';

    this.ticketService.getTickets().subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load tickets. Please try again.';
        this.loading = false;
        console.error('Error loading tickets:', err);
      },
    });
  }

  loadUsers(): void {
    this.ticketService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => {
        console.error('Error loading users:', err);
      },
    });
  }

  applyFilters(): void {
    this.filteredTickets = this.tickets.filter((ticket) => {
      const matchesStatus =
        !this.statusFilter || ticket.status === this.statusFilter;
      const matchesAssignee =
        !this.assigneeFilter ||
        (this.assigneeFilter === 'unassigned' && !ticket.assignee) ||
        ticket.assignee === this.assigneeFilter;

      return matchesStatus && matchesAssignee;
    });
  }

  viewTicket(id: number): void {
    this.router.navigate(['/tickets', id]);
  }
}
