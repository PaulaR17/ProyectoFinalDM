import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private uid: string | null = null;
  private role: string | null = null;

  setUser(uid: string, role: string) {
    this.uid = uid;
    this.role = role;
  }

  getUid(): string | null {
    return this.uid;
  }

  getRole(): string | null {
    return this.role;
  }

  clearUser() {
    this.uid = null;
    this.role = null;
  }
}
