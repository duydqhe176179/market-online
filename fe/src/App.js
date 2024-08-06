import { BrowserRouter } from 'react-router-dom';
import './App.css';
import store from './redux/configStore';
import { Provider } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
function App() {
  
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
