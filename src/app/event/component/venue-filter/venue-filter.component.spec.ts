import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueFilterComponent } from './venue-filter.component';

describe('VenueFilterComponent', () => {
  let component: VenueFilterComponent;
  let fixture: ComponentFixture<VenueFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VenueFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VenueFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
