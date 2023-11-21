import {AfterViewInit, Component, inject, Input, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterOutlet} from "@angular/router";
import {CartService} from "../../cart/service/cart.service";
import {CartComponent} from "../../cart/component/cart/cart.component";
import {Modal} from "flowbite";

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CartComponent],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss'
})
export class PageComponent implements AfterViewInit {

  private readonly cartService = inject(CartService);

  readonly cardCount$ = this.cartService.getEventsCount();

  @Input({ required: true }) title!: string;

  private cartModal?: Modal;

  ngAfterViewInit(): void {
    this.cartModal = new Modal(document.getElementById('cartModal'));
  }

  showCart(): void {
    this.cartModal?.show();
  }

  hideCart(): void {
    this.cartModal?.hide();
  }
}
