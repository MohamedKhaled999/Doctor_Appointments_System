// import { HttpInterceptorFn } from '@angular/common/http';

// export const headerInterceptor: HttpInterceptorFn = (req, next) => {
// // Intercept the request and add the token to the headers if it exists
// //&&(req.url.includes('cart')||req.url.includes('orders')||req.url.includes('wishlist'))

//   if (localStorage.getItem('userToken') ){
//       console.log('Adding token to request headers',req);
//       // add bearer token to the request headers
//       req = req.clone({
//         setHeaders: {  Authorization: `Bearer ${localStorage.getItem('userToken')}`
//       }
//       });
   
// }
//   return next(req);

// };

import { HttpInterceptorFn } from '@angular/common/http';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('userToken');

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  }

  return next(req);
};


