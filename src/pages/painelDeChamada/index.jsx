import { useState, useEffect, useRef } from "react";
import styles from "./styles.module.scss";
import io from "socket.io-client";

const Painel = () => {
  const [ultimaSenhaNormal, setUltimaSenhaNormal] = useState(
    localStorage.getItem("ultimaSenhaNormal") || null
  );
  const [ultimaSenhaPrioritario, setUltimaSenhaPrioritario] = useState(
    localStorage.getItem("ultimaSenhaPrioritario") || null
  );

  const vozRef = useRef(null);

  // Carrega as vozes ao iniciar
  useEffect(() => {
    const carregarVozes = () => {
      const voices = speechSynthesis.getVoices();
      const vozBrasileira = voices.find((voice) => voice.lang === "pt-BR");

      if (vozBrasileira) {
        vozRef.current = vozBrasileira;
      }
    };

    carregarVozes();

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = carregarVozes;
    }
  }, []);

  // Função para falar a senha
  const falarSenha = (senha, setor, tipo, guiche = null) => {
    const guicheFormatado = guiche?.replace("guiche", "Guichê ");
    const frase = guiche
      ? `Senha número ${senha}, ${tipo}, no setor ${setor}, ${guicheFormatado}`
      : `Senha número ${senha}, ${tipo}, setor ${setor}`;
    console.log("🗣️ Frase a ser falada:", frase);

    const utterance = new SpeechSynthesisUtterance(frase);
    utterance.lang = "pt-BR";

    if (vozRef.current) {
      utterance.voice = vozRef.current;
    }

    speechSynthesis.cancel(); // evita sobreposição de falas
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log("✅ Conectado ao servidor WebSocket com ID:", socket.id);
      socket.emit("teste-conexao", { mensagem: "Painel conectado!" });
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Erro de conexão com WebSocket:", err.message);
    });

    socket.on("chamar-senha", (data) => {
      console.log("🎯 Evento chamar-senha recebido:", data);

      falarSenha(data.senha, data.setor, data.tipo, data.guiche);

      if (data.tipo === "normal") {
        setUltimaSenhaNormal(data.senha);
        localStorage.setItem("ultimaSenhaNormal", data.senha);
      } else if (data.tipo === "prioritario") {
        setUltimaSenhaPrioritario(data.senha);
        localStorage.setItem("ultimaSenhaPrioritario", data.senha);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.headerArea}>
        <div className={styles.normal}>
          <p>ATENDIMENTO NORMAL</p>
          <span>{ultimaSenhaNormal ? `Senha: 0${ultimaSenhaNormal}` : "Nenhuma chamada"}</span>
        </div>
        <div className={styles.prioritario}>
          <p>ATENDIMENTO PRIORITÁRIO</p>
          <span>{ultimaSenhaPrioritario ? `Senha: 0${ultimaSenhaPrioritario}` : "Nenhuma chamada"}</span>
        </div>
      </div>
      <div className={styles.slideArea}>
        <p>Slides serão exibidos aqui</p>
      </div>
    </div>
  );
};

export default Painel;
