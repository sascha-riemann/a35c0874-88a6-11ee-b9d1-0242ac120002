import {Component, inject, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {tr} from "date-fns/locale";
import {Event} from "../../model/event";
import {CartService} from "../../../cart/service/cart.service";

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss'
})
export class EventCardComponent {

  private readonly cartService = inject(CartService);

  @Input({ required: true }) event!: Event;

  addToCart(event: Event): void {
    this.cartService.addEvent(event._id);
  }
}
