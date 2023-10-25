//===========================================================================
//  
//===========================================================================
import Cookies from 'js-cookie';

const parseJWT = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const uriComponent = atob(base64).split('').map((char) => {
    return '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2);
  }).join('');
  const payload = decodeURIComponent(uriComponent);
  return JSON.parse(payload);
};

export const getAuthData = () => {
  const jwt_cookie = Cookies.get('jwt');
  console.log('jwt cookie:', jwt_cookie);
  if (!jwt_cookie) return null;
  return parseJWT(jwt_cookie);
};

export const removeToken = () => {
  Cookies.remove('jwt');
};

export const getAuthToken = () => (Cookies.get('jwt') || null);

//===========================================================================