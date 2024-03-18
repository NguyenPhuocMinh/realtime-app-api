import { response, Response } from 'express';
import { AUTHORIZATION_KEY } from '../../constants';

export const setAuthorizationCookie = (response: Response, toolBox: any) => {
  const { accessToken, APP_ENV } = toolBox;
  response.cookie(AUTHORIZATION_KEY, accessToken, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // ms,
    httpOnly: true,
    sameSite: 'strict',
    secure: APP_ENV === 'production',
  });
};

export const clearAuthorizationCookie = (response: Response) => {
  response.clearCookie(AUTHORIZATION_KEY);
};
