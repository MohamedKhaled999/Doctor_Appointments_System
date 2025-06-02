import { HttpInterceptorFn } from '@angular/common/http';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
// Intercept the request and add the token to the headers if it exists
//&&(req.url.includes('cart')||req.url.includes('orders')||req.url.includes('wishlist'))

  if (localStorage.getItem('userToken') ){
      req= req.clone({
      setHeaders:{token:localStorage.getItem('userToken')!}
  })
}
  return next(req);

};
