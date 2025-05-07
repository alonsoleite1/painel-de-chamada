import { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import io from "socket.io-client";

const socket = io("http://localhost:3000"); // Conecta-se ao servidor WebSocket

const Painel = () => {
  const [ultimaSenhaNormal, setUltimaSenhaNormal] = useState(null);
  const [ultimaSenhaPrioritario, setUltimaSenhaPrioritario] = useState(null);

  // Função para falar a senha
  const falarSenha = (senha, setor, tipo) => {
    const frase = `Senha número ${senha}, ${tipo}, setor ${setor}`;
    const utterance = new SpeechSynthesisUtterance(frase);
    utterance.lang = "pt-BR";

    // Obtém a lista de vozes disponíveis
    const voices = speechSynthesis.getVoices();

    // Encontra uma voz feminina em português do Brasil
    const vozFeminina = voices.find(voice => voice.lang === 'pt-BR' && voice.name.toLowerCase().includes('feminina'));

    if (vozFeminina) {
      utterance.voice = vozFeminina; // Define a voz feminina encontrada
    }

    // Reproduz a fala com a voz escolhida
    speechSynthesis.speak(utterance);
  };
  useEffect(() => {
    socket.on("chamar-senha", (data) => {
      console.log("Recebido evento para chamar a senha:", data); // Verifique se o evento está chegando corretamente
  
      // Processa a senha de acordo com o setor
      if (data.setor && data.senha) {
        falarSenha(data.senha, data.setor, data.tipo);
      }
  
      // Se o guichê estiver presente, faça algo com essa informação
      if (data.guiche) {
        console.log(`A chamada foi para o guichê: ${data.guiche}`);
        // Você pode atualizar a UI do painel para exibir qual guichê está ativo
      }
  
      // Dependendo da lógica, pode ser necessário atualizar a UI para refletir o guichê ou setor chamado
    });
  
    // Cleanup do evento
    return () => {
      socket.off("chamar-senha");
    };
  }, []);
  
  

  return (
    <div className={styles.container}>
      <div className={styles.headerArea}>
        <div className={styles.normal}>
          <p>Atendimento Normal</p>
          <span>{ultimaSenhaNormal ? `Senha: ${ultimaSenhaNormal}` : "Nenhuma chamada"}</span>
        </div>
        <div className={styles.prioritario}>
          <p>Atendimento Prioritário</p>
          <span>{ultimaSenhaPrioritario ? `Senha: ${ultimaSenhaPrioritario}` : "Nenhuma chamada"}</span>
        </div>
      </div>
      <div className={styles.slideArea}>
        <p>Slides serão exibidos aqui</p>
      </div>
    </div>
  )   
};

export default Painel;
