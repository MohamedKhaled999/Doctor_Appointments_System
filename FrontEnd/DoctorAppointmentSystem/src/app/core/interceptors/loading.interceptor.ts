import { HttpInterceptorFn } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

  
  const spinner: NgxSpinnerService =inject(NgxSpinnerService);

  spinner.show()
  // console.log('Loading interceptor triggered');

  // The interceptor is used to show a loading spinner
  // while HTTP requests are being processed.
  // It uses the NgxSpinnerService to control the spinner's visibility.
  // The interceptor intercepts HTTP requests and
  // console.log('Intercepting request:', req);
  
  
  // Show the spinner before the request is sent
  // and hide it after the response is received.
  // This is done using the finalize operator to ensure
  // that the spinner is hidden regardless of whether
  // the request was successful or resulted in an error.

  return next(req).pipe(finalize(()=>{
    spinner.hide();
  }));
};
