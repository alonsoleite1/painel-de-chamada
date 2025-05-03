import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import DefaultTemplate from "../../components/DefaultTemplate";
import styles from "./styles.module.scss";

const Operador = () => {
  const [fila, setFila] = useState({
    normal: [],
    prioritario: [],
    coordenacao: [],
  });

  const [atendimentoAtual, setAtendimentoAtual] = useState(null);
  const [atendimentosFinalizados, setAtendimentosFinalizados] = useState([]);
  const { handleSubmit } = useForm();

  // Simula dados recebidos da API
  useEffect(() => {
    const dadosExemplo = {
      normal: [
        { id: 1, numero: "N001" },
        { id: 4, numero: "N002" },
      ],
      prioritario: [
        { id: 2, numero: "P001" },
        { id: 5, numero: "P002" },
      ],
      coordenacao: [
        { id: 3, numero: "C001" },
        { id: 6, numero: "C002" },
      ],
    };
    setFila(dadosExemplo);
  }, []);

  const chamarProximo = async (tipo) => {
    const proximo = fila[tipo][0];
    if (!proximo) return;

    // Simula uma chamada de API
    setTimeout(() => {
      console.log(`Atualizado ${proximo.numero} para "em_atendimento"`);
      setAtendimentoAtual({ ...proximo, tipo });
      setFila((prev) => ({
        ...prev,
        [tipo]: prev[tipo].slice(1),
      }));
    }, 500);
  };

  const finalizarAtendimento = async () => {
    if (!atendimentoAtual) return;

    // Simula uma chamada de API
    setTimeout(() => {
      console.log(`Finalizado atendimento de ${atendimentoAtual.numero}`);
      setAtendimentosFinalizados((prev) => [
        ...prev,
        { ...atendimentoAtual, status: "encerrado" },
      ]);
      setAtendimentoAtual(null);
    }, 500);
  };

  return (
    <DefaultTemplate>
      <div className={styles.container}>
        {/* Seção de Botões */}
        {!atendimentoAtual && (
          <div className={styles.botoes}>
            {["normal", "prioritario", "coordenacao"].map((tipo) => (
              <div key={tipo} className={styles.botaoBox}>
                <button onClick={() => chamarProximo(tipo)}>{tipo}</button>
                <span>{fila[tipo].length} aguardando</span>
              </div>
            ))}
          </div>
        )}

        {/* Seção de Atendimento Ativo */}
        {atendimentoAtual && (
          <form
            onSubmit={handleSubmit(finalizarAtendimento)}
            className={styles.form}
          >
            <h2 className={styles.senhaDestaque}>
              Senha: {atendimentoAtual.numero}
            </h2>
            <button
              type="button"
              className={styles.chamarNovamente}
              onClick={() => chamarProximo(atendimentoAtual.tipo)}
            >
              Chamar Novamente
            </button>
            <button type="submit" className={styles.finalizar}>
              Finalizar
            </button>
          </form>
        )}

        {/* Seção de Atendimentos Finalizados */}
        <div className={styles.atendimentosFinalizados}>
          <h3>Atendimentos Finalizados</h3>
          <ul>
            {atendimentosFinalizados.map((atendimento) => (
              <li key={atendimento.id}>
                {atendimento.numero} - {atendimento.status}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DefaultTemplate>
  );
};

export default Operador;
