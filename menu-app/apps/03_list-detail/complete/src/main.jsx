/* main.jsx - 라우터를 여기서 감싼다

   BrowserRouter 가 주소창을 지켜보다가, 주소에 맞는 화면을 골라 준다.
   앱 전체를 감싸야 하므로 가장 바깥에 둔다. */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>
);
