import { useState, useEffect, useContext } from "react";
import DefaultTemplate from "../../components/DefaultTemplate";
import api from "../../services/api";
import { toast } from "react-toastify";
import io from "socket.io-client";
import { UsuarioContext } from "../../provider/userContext";
import styles from "./styles.module.scss";

//const socket = io("http://45.70.177.64:3396"); // Conecta-se ao servidor WebSocket
const socket = io("http://localhost:5002"); // Conecta-se ao servidor WebSocket

const Triagem = () => {
  const [fila, setFila] = useState({ normal: [], prioritario: [] });
  const [atendimentoAtual, setAtendimentoAtual] = useState(null);
  const [atendimentosFinalizados, setAtendimentosFinalizados] = useState([]);
  const [ultimoTipoChamado, setUltimoTipoChamado] = useState(null);


  const token = JSON.parse(localStorage.getItem("@token"));
  const unidade = JSON.parse(localStorage.getItem("@unidade"));

  const { user } = useContext(UsuarioContext);

  const buscarAtendimentos = async () => {
    if (!user) return;

    try {
      const { data } = await api.get(`/painel/triagem/${user.unidadeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Separar normal e prioritário sem filtrar por setor
      const filaNormal = data.filter((item) => item.tipo === 'normal');
      const filaPrioritario = data.filter((item) => item.tipo === 'prioritario');

      setFila({ normal: filaNormal, prioritario: filaPrioritario });

      // Se quiser, pode atualizar essa lógica para incluir finalizados se vierem da mesma rota
      setAtendimentosFinalizados([]); // ou manter do jeito atual
    } catch (error) {
      toast.error("Erro ao buscar atendimentos");
      console.error(error);
    }
  };

  useEffect(() => {
    if (unidade) {
      socket.emit("entrar-na-sala", user.unidade); // entra na sala da unidade
      console.log(`Operador conectado na unidade: ${unidade}`);
    }
  }, [user]);


  useEffect(() => {
    buscarAtendimentos();
  }, [token, user]);

  const chamarProximo = async (tipo) => {
    const proximo = fila[tipo][0];
    if (!proximo) return;

    try {
      await api.patch(
        `/painel/${proximo.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAtendimentoAtual({ ...proximo, tipo });
      setUltimoTipoChamado(tipo);
      localStorage.setItem("ultimoTipoChamado", tipo);

      // Emite um evento para o painel chamar a senha
      // console.log("Emitindo evento para o painel:", proximo.senha, proximo.setor);

      // Verifica se o operador está vinculado a um guichê
      if (user.terminal) {
        // Se houver um guichê vinculado, emite a chamada para esse guichê
        console.log("Emitindo evento para o guichê:", user.terminal);
        socket.emit("chamar-senha", {
          senha: proximo.senha,
          nome: proximo.nome,
          setor: user.setor,
          unidade: unidade,  // <-- adiciona aqui
          tipo,
          guiche: user.terminal,
        });

      } else {
        // Caso contrário, chama a senha para o painel sem guichê
        socket.emit("chamar-senha", {
          nome: proximo.nome,
          senha: proximo.senha,
          setor: user.setor,
          unidade: unidade,
          tipo,
        });
      }

      setFila((prev) => ({
        ...prev,
        [tipo]: prev[tipo].slice(1),
      }));
      toast.info(`Chamando senha ${proximo.senha}`);
    } catch (error) {
      toast.error("Erro ao atualizar atendimento");
      console.error(error);
    }
  };

  const repetirChamada = () => {
    if (atendimentoAtual) {
      // Emite um evento para o painel repetir a chamada da senha
      console.log("Repetindo chamada da senha:", atendimentoAtual.senha);
      socket.emit("chamar-senha", {
        nome: atendimentoAtual.nome,
        senha: atendimentoAtual.senha,
        setor: user.setor,
        tipo: atendimentoAtual.tipo,
        unidade: unidade, // <-- adiciona aqui também
        guiche: user.terminal,
      });

    }
  };

  const atualizarTriagem = async () => {
    if (!atendimentoAtual) return;

    try {
      await api.patch(`/painel/${atendimentoAtual.id}`, { triagem: false }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAtendimentosFinalizados((prev) => [
        ...prev,
        { ...atendimentoAtual, status: "encerrado" },
      ]);
      setAtendimentoAtual(null);
      toast.success("Triagem Realizada");
    } catch (error) {
      toast.error("Erro ao finalizar triagem");
      console.error(error);
    }
  };

  useEffect(() => {
    const salvo = localStorage.getItem("ultimoTipoChamado");
    if (salvo) {
      setUltimoTipoChamado(salvo);
    }
  }, []);


  return (
    <DefaultTemplate>
      <div className={styles.container}>
        {!atendimentoAtual && (
          <>
            <div className={styles.atualizarBox}>
              <button className={styles.btnAtualizar} onClick={buscarAtendimentos}>
                🔄 Atualizar Lista
              </button>
            </div>
            {ultimoTipoChamado && (
              <p
                className={`${styles.ultimoTipoChamado} ${ultimoTipoChamado === "prioritario" ? styles.prioritario : ""
                  }`}
              >
                ÚLTIMA SENHA CHAMADA: <span>{ultimoTipoChamado}</span>
              </p>
            )}

            <div className={styles.botoes}>
              {["normal", "prioritario"].map((tipo) => (
                <div key={tipo} className={styles.botaoBox}>
                  <button
                    className={tipo === "normal" ? styles.normal : styles.prioritario}
                    onClick={() => chamarProximo(tipo)}
                  >
                    {tipo === "normal" ? "NORMAL" : "PRIORIDADE"}
                  </button>
                  <ul className={styles.lista}>
                    {fila[tipo].map((item) => (
                      <li key={item.id}>
                        <strong>SENHA: 0{item.senha}</strong>
                        <span className={styles.nome}>{item.nome.toUpperCase()}</span>
                        <span className={styles.motivo}>{item.motivo}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Atendimento Atual */}
        {atendimentoAtual && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              atualizarTriagem();
            }}
            className={styles.form}
          >
            <h2 className={styles.senhaDestaque}>
              Senha: {atendimentoAtual?.senha || "Sem senha"}
            </h2>
            <button
              type="button"
              className={styles.chamarNovamente}
              onClick={repetirChamada}
            >
              Chamar Novamente
            </button>

            <button type="submit" className={styles.finalizar}>
              Finalizar Triagem
            </button>
          </form>
        )}

        {/* Finalizados */}
        <div className={styles.atendimentosFinalizados}>
          <h3>TOTAL DE ATENDIMENTOS - <span> {atendimentosFinalizados.length}</span></h3>
        </div>
      </div>
    </DefaultTemplate>
  );
};

export default Triagem;
