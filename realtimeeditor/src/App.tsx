import './App.css';
import { RouterProvider, createBrowserRouter, } from 'react-router-dom'
import EditorHome from './pages/EditorHome';
import EditorEdit from './pages/EditorEdit';
import React from 'react'
import { Toaster } from 'react-hot-toast'
import './assets/main.css';
import './index.css'

const router = createBrowserRouter([
  { path: '/EditorHome', element: <EditorHome /> },
  { path: 'EditorEdit/:roomId', element: <EditorEdit /> }
]);

function App() {
  return (<React.Fragment>
    <div>
      <Toaster position='top-right' ></Toaster>
    </div>

    <RouterProvider router={router} />
  </React.Fragment>
  );
}

export default App;
