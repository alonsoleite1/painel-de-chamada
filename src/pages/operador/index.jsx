import { useState, useEffect, useContext } from "react";
import DefaultTemplate from "../../components/DefaultTemplate";
import api from "../../services/api";
import { toast } from "react-toastify";
import io from "socket.io-client"; // Importa a biblioteca do socket
import styles from "./styles.module.scss";
import { UsuarioContext } from "../../provider/userContext";

const socket = io("http://localhost:3000"); // Conecta-se ao servidor WebSocket

const Operador = () => {
  const [fila, setFila] = useState({ normal: [], prioritario: [] });
  const [atendimentoAtual, setAtendimentoAtual] = useState(null);
  const [atendimentosFinalizados, setAtendimentosFinalizados] = useState([]);

  const token = JSON.parse(localStorage.getItem("@token")) || "";

  const { user } = useContext(UsuarioContext);

  useEffect(() => {
    if (!user || !user.setor) return; // Evita erro se user ainda não estiver carregado
  
    const normalize = (str) =>
      str?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
    const buscarAtendimentos = async () => {
      try {
        // Buscando os atendimentos aguardando
        const { data } = await api.get("/painel", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const aguardando = data.filter(
          (item) =>
            item.status === "aguardando" &&
            normalize(item.setor) === normalize(user.setor)
        );
  
        const filaNormal = aguardando.filter((item) => item.tipo === "normal");
        const filaPrioritario = aguardando.filter((item) => item.tipo === "prioritario");
  
        setFila({ normal: filaNormal, prioritario: filaPrioritario });
  
        // Buscando os atendimentos finalizados
        const finalizados = data.filter(
          (item) =>
            item.status === "encerrado" &&
            normalize(item.setor) === normalize(user.setor)
        );
  
        setAtendimentosFinalizados(finalizados); // Atualizando o estado dos finalizados
      } catch (error) {
        toast.error("Erro ao buscar atendimentos");
        console.error(error);
      }
    };
  
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

      // Emite um evento para o painel chamar a senha
      console.log("Emitindo evento para o painel:", proximo.senha, proximo.setor);

      // Verifica se o operador está vinculado a um guichê
      if (user.terminal) {
        // Se houver um guichê vinculado, emite a chamada para esse guichê
        console.log("Emitindo evento para o guichê:", user.terminal);
        socket.emit("chamar-senha", {
          senha: proximo.senha,
          nome:proximo.nome,
          setor: proximo.setor,
          tipo,
          guiche: user.terminal, // Envia o guichê vinculado
        });
      } else {
        // Caso contrário, chama a senha para o painel sem guichê
        socket.emit("chamar-senha", {
          nome:proximo.nome,
          senha: proximo.senha,
          setor: proximo.setor,
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
        nome:atendimentoAtual.nome,
        senha: atendimentoAtual.senha,
        setor: atendimentoAtual.setor,
        tipo: atendimentoAtual.tipo,
        guiche: user.terminal, // Adiciona o guichê novamente
      });
    }
  };

  const finalizarAtendimento = async () => {
    if (!atendimentoAtual) return;

    try {
      await api.patch(`/painel/${atendimentoAtual.id}`, { status: "encerrado" }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAtendimentosFinalizados((prev) => [
        ...prev,
        { ...atendimentoAtual, status: "encerrado" },
      ]);
      setAtendimentoAtual(null);
      toast.success("Atendimento finalizado");
    } catch (error) {
      toast.error("Erro ao finalizar atendimento");
      console.error(error);
    }
  };

  return (
    <DefaultTemplate>
      <div className={styles.container}>
        {/* Botões de chamada */}
        {!atendimentoAtual && (
          <div className={styles.botoes}>
            {["normal", "prioritario"].map((tipo) => (
              <div key={tipo} className={styles.botaoBox}>
                <button onClick={() => chamarProximo(tipo)}>
                  {tipo === "normal" ? "NORMAL" : "PRIORIDADE"}
                </button>
                <ul className={styles.lista}>
                  {fila[tipo].map((item) => (
                    <li key={item.id}>
                      <strong>SENHA: 0{item.senha}</strong>
                      <span>{item.motivo}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Atendimento Atual */}
        {atendimentoAtual && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              finalizarAtendimento();
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
              Finalizar
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

export default Operador;
