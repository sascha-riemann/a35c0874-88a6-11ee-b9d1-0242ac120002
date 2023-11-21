import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, shareReplay, tap} from "rxjs";
import {Event, Venue} from '../model/event';
import {compareAsc, compareDesc, isSameDay, startOfDay} from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private readonly http = inject(HttpClient);

  /**
   * An Observable containing a stream of Event arrays retrieved.
   * The stream is shared using 'shareReplay' to allow multiple subscribers without re-fetching data.
   * @type {Observable<Event[]>}
   */
  private readonly events$: Observable<Event[]> = this.http.get<Event[]>('data/london-events.json').pipe(
    shareReplay({
      bufferSize: 1,
      refCount: true,
    })
  );

  /**
   * Filter events based on search criteria.
   * @param {Event[]} events - An array of Event objects to filter.
   * @param {string} [searchTerm] - Optional. The search term to filter events by title.
   * @param {string[]} [excludeEventIds=[]] - Optional. An array of event IDs to exclude from the results.
   * @param {string[]} [filterVenueIds=[]] - Optional. An array of venue IDs to filter events by venue.
   * @returns {Event[]} - An array of filtered Event objects.
   */
  private filterEvents(events: Event[], searchTerm?: string, excludeEventIds: string[] = [], filterVenueIds: string[] = []): Event[] {
    return events.filter(event => {
      const isNotExcluded = !excludeEventIds.some(excludedEventId => event._id === excludedEventId);
      const searchTermMatch = !searchTerm || event.title.includes(searchTerm);
      const venueMatch = !filterVenueIds.length || filterVenueIds.some(venueId => venueId === event.venue.id);
      return isNotExcluded && searchTermMatch && venueMatch;
    });
  }

  /**
   * Find all events based on search criteria.
   * @param {string} [search] - Optional. The search term to filter events by title.
   * @param {string[]} [excludeEventIds=[]] - Optional. An array of event IDs to exclude from the results.
   * @param {string[]} [filterVenueIds=[]] - Optional. An array of venue IDs to filter events by venue.
   * @returns {Observable<Event[]>} - An Observable emitting an array of filtered Event objects.
   */
  findAll(search?: string, excludeEventIds: string[] = [], filterVenueIds: string[] = []): Observable<Event[]> {
    return this.events$.pipe(
      map(events => this.filterEvents(events, search, excludeEventIds, filterVenueIds)),
      map(events => events.sort((eventA, eventB) => compareAsc(new Date(eventA.date), new Date(eventB.date)))),
    );
  }

  /**
   * Find all events grouped by date based on search criteria.
   * @param {string} [search] - Optional. The search term to filter events by title.
   * @param {string[]} [excludeEventIds=[]] - Optional. An array of event IDs to exclude from the results.
   * @param {string[]} [filterVenueIds=[]] - Optional. An array of venue IDs to filter events by venue.
   * @returns {Observable<{ date: Date, events: Event[] }[]>} - An Observable emitting an array of objects with date and corresponding events.
   */
  findAllGroupedByDate(search?: string, excludeEventIds: string[] = [], filterVenueIds: string[] = []): Observable<{ date: Date; events: Event[]; }[]> {
    return this.events$.pipe(
      map(events => this.filterEvents(events, search, excludeEventIds, filterVenueIds)),
      map(events => {
        return events.reduce((days: { date: Date, events: Event[] }[], event) => {
          const eventDate = startOfDay(new Date(event.date));
          if (!eventDate) {
            return days;
          }
          const day = days.find((r) => isSameDay(new Date(r.date), eventDate));
          if (day) {
            day.events.push(event);
          } else {
            days.push({
              date: eventDate,
              events: [event]
            });
          }
          return days;
        }, [])
      }),
      map(eventDates => eventDates.sort((eventDateA, eventDateB) => compareAsc(eventDateA.date, eventDateB.date))),
    );
  }

  /**
   * Find venues based on search criteria.
   * @param {string} [search] - Optional. The search term to filter venues by name.
   * @returns {Observable<Venue[]>} - An Observable emitting an array of filtered Venue objects.
   */
  findVenues(search?: string): Observable<Venue[]> {
    return this.events$.pipe(
      map(events => {
        const venues: Venue[] = [];
        events.forEach((event) => {
          const searchMatch = !search || event.venue.name.includes(search);
          if (!venues.some(venue => venue.id === event.venue.id) && searchMatch) {
            venues.push(event.venue);
          }
        })
        return venues;
      }),
    );
  }
}
