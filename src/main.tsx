import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Main from "./pages/Main"; 

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Platform 
          dark={dark} 
          setDark={setDark} 
          task={task} 
          setTask={setTask} 
        />
      ),
    },
  ]);

  return <RouterProvider router={router} />;
};

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
