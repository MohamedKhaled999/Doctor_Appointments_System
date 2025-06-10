import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Server
  },
  
  
  //   {
  //   path: 'profile/doctor/:id',
  //   renderMode:RenderMode.Server
  // },
  
];
