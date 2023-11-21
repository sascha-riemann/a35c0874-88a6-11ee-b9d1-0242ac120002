import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { BaseUrlInterceptor } from "./network/base-url.interceptor";
import {DatePipe} from "@angular/common";

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseUrlInterceptor,
      multi: true,
    },
    DatePipe,
    provideRouter(routes)
  ]
};
