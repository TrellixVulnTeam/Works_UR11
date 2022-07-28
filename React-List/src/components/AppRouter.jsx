import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from '../context';
import { privateRoutes, publicRoutes } from '../router';
import Loader from './UI/Loader/Loader';


const AppRouter = () => {
  const {isAuth, isLoading} = useContext(AuthContext);

  if(isLoading) {
    return <Loader />
  }

  return (
    isAuth
        ?
        <Routes>
            {privateRoutes.map(route =>
              <Route key={route.key} path={route.path} element={<route.element />} />
            )}
            <Route
              path="*"
              element={<Navigate to="/posts" replace />}
            />
        </Routes>
        :
        <Routes>
            {publicRoutes.map(route =>
              <Route key={route.key} path={route.path} element={<route.element />} />
            )}
            <Route
              path="*"
              element={<Navigate to="/login" replace />}
            />
        </Routes>
  );
};

export default AppRouter;
