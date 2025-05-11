import { Route, Routes } from "react-router-dom";
import Login from "../pages/login";
import Selecao from "../pages/selecao";
import Painel from "../pages/painelDeChamada";
import Recepcao from "../pages/recepcao";
import Operador from "../pages/operador";
import Usuarios from "../pages/Usuario/template";

const RoutesMain = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/selecao" element={<Selecao />} />
      <Route path="/usuario" element={<Usuarios />} />
      <Route path="/painel" element={<Painel />} />
      <Route path="/recepcao" element={<Recepcao />} />
      <Route path="/operador" element={<Operador />} />
    </Routes>
  );
};

export default RoutesMain;
