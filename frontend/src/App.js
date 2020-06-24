import React from 'react';
import './App.css';
import Layout from './Layout';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css'; 

function App() {
  return (
    <div>
      <ToastContainer position={"bottom-right"} autoClose={3000} closeButton={false}/>
      <Layout />
    </div>
  );
}

export default App;
