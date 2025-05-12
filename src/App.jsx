import { useContext } from "react";
import { UsuarioContext } from "./provider/userContext";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { Spinner } from "react-loading-io";
import RoutesMain from "./routes/routesMain";
import "./styles/index.scss";

function App() {
  const { loading } = useContext(UsuarioContext);

  const spinnerCfg = { left: "40%", transform: "translateY(150%)" };
  return (
    <>
        <ToastContainer
          position="top-center"
          autoClose={2000}
        />
        {loading ? <Spinner color="#3498db" style={spinnerCfg} /> : <RoutesMain />}
    </>
  )
}

export default App;
