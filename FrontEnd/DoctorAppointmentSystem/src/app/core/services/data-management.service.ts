import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
// This service is responsible for managing data storage and retrieval
export class DataManagementService {

  // Signal to hold user data, initialized with an empty object lke email , role, and displayName 
  // This allows components to reactively update when UserData changes 
  // please continue with the same pattern 
  // public UserData = signal<UserManagementData>({} as UserManagementData);
  public UserRole = signal<string>("");
  public UserName = signal<string>("");
  public isAuthenticated = signal<boolean>(false);

  // you can save what you want in here in signal

  // save spcialties
  public Specialties = signal<string[]>([]);
}
