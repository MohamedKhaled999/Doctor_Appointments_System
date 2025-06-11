import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  },
    
  
    {
    path: 'profile/doctor/:id',
    renderMode:RenderMode.Server
  },
  
];
