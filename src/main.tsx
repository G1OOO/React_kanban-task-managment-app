import React from 'react';
import ReactDOM from 'react-dom/client';
import BoardPage from "./pages/BoardPage";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import './index.css';

const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <BoardPage />,
  },
  {
    path: "/dashboard/:boardId",
    element: <BoardPage />,
  },
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
