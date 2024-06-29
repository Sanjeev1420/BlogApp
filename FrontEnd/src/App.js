import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import { Register } from "./pages/Register";
import  {Single}  from "./pages/Single";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import  Editor  from "./pages/Write";
import {Navbars} from "./components/Navbar"
import {Footer} from "./components/Footer";
import { RecoilRoot, useRecoilState } from "recoil";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./stylesheet/App.scss"
import { Mypost } from "./pages/Mypost";
import { ResetPassword } from "./pages/ResetPassword";
import  Editpost  from "./pages/Editpost";
import { useEffect } from "react";


const Layout=()=>{
  return(<>
  <Navbars/>
  
  <Outlet/>
  <Footer/>
  </>);
}



const router=createBrowserRouter([
  {
    path:"/",
    element:<Layout />,
    children:[
      {
        path:"",
        element:<Home />
      },
      {
        path:"/edit",
        element:<Editpost />
      },
      {
        path:"/single",
        element:<Single />
      },
      {
        path:"/write",
        element:<Editor />
      },
      {
        path:"/mypost",
        element:<Mypost />
      }
    ]
  },
  {
    path:"/resetpassword",
    element:<ResetPassword />
  },
  {
    path:"/Login",
    element:<Login/>
  },
  {
    path:"/register",
    element:<Register/>
  }
])

function App() {
  
   var containerClass=window.innerWidth<780?"container-fluid":"container"
  
  return (
    <div className="app">
      
      <div className={containerClass}>
        <RecoilRoot>
      <RouterProvider router={router}/>
      </RecoilRoot>
      </div>
    </div>
  );
}

export default App;
