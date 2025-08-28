import { useEffect, useState } from "react";
import DefaultTemplate from "../../../components/DefaultTemplate";
import { toast } from "react-toastify";
import api from "../../../services/api";
import CadastroSetor from "../cadastro";
import ListaSetores from "../setores";
import styles from "./style.module.scss";


const Setor = () => {
  const [setores, setSetores] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [showCadastro, setShowCadastro] = useState(false);

  const token = JSON.parse(localStorage.getItem("@token"));

  // Carrega setores e unidades
  useEffect(() => {
    carregarSetores();
    carregarUnidades();
  }, []);

  const carregarSetores = async () => {
    try {
      const response = await api.get("/setor", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSetores(response.data);
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Erro ao carregar setores");
    }
  };

  const carregarUnidades = async () => {
    try {
      const response = await api.get("/unidade", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnidades(response.data);
    } catch (error) {
      toast.error("Erro ao carregar unidades");
    }
  };

  const handleCadastro = async (payload) => {
    payload.unidadeId = Number(payload.unidadeId);
    payload.nome = payload.nome.toUpperCase();

    try {
      await api.post("/setor", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Setor criado!");
      setShowCadastro(false);
      carregarSetores();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao cadastrar setor");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar este setor?")) return;

    try {
      await api.delete(`/setor/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Setor deletado!");
      carregarSetores();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao deletar setor");
    }
  };

  return (
    <DefaultTemplate>
      <div className={styles.header}>
        <h1 className={styles.title}>Setores</h1>
        {!showCadastro && (
          <button
            onClick={() => setShowCadastro(true)}
            className={styles.buttonCadastrar}
          >
            Cadastrar
          </button>
        )}
      </div>

      {/* Formulário de cadastro */}
      {showCadastro && (
        <CadastroSetor
          onSubmit={handleCadastro}
          unidades={unidades}
          onCancel={() => setShowCadastro(false)}
        />
      )}

      {/* Lista de setores */}
      {!showCadastro && (
        <ListaSetores setores={setores} onDelete={handleDelete} />
      )}
    </DefaultTemplate>
  );
};

export default Setor;
