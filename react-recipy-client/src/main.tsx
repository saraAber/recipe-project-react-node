import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './component/App.tsx'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Login from './component/Login.tsx'
import SighnIn from './component/SighnIn.tsx'
import Home from './component/Home.tsx'
import AddRecipe from './component/AddRecipe.tsx'
import EditRecipe from './component/EditRecipe.tsx'
import UserProvider from './use-context/userProvider.tsx'
import categoryProvider, { CategoryContext } from './use-context/categoryProvider.tsx'
import CategoryProvider from './use-context/categoryProvider.tsx'
import RecipeProvider from './use-context/recipesProvider.tsx'

const routs = createBrowserRouter([
  {
    path: '/', // דף הבית הראשי
    element: <App />,
    children: [
      {
        path: '/', // דף הבית הראשי
        element: <Navigate to="/home" />, // הפניה אוטומטית ל-home
      },
    ],
  },
  {
    path: '/home', // דף הבית
    element: <Home />, // קומפוננטת Home
    children: [
      { path: 'login', element: <Login /> },
      { path: 'sighnin', element: <SighnIn /> },
      { path: 'addRecipe', element: <AddRecipe /> },
      { path: 'edit/:id', element: <EditRecipe /> }, // נתיב עריכת מתכון עם ID כפרמטר

    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <CategoryProvider>
    <>
      <UserProvider>
        <>
          <RecipeProvider>
            <>
              <RouterProvider router={routs} />,
            </>
          </RecipeProvider>
        </>
      </UserProvider>
    </>

  </CategoryProvider>
);
