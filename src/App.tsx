
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Build from "./pages/build"

function App() {

  return (
    <BrowserRouter>

            <Routes>
                  <Route path="/" element={<Home />} />    
                  <Route path="/build" element={<Build />} /> 
                  
            </Routes>

    </BrowserRouter>
  

  );
}

export default App;