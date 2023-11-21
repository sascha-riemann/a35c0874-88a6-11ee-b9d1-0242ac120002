import {inject, Injectable} from '@angular/core';
import {map, Observable, startWith, Subject, switchMap} from "rxjs";
import {EventService} from "../../event/service/event.service";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  static CART_STORAGE_KEY = 'cart_event_ids';

  private readonly eventsService = inject(EventService);
  private readonly updatedCart$ = new Subject<void>();

  /**
   * Retrieves a list of stored event IDs.
   * @returns {string[]} List of event IDs from local storage.
   */
  getEventIds(): string[] {
    const storageItem = localStorage.getItem(CartService.CART_STORAGE_KEY);
    if (storageItem) {
      return JSON.parse(storageItem) as string[];
    }
    return [];
  }

  /**
   * Fetches stored events based on the IDs in the cart.
   * @returns {Observable<Event[]>} An Observable with the events in the cart.
   */
  getEvents() {
    return this.updatedCart$.pipe(
      startWith(undefined),
      map(() => this.getEventIds()),
      switchMap((eventIds) => this.eventsService.findAll().pipe(
        map(events => events.filter(event => eventIds.some(cartEventId => cartEventId === event._id))),
      )),
    );
  }

  /**
   * Returns the count of events in the cart as an Observable.
   * @returns {Observable<number>} An Observable with the count of events in the cart.
   */
  getEventsCount(): Observable<number> {
    return this.updatedCart$.pipe(
      startWith(undefined),
      map(() => this.getEventIds().length),
    );
  }

  /**
   * Adds an event to the cart list if it's not already present.
   * @param {string} id - The ID of the event to add.
   */
  addEvent(id: string) {
    const eventIds = this.getEventIds();
    if (!eventIds.some(eventId => eventId === id)) {
      this.updateStorage([...eventIds, id]);
    }
  }

  /**
   * Removes an event from the cart list.
   * @param {string} id - The ID of the event to remove.
   */
  removeEvent(id: string) {
    const eventIds = this.getEventIds();
    const index = eventIds.findIndex(eventId => eventId === id);
    eventIds.splice(index, 1);
    this.updateStorage(eventIds);
  }

  /**
   * Updates the event IDs in local storage and notifies of changes.
   * @param {string[]} eventIds - The updated list of event IDs.
   * @private
   */
  private updateStorage(eventIds: string[]) {
    localStorage.setItem(CartService.CART_STORAGE_KEY, JSON.stringify(eventIds));
    this.updatedCart$.next();
  }
}
