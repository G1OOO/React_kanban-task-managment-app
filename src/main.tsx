import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Main from "./pages/Main"; 

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);