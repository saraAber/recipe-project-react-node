import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import '../style-pages/App.css';
import SighnIn from './SighnIn';
import Login from './Login';
import test from '../test';
import Home from './Home';
import UserProvider from '../use-Context/userProvider';
const App = () => {
  return (
    <>
      <UserProvider>
        <>    
        <h1>vf jv</h1>    
          {/* <Home /> */}
        </>
      </UserProvider>
    </>
  )
}

export default App
