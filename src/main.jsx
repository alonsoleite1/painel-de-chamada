import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { UsuarioContextProvider } from './provider/userContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UsuarioContextProvider>
        <App />
      </UsuarioContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
