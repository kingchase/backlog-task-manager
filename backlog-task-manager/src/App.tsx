import React from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './components/Login/Login';
import { TaskTable } from './components/Dashboard/TaskTable/TaskTable';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Login/>
        <TaskTable/>
      </header>
    </div>
  );
}

export default App;
