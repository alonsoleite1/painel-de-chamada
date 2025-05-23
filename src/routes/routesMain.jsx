import { Route, Routes } from "react-router-dom";
import Login from "../pages/login";
import Selecao from "../pages/selecao";
import Painel from "../pages/painelDeChamada";
import Recepcao from "../pages/recepcao";
import Operador from "../pages/operador";
import Usuarios from "../pages/Usuario/template";
import Admin from "../pages/admin";
import Unidade from "../pages/Unidade/template";
import Setor from "../pages/setor";

const RoutesMain = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/selecao" element={<Selecao />} />
      <Route path="/usuario" element={<Usuarios />} />
      <Route path="/unidade" element={<Unidade />} />
      <Route path="/setor" element={<Setor />} />
      <Route path="/painel" element={<Painel />} />
      <Route path="/recepcao" element={<Recepcao />} />
      <Route path="/operador" element={<Operador />} />
    </Routes>
  );
};

export default RoutesMain;
