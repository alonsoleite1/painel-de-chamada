import { useState, useEffect, useRef } from "react";
import styles from "./styles.module.scss";
import io from "socket.io-client";

const Painel = () => {
  const [destaqueNormal, setDestaqueNormal] = useState(false);
  const [destaquePrioritario, setDestaquePrioritario] = useState(false);
  const [slides, setSlides] = useState([]);
  const [slideAtual, setSlideAtual] = useState(0);

  // Função para aplicar destaque no tipo de atendimento
  const aplicarDestaque = (tipo) => {
    if (tipo === "normal") {
      setDestaqueNormal(true);
      setTimeout(() => setDestaqueNormal(false), 600);
    } else if (tipo === "prioritario") {
      setDestaquePrioritario(true);
      setTimeout(() => setDestaquePrioritario(false), 600);
    }
  };

  // Função para entrar em tela cheia
  const entrarEmTelaCheia = () => {
    const elemento = document.documentElement;
    if (elemento.requestFullscreen) {
      elemento.requestFullscreen().catch((err) => {
        console.error("Erro ao entrar em tela cheia:", err);
      });
    }
  };

  const [ultimaSenhaNormal, setUltimaSenhaNormal] = useState(
    localStorage.getItem("ultimaSenhaNormal") || null
  );
  const [ultimaSenhaPrioritario, setUltimaSenhaPrioritario] = useState(
    localStorage.getItem("ultimaSenhaPrioritario") || null
  );

  const vozRef = useRef(null);

  // Carregar as vozes ao iniciar
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
  const falarSenha = ({ senha, nome, setor, tipo, guiche = null }) => {
    const guicheFormatado = guiche ? `Guichê ${guiche.replace("guiche", "")}` : "";
    const frase = `${nome}, senha de número ${senha}, ${tipo}, no setor ${setor}${guicheFormatado}.`;
  
    console.log("🗣️ Frase a ser falada:", frase);
  
    const utterance = new SpeechSynthesisUtterance(frase);
    utterance.lang = "pt-BR";
  
    if (vozRef.current) {
      utterance.voice = vozRef.current;
    }
  
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  // Requisição ao WebSocket
  useEffect(() => {
    const socket = io("http://45.70.177.64:3396");
   // const socket = io("http://localhost:5002");
    socket.on("connect", () => {
      console.log("✅ Conectado ao servidor WebSocket com ID:", socket.id);
      socket.emit("teste-conexao", { mensagem: "Painel conectado!" });
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Erro de conexão com WebSocket:", err.message);
    });

    socket.on("chamar-senha", (data) => {
      console.log("🎯 Evento chamar-senha recebido:", data);

      falarSenha(data);

      entrarEmTelaCheia(); // força tela cheia ao chamar

      if (data.tipo === "normal") {
        setUltimaSenhaNormal(data.senha);
        localStorage.setItem("ultimaSenhaNormal", data.senha);
        aplicarDestaque("normal");
      } else if (data.tipo === "prioritario") {
        setUltimaSenhaPrioritario(data.senha);
        localStorage.setItem("ultimaSenhaPrioritario", data.senha);
        aplicarDestaque("prioritario");
      }
    });

    // Carregar os slides (imagens ou vídeos)
    const carregarSlides = async () => {
      try {
        const response = await fetch("http://45.70.177.64:3396/api/slides"); // <- Aqui está a mudança
        const slideFiles = await response.json();
        setSlides(slideFiles); // lista de arquivos: ['imagem1.jpg', 'video1.mp4', ...]
      } catch (err) {
        console.error("Erro ao carregar slides:", err);
      }
    };


    carregarSlides();

    return () => {
      socket.disconnect();
    };
  }, []);

  // Função para avançar o slide
  const avancarSlide = () => {
    setSlideAtual((prev) => (prev + 1) % slides.length);
  };

  useEffect(() => {
    const intervalo = setInterval(avancarSlide, 15000); // muda a cada 10 segundos
    return () => clearInterval(intervalo);
  }, [slides]);


  return (
    <div className={styles.container}>
      <div className={styles.headerArea}>
        <div className={`${styles.normal} ${destaqueNormal ? styles.destaqueNormal : ""}`}>
          <p>ATENDIMENTO NORMAL</p>
          <span>{ultimaSenhaNormal ? `Senha: 0${ultimaSenhaNormal}` : "Nenhuma chamada"}</span>
        </div>
        <div className={`${styles.prioritario} ${destaquePrioritario ? styles.destaquePrioritario : ""}`}>
          <p>ATENDIMENTO PRIORITÁRIO</p>
          <span>{ultimaSenhaPrioritario ? `Senha: 0${ultimaSenhaPrioritario}` : "Nenhuma chamada"}</span>
        </div>
      </div>

      {/* Área dos slides */}
      <div className={styles.slideArea}>
        {slides.length > 0 ? (
          <div className={styles.slide}>
            {slides[slideAtual].endsWith(".mp4") ? (
              <video controls>
                <source
                  src={`http://45.70.177.64:3396/slides/${slides[slideAtual]}`}
                  type="video/mp4"
                />
                Seu navegador não suporta o vídeo.
              </video>
            ) : (
              <img
                src={`http://45.70.177.64:3396/slides/${slides[slideAtual]}`}
                alt={`Slide ${slideAtual + 1}`}
              />
            )}
          </div>
        ) : (
          <p>Carregando slides...</p>
        )}
      </div>

    </div>
  );
};

export default Painel;
