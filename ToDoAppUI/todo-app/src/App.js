import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import './App.css';
import Login from './Pages/Login';
import Registration from "./Pages/Registration";
import TodoList from "./Pages/ToDoList";
import ToDoItemEdit from "./Pages/ToDoItemEdit"

function App() {

  return (
    <BrowserRouter>
      <header className="header">
        <div className="container header-container">
          <img src={'https://beta.novascotia.ca//themes/ignition/img/nsvip-en.svg'} className="logo-img" alt="Province of Nova Scotia" />
          <h1>
            To Do Application
          </h1>
        </div>
      </header>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="registration" element={<Registration />} />
        <Route path="todoitems" element={<TodoList />} />
        <Route path="edittodoitem" element={<ToDoItemEdit />} />
      </Routes>
      <footer id="footer" className="footer ribbon">
        <div className="container">
          <ul className="footer-statement-links">
            <li><a href="https://beta.novascotia.ca/privacy">Privacy</a></li>
            <li><a href="https://beta.novascotia.ca/terms">Terms</a></li>
          </ul>
          <div aria-label="copyright" className="copyright">
            <small><a href="https://beta.novascotia.ca/copyright">Crown copyright © Government of Nova Scotia</a></small>
          </div>
        </div>
      </footer>
    </BrowserRouter>
  );
}


export default App;