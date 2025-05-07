import React from 'react';
<<<<<<< HEAD
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
=======
import ReactDOM from 'react-dom/client'; // ganti dari 'react-dom' ke 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
// import * as serviceWorker from './serviceWorker'; // bisa dihapus jika tidak digunakan
>>>>>>> Rumah Makan

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

<<<<<<< HEAD
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
=======
// serviceWorker.unregister(); // hapus atau abaikan jika tidak dipakai
>>>>>>> Rumah Makan
