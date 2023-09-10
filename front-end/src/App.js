import {createBrowserRouter, RouterProvider, Navigate} from "react-router-dom";
import React, { useCallback, useState} from 'react';

import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';



const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState();


  const login = useCallback((uid) => {
    setIsLoggedIn(true);
    setUserId(uid);
  }, []);

  const logout = useCallback(() => { 
    setIsLoggedIn(false);
    setUserId(null);
  }, []);

  let routesChildren;

  if (isLoggedIn) {
    routesChildren = [
      {
        path: '/',
        element: <Users />
      },
      {
        path: '/:userId/places',
        element: <UserPlaces />
      },
      {
        path: '/places/new',
        element: <NewPlace />
      },
      {
        path: '/places/:placeId',
        element: <UpdatePlace />
      },
      {
        path: '/*',
        element: <Navigate to='/' />
      }
    ];
  } else { 
    routesChildren = [
      {
        path: '/',
        element: <Users />
      },
      {
        path: '/:userId/places',
        element: <UserPlaces />
      },
      {
        path: '/auth',
        element: <Auth />
      },
      {
        path: '/*',
        element: <Navigate to='/' />
      }
    ];
  }

  const routes = createBrowserRouter([
    {
      path: '/',
      element: <MainNavigation />,
      children: routesChildren

    }
  ]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId, login, logout }}>
      <RouterProvider router={routes}/>
    </AuthContext.Provider>
    
  );
}

export default App;
