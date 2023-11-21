import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from "../../service/event.service";
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { startWith, switchMap } from "rxjs";
import { Venue } from "../../model/event";

@Component({
  selector: 'app-venue-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './venue-filter.component.html',
  styleUrl: './venue-filter.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: VenueFilterComponent,
      multi: true
    }
  ]
})
export class VenueFilterComponent implements ControlValueAccessor {

  private readonly eventService = inject(EventService);

  private onChange?: (venues: Venue[]) => void;
  private onTouch?: () => void;

  readonly search = new FormControl<string | undefined>(undefined);

  readonly venues$ = this.search.valueChanges.pipe(
    startWith(undefined),
    switchMap(search => this.eventService.findVenues(search as string | undefined))
  );

  readonly selectedVenues: Venue[] = [];

  onSelection(venue: Venue): void {
    const index = this.selectedVenues.findIndex(selectedVenue => selectedVenue.id === venue.id);
    if (index >= 0) {
      this.selectedVenues.splice(index, 1);
    } else {
      this.selectedVenues.push(venue);
    }

    this.onTouch?.();
    this.onChange?.(this.selectedVenues);
  }

  registerOnChange(fn: (venues: Venue[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  writeValue(): void {
    // Not implemented
  }
}
