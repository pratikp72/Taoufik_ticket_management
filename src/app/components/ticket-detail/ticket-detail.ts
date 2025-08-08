import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ticket } from '../../models/ticket.model';
import { User } from '../../models/user.model';
import { TicketService } from '../../services/ticket.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ticket-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-detail.html',
  styleUrl: './ticket-detail.scss',
})
export class TicketDetail implements OnInit {
  ticket: Ticket | null = null;
  users: User[] = [];
  loading = false;
  assignLoading = false;
  completeLoading = false;
  error = '';
  message = '';
  messageType = '';
  selectedUserId = '';
  ticketId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.ticketId = +params['id'];
      this.loadTicket();
      this.loadUsers();
    });
  }

  loadTicket(): void {
    this.loading = true;
    this.error = '';

    this.ticketService.getTicket(this.ticketId).subscribe({
      next: (ticket) => {
        this.ticket = ticket;
        this.selectedUserId = ticket.assigneeId?.toString() || '';
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load ticket details. Please try again.';
        this.loading = false;
        console.error('Error loading ticket:', err);
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

  assignUser(): void {
    if (!this.selectedUserId || !this.ticket) return;

    this.assignLoading = true;
    this.clearMessage();

    this.ticketService
      .assignTicket(this.ticket.id, +this.selectedUserId)
      .subscribe({
        next: (updatedTicket) => {
          this.ticket = updatedTicket;
          this.assignLoading = false;
          this.showMessage('Ticket assigned successfully!', 'success');
        },
        error: (err) => {
          this.assignLoading = false;
          this.showMessage(
            'Failed to assign ticket. Please try again.',
            'error'
          );
          console.error('Error assigning ticket:', err);
        },
      });
  }

  completeTicket(): void {
    if (!this.ticket) return;

    this.completeLoading = true;
    this.clearMessage();

    this.ticketService.completeTicket(this.ticket.id).subscribe({
      next: (updatedTicket) => {
        this.ticket = updatedTicket;
        this.completeLoading = false;
        this.showMessage('Ticket marked as complete!', 'success');
      },
      error: (err) => {
        this.completeLoading = false;
        this.showMessage(
          'Failed to complete ticket. Please try again.',
          'error'
        );
        console.error('Error completing ticket:', err);
      },
    });
  }

  showMessage(message: string, type: string): void {
    this.message = message;
    this.messageType = type;

    // Auto-hide message after 3 seconds
    setTimeout(() => {
      this.clearMessage();
    }, 3000);
  }

  clearMessage(): void {
    this.message = '';
    this.messageType = '';
  }

  goBack(): void {
    this.router.navigate(['/tickets']);
  }
}
