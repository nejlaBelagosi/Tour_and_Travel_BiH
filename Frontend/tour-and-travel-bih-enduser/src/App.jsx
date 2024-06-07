import logo from './logo.svg';
//import './App.css';
//import components
import ResponsiveAppBar from './components/Header';
import AnimRoutes from './components/AnimRoutes';
//import router
import {BrowserRouter as Router} from 'react-router-dom';
//import Header from './components/Header';
//import motion


function App() {
return(
  <>
  <Router>
    <ResponsiveAppBar />
    <AnimRoutes/> 
  </Router>
  </>
)
}

export default App;