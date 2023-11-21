import { Routes } from '@angular/router';
import {EventsComponent} from "./event/page/events/events.component";

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'events'
  },
  {
    path: 'events',
    component: EventsComponent
  }
];
