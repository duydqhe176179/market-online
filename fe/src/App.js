import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './userPage/Home';
import Signin from './userPage/Signin';
import SignupS from './userPage/SignupS';
import SignupE from './userPage/SignupE';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/signin' element={<Signin/>}/>
        <Route path='/signupS' element={<SignupS/>}/>
        <Route path='/signupE' element={<SignupE/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
