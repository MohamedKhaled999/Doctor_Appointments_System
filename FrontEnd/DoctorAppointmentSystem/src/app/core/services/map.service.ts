
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class MapService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async loadLeaflet(): Promise<any> {
    if (isPlatformBrowser(this.platformId)) {
      const L = await import('leaflet');
      await import('leaflet-defaulticon-compatibility');
      return L;
    }
    return null;
  }
}