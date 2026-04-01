import axios from 'axios';
import { privateApi } from './privateapi';
// const API_BASE_URL = 'http://localhost:3001/api';
const API_BASE_URL = 'https://backend.com.jplawsuvidha.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// A separate instance for the production backend if needed
const prodApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const authService = {
  validateLogin: async (signal?: AbortSignal) => {
    console.log('login hit frontedn 2')
    try {
      const res = await api.get('/validate', { withCredentials: true, signal });
      return res;
    } catch (err) {
      throw err;
    }
  },

  login: async (email, password) => {
    try {
      const res = await api.post('/login', { email, password });
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  logout: async () => {
    try {
      await api.post('/logout', {}, { withCredentials: true });
    } catch (err) {
      throw err;
    }
  },
  refresh: async () => {
    try {
      const res = await api.post('/auth/refresh', {}, { withCredentials: true });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
};

export const registerService = {
  subscribe: async (formData) => {
    try {
      console.log('status for frontend')
      const res = await api.post('/register', { formData });
      // return res.data;
    } catch (err) {
      throw err;
    }
  },
};

export const contactService = {
  submitCase: async (newEntry) => {
    try {
      const res = await prodApi.post('/webClients', { newEntry });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
};

export const orderService = { // This is for payment-route
  getOrder: async (id: string) => {
    try {
      const res = await api.get(`/orders/${id}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  }
};

export const profileService = {
  getProfile: async (signal?: AbortSignal) => {
    try {
      const res = await privateApi.get('/profile', { signal });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  updateProfile: async (profileData: any, token?: string) => {
    try {
      const res = await privateApi.put('/profile', profileData);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  uploadProfilePhoto: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      // Do NOT set Content-Type manually — axios auto-sets it with the
      // correct multipart boundary when it detects a FormData body.
      const res = await privateApi.post('/profile/upload-profile', formData);
      return res.data; // { message, imageUrl }
    } catch (err) {
      throw err;
    }
  },
};

export const leadService = {
  getLeads: async (signal?: AbortSignal) => {
    try {
      const res = await privateApi.get('/leads', { signal });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  updateLead: async (id: number | string, data: any) => {
    try {
      const res = await privateApi.put(`/leads/${id}`, data);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  addActivity: async (leadId: number | string, activity: string) => {
    try {
      const res = await privateApi.post(`/leads/${leadId}/activity`, { activity });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  getActivities: async (leadId: number | string, signal?: AbortSignal) => {
    try {
      const res = await privateApi.get(`/leads/${leadId}/activity`, { signal });
      return res.data;
    } catch (err) {
      throw err;
    }
  }
};
export const subscriptionService = {
  getSubscription: async (signal?: AbortSignal) => {
    try {
      const res = await privateApi.get('/subscriptiondetails', { signal });
      return res.data;
    } catch (err) {
      throw err;
    }
  }
};

export const calendarService = {
  getEvents: async (signal?: AbortSignal) => {
    try {
      const res = await privateApi.get('/custom/events', { signal });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (eventData: any) => {
    try {
      const res = await privateApi.post('/custom/event', eventData);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  updateEvent: async (id: number | string, eventData: any) => {
    try {
      const res = await privateApi.put(`/custom/event/${id}`, eventData);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  deleteEvent: async (id: number | string) => {
    try {
      const res = await privateApi.delete(`/custom/event/${id}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  syncGoogle: async (userId: string | number) => {
    try {
      const res = await api.get(`/auth/google/status/${userId}`, { withCredentials: true });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  updateGoogleEvent: async (googleId: string, summary: string) => {
    try {
      const res = await privateApi.put(`/calendar/events/${googleId}`, { summary });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  deleteGoogleEvent: async (googleId: string) => {
    try {
      const res = await privateApi.delete(`/calendar/events/${googleId}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  }
};

export default api;
