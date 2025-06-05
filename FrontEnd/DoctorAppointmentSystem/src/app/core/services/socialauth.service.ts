

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ExternalProvider {
  name: string;
  displayName: string;
  iconClass: string;
}

@Injectable({
  providedIn: 'root'
})
  
export class SocialauthService {
  private apiUrl = '/api/auth/external-logins';

  constructor(private http: HttpClient) {}

  getExternalProviders() {
    return this.http.get<ExternalProvider[]>(this.apiUrl);
  }

  externalLogin(provider: string) {
    window.location.href = `${this.apiUrl}/${provider}`;
  }
}