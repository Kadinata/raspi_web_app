//===========================================================================
//  
//===========================================================================
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import NavRoutes from './NavRoutes';
import { AuthProtected } from '../components/AuthNavigation';
import { PageLayout } from '../views/PageLayout';
import Login from '../views/Login';
import SignUp from '../views/SignUp';
import SystemInfo from '../views/SystemInfo/SystemInfo';
import AccountSettings from '../views/AccountSettings';
import GpioInfo from '../views/GpioInfo/GpioInfo';
import HomeView from '../views/Home';
import Error404 from '../views/404';

const HomeRoute = {
  path: "",
  exact: true,
  element: (
    <AuthProtected redirect="/login">
      <PageLayout routes={NavRoutes} >
        <HomeView />
      </PageLayout>
    </AuthProtected>
  ),
};

const loginRoute = {
  path: "/login",
  exact: true,
  element: (<Login />),
};

const signupRoute = {
  path: "/register",
  exact: true,
  element: (<SignUp />),
};

const systemInfoRoute = {
  path: "/systems",
  exact: true,
  element: (
    <AuthProtected redirect="/login">
      <PageLayout routes={NavRoutes} >
        <SystemInfo />
      </PageLayout>
    </AuthProtected>
  ),
};

const gpioRoute = {
  path: "/gpio",
  exact: true,
  element: (
    <AuthProtected redirect="/login">
      <PageLayout routes={NavRoutes} >
        <GpioInfo />
      </PageLayout>
    </AuthProtected>
  ),
};

const accountSettingsRoute = {
  path: "/account/settings",
  exact: true,
  element: (
    <AuthProtected redirect="/login">
      <PageLayout routes={NavRoutes} >
        <AccountSettings />
      </PageLayout>
    </AuthProtected>
  ),
};

const BrowserRouter = createBrowserRouter([
  {
    path: "/",
    exact: true,
    errorElement: (<Error404 />),
    children: [
      HomeRoute,
      loginRoute,
      signupRoute,
      systemInfoRoute,
      gpioRoute,
      accountSettingsRoute,
    ],
  },
]);

const AppRoutes = () => (<RouterProvider router={BrowserRouter} />);

export default AppRoutes;
//===========================================================================