import { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import io from "socket.io-client";


const Painel = () => {
  const [ultimaSenhaNormal, setUltimaSenhaNormal] = useState(null);
  const [ultimaSenhaPrioritario, setUltimaSenhaPrioritario] = useState(null);

  // Função para falar a senha
  const falarSenha = (senha, setor, tipo, guiche = null) => {
    console.log("🔈 Chamando senha com dados:", { senha, setor, tipo, guiche });
    const guicheFormatado = guiche?.replace("guiche", "Guichê ");
    const frase = guiche
      ? `Senha número ${senha}, ${tipo}, no setor ${setor}, ${guicheFormatado}`
      : `Senha número ${senha}, ${tipo}, setor ${setor}`;
  
    const utterance = new SpeechSynthesisUtterance(frase);
    utterance.lang = "pt-BR";
  
    const setVoiceAndSpeak = () => {
      const voices = speechSynthesis.getVoices();
      const vozBrasileira = voices.find((voice) => voice.lang === "pt-BR");
  
      if (vozBrasileira) {
        utterance.voice = vozBrasileira;
      }
  
      speechSynthesis.speak(utterance);
    };
  
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.addEventListener("voiceschanged", setVoiceAndSpeak);
    } else {
      setVoiceAndSpeak();
    }
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
    
      // 🗣️ Fala a senha, incluindo o guichê se houver
      falarSenha(data.senha, data.setor, data.tipo, data.guiche);
    
      // Atualiza o estado da senha exibida
      if (data.tipo === "normal") {
        setUltimaSenhaNormal(data.senha);
      } else if (data.tipo === "prioritario") {
        setUltimaSenhaPrioritario(data.senha);
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
  )   
};

export default Painel;
