import { API_URL } from "./api";

const TOKEN_KEY = "connect2job_token";

export const authService = {

  async register(userData) {

    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    return response.json();
  },

  async login(email, password) {

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    return response.json();
  },

  async getCurrentUser(token) {

    const response = await fetch(`${API_URL}/auth/me`, {

      headers: {
        Authorization: `Bearer ${token}`,
      },

    });

    return response.json();
  },

  saveToken(token) {

    localStorage.setItem(TOKEN_KEY, token);

  },

  getToken() {

    return localStorage.getItem(TOKEN_KEY);

  },

  logout() {

    localStorage.removeItem(TOKEN_KEY);

  },

};