import {HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {Injectable} from "@angular/core";
import {debounce, Observable} from "rxjs";


@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
  /**
   * Intercepts HTTP requests and appends the base URL before sending.
   * @param {HttpRequest<any>} request - The outgoing HTTP request.
   * @param {HttpHandler} next - The next HTTP handler in the chain.
   * @returns {Observable<HttpEvent<any>>} An Observable of the HTTP events.
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(
      request.clone({ url: `${environment.baseUrl}/${request.url}` })
    );
  }
}
