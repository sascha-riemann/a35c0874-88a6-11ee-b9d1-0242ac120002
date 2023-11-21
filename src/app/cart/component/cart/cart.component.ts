import {Component, EventEmitter, inject, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CartService} from "../../service/cart.service";
import {Observable} from "rxjs";
import {Event} from "../../../event/model/event";
import {Modal} from "flowbite";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

  readonly cartService = inject(CartService);

  readonly events$: Observable<Event[]> = this.cartService.getEvents();

  @Output()
  readonly close = new EventEmitter<void>();

  removeEvent(event: Event): void {
    this.cartService.removeEvent(event._id);
  }
}
