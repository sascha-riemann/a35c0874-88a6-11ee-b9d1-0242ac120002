import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, startWith, Subject, switchMap} from "rxjs";
import {EventService} from "../../event/service/event.service";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  static EVENTS_STORAGE_KEY = 'eventIds';

  private readonly eventsService = inject(EventService);
  private readonly updatedCart$ = new Subject<void>();

  getEventIds(): string[] {
    const storageItem = localStorage.getItem(CartService.EVENTS_STORAGE_KEY);
    if (storageItem) {
      return JSON.parse(storageItem) as string[];
    }
    return [];
  }

  getEvents() {
    return this.updatedCart$.pipe(
      startWith(undefined),
      map(() => this.getEventIds()),
      switchMap((eventIds) => this.eventsService.findAll().pipe(
        map(events => events.filter(event => eventIds.some(cartEventId => cartEventId === event._id))),
      )),
    );
  }

  getEventsCount(): Observable<number> {
    return this.updatedCart$.pipe(
      startWith(undefined),
      map(() => this.getEventIds().length),
    );
  }

  addEvent(id: string) {
    const eventIds = this.getEventIds();
    if (!eventIds.some(eventId => eventId === id)) {
      this.updateStorage([...eventIds, id]);
    }
  }

  removeEvent(id: string) {
    const eventIds = this.getEventIds();
    const index = eventIds.findIndex(eventId => eventId === id);
    eventIds.splice(index, 1);
    this.updateStorage(eventIds);
  }

  private updateStorage(eventIds: string[]) {
    localStorage.setItem(CartService.EVENTS_STORAGE_KEY, JSON.stringify(eventIds));
    this.updatedCart$.next();
  }
}
