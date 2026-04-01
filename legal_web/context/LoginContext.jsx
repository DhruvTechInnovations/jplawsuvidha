"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../lib/api';
import { setAccessToken as setApiAccessToken } from '../lib/privateapi';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [accessToken, setAccessToken] = useState(null);
  const router = useRouter();

  const updateAccessToken = (token) => {
    setAccessToken(token);
    setApiAccessToken(token);
  };

  useEffect(() => {
    const controller = new AbortController();

    const validateLogin = async () => {
      try {
        setLoading(true)
        console.log('[LoginContext] validateLogin started')
        const res = await authService.validateLogin(controller.signal);

        if (controller.signal.aborted) return;

        console.log('[LoginContext] validateLogin response:', {
          status: res.status,
          data: res.data
        })

        if (res.status === 200 && res.data?.status === 'success') {
          setLogin(true);
          updateAccessToken(res.data.token || null);
          // Note: Backend currently doesn't return user info here, so id/name might be empty
          setId(res.data.user?.email || '');
          console.log('[LoginContext] User authenticated, token set')
        } else {
          console.log('[LoginContext] Not authenticated according to backend')
          setLogin(false);
          updateAccessToken(null);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('[LoginContext] validateLogin error:', err);
          setLogin(false);
          setAccessToken(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          console.log('[LoginContext] validateLogin finished, loading=false')
        }
      }
    };

    validateLogin();
    return () => controller.abort();
  }, []);

  const loginUser = async (email, password) => {
    try {
      setLoading(true);
      console.log('login hit frontend')
      const data = await authService.login(email, password);
      console.log('server response for login', data)

      if (data.status === 'success') {
        setLogin(true);
        // localStorage.setItem('atoken', data.token)
        updateAccessToken(data.token);
        // Backend login at this stage returns { status, token }. 
        // We might need to call validateLogin to get user info if the token is present.
        // For now, let's just set the token and let validation handle the rest.
      } else if (data.status === 'first_time') {
        // For first_time, we don't set login state as they need to set password first.
        setLogin(false);
      }
      else if (data.status === 'un_verify') {

        // For first_time, we don't set login state as they need to set password first.
        setLogin(false);

      }
      return data;
    } catch (err) {
      console.error("Login Failed:", err.response?.data?.message || err.message);
      setLogin(false);
      return err.response?.data;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    try {
      await authService.logout();
      setLogin(false);
      setId('');
      setName('');
      setApiAccessToken(null);
      router.push('/');
    } catch (err) {
      console.error("Logout Failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ login, loginUser, logoutUser, loading, id, name, setId, setName, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.log('use context inside the provider')
  }
  return context
}