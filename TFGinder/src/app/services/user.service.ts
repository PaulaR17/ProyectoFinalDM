import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private uid: string | null = null;
  private role: string | null = null;
  private name: string | null = null;
  private degree: string | null = null;
  private image: string | null = null;
  private email: string | null = null;

  setUser(uid: string, role: string, name: string, degree: string, image: string, email: string) {
    this.uid = uid;
    this.role = role;
    this.name = name;
    this.degree = degree;
    this.image = image;
    this.email = email;
  }

  getUid(): string | null {
    return this.uid;
  }

  getRole(): string | null {
    return this.role;
  }

  getName(): string | null {
    return this.name;
  }

  getDegree(): string | null {
    return this.degree;
  }

  getImage(): string | null {
    return this.image;
  }

  getEmail(): string | null {
    return this.email;
  }

  clearUser() {
    this.uid = null;
    this.role = null;
    this.name = null;
    this.degree = null;
    this.image = null;
    this.email = null;
  }
}
