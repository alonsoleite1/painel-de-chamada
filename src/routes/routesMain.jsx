import { Route, Routes } from "react-router-dom";
import Login from "../pages/login";
import Selecao from "../pages/selecao";
import Admin from "../pages/admin";
import Painel from "../pages/painelDeChamada";
import Recepcao from "../pages/recepcao";
import Operador from "../pages/operador";

const RoutesMain = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/selecao" element={<Selecao />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/painel" element={<Painel />} />
      <Route path="/recepcao" element={<Recepcao />} />
      <Route path="/operador" element={<Operador />} />
    </Routes>
  );
};

export default RoutesMain;
