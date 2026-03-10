import {
  AUTH_STORAGE_KEY,
  login as apiLogin,
  register as apiRegister,
  setAuthToken,
  type StrapiUser,
} from 'config/api';
import axios from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';

export class AuthStore {
  user: StrapiUser | null = null;
  jwt: string | null = null;
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { deep: false });
    if (typeof window !== 'undefined') this._loadStoredAuth();
  }

  get isAuthenticated(): boolean {
    return this.jwt != null && this.user != null;
  }

  private _loadStoredAuth(): void {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as { jwt?: string; user?: StrapiUser };
      if (data.jwt) {
        this.jwt = data.jwt;
        this.user = data.user ?? null;
        setAuthToken(data.jwt);
      }
    } catch {
      this._clearStoredAuth();
    }
  }

  private _clearStoredAuth(): void {
    if (typeof window !== 'undefined') localStorage.removeItem(AUTH_STORAGE_KEY);
    this.user = null;
    this.jwt = null;
    setAuthToken(null);
  }

  private _persistAuth(jwt: string, user: StrapiUser): void {
    this.jwt = jwt;
    this.user = user;
    setAuthToken(jwt);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ jwt, user }));
      } catch {
      }
    }
  }

  async login(identifier: string, password: string): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      const { user, jwt } = await apiLogin(identifier, password);
      runInAction(() => {
        this._persistAuth(jwt, user);
        this.loading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error =
          axios.isAxiosError(err) && err.response?.data?.error?.message
            ? String(err.response.data.error.message)
            : err instanceof Error
              ? err.message
              : 'Login failed';
        this.loading = false;
      });
      throw err;
    }
  }

  async register(username: string, email: string, password: string): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      const { user, jwt } = await apiRegister(username, email, password);
      runInAction(() => {
        this._persistAuth(jwt, user);
        this.loading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error =
          axios.isAxiosError(err) && err.response?.data?.error?.message
            ? String(err.response.data.error.message)
            : err instanceof Error
              ? err.message
              : 'Registration failed';
        this.loading = false;
      });
      throw err;
    }
  }

  logout(): void {
    runInAction(() => {
      this._clearStoredAuth();
    });
  }
}
