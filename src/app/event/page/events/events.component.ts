import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {PageComponent} from "../../../shared/page/page.component";
import {EventService} from "../../service/event.service";
import {combineLatest, debounceTime, Observable, startWith, switchMap} from "rxjs";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {CartService} from "../../../cart/service/cart.service";
import {EventDate, Venue} from "../../model/event";
import {CartComponent} from "../../../cart/component/cart/cart.component";
import {VenueFilterComponent} from "../../component/venue-filter/venue-filter.component";
import {EventCardComponent} from "../../component/event-card/event-card.component";

@Component({
  selector: 'app-events-page',
  standalone: true,
  imports: [CommonModule, PageComponent, ReactiveFormsModule, CartComponent, VenueFilterComponent, EventCardComponent],
  providers: [EventService, CartService],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent {

  private readonly eventService = inject(EventService);
  private readonly cartService = inject(CartService);

  readonly search = new FormControl<string | undefined>(undefined);
  readonly venues = new FormControl<Venue[]>([]);

  readonly eventDates$: Observable<EventDate[]> = combineLatest([
    this.search.valueChanges.pipe(
      startWith(undefined),
      debounceTime(500),
    ),
    this.cartService.getEvents(),
    this.venues.valueChanges.pipe(
      startWith([]),
    ),
  ]).pipe(
    switchMap(([search, eventsInCart, venues]) => this.eventService.findAllGroupedByDate(
      search as string | undefined,
      eventsInCart.map(event => event._id),
      venues!.map(venue => venue.id)
    ))
  );
}
