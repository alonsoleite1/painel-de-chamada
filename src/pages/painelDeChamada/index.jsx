import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import styles from "./styles.module.scss";

const Painel = () => {
  // Pega a unidade do contexto de usuário
  const unidade = JSON.parse(localStorage.getItem("@unidade"));

  const [destaqueNormal, setDestaqueNormal] = useState(false);
  const [destaquePrioritario, setDestaquePrioritario] = useState(false);
  const [slides, setSlides] = useState([]);
  const [slideAtual, setSlideAtual] = useState(0);
  const [overlay, setOverlay] = useState(null);

  const [ultimaSenhaNormal, setUltimaSenhaNormal] = useState(
    localStorage.getItem("ultimaSenhaNormal") || null
  );
  const [ultimaSenhaPrioritario, setUltimaSenhaPrioritario] = useState(
    localStorage.getItem("ultimaSenhaPrioritario") || null
  );

  const vozRef = useRef(null);

  // Carregar vozes para speech synthesis
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

  // Função para aplicar destaque visual temporário
  const aplicarDestaque = (tipo) => {
    if (tipo === "normal") {
      setDestaqueNormal(true);
      setTimeout(() => setDestaqueNormal(false), 600);
    } else if (tipo === "prioritario") {
      setDestaquePrioritario(true);
      setTimeout(() => setDestaquePrioritario(false), 600);
    }
  };

  // Função para falar a senha via síntese de voz
  const falarSenha = ({ senha, nome, setor, tipo, guiche = null }) => {
    const guicheFormatado = guiche ? ` ${guiche}` : "";
    const frase = `${nome}, senha de número ${senha}, ${tipo}, sala ${setor} ${guicheFormatado}.`;

    console.log("🗣️ Frase a ser falada:", frase);

    const utterance = new SpeechSynthesisUtterance(frase);
    utterance.lang = "pt-BR";

    if (vozRef.current) {
      utterance.voice = vozRef.current;
    }

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  // Conexão e lógica do WebSocket
  useEffect(() => {
    const socket = io("http://45.70.177.64:3396");
    //const socket = io("http://localhost:5002");

    socket.on("connect", () => {
      console.log("✅ Conectado ao servidor WebSocket com ID:", socket.id);
      socket.emit("teste-conexao", { mensagem: "Painel conectado!" });

      // Entrar na sala da unidade atual (filtrar mensagens)
      if (unidade) {
        socket.emit("entrar-na-sala", unidade);
        console.log(`Entrando na sala da unidade: ${unidade}`);
      }
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Erro de conexão com WebSocket:", err.message);
    });

    socket.on("chamar-senha", (data) => {
      // Ignorar chamadas de outras unidades
      if (data.unidade !== unidade) return;

      console.log("🎯 Evento chamar-senha recebido:", data);

      falarSenha(data);

      setOverlay({
        senha: data.senha,
        nome: data.nome,
        setor: data.setor,
        tipo: data.tipo,
        guiche: data.guiche,
      });

      setTimeout(() => setOverlay(null), 10000); // some após 10 segundos


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

    // Função para carregar slides do servidor
    const carregarSlides = async () => {
      try {
        const response = await fetch("http://45.70.177.64:3396/api/slides");
        const slideFiles = await response.json();
        setSlides(slideFiles);
      } catch (err) {
        console.error("Erro ao carregar slides:", err);
      }
    };

    carregarSlides();

    return () => {
      socket.disconnect();
    };
  }, [unidade]);

  // Controle do slide atual (avança a cada 30 segundos)
  useEffect(() => {
    if (slides.length === 0) return;

    const intervalo = setInterval(() => {
      setSlideAtual((prev) => (prev + 1) % slides.length);
    }, 30000);

    return () => clearInterval(intervalo);
  }, [slides]);

  return (
    <div className={styles.container}>
      <div className={styles.headerArea}>
        <div className={`${styles.normal} ${destaqueNormal ? styles.destaqueNormal : ""}`}>
          <p>ATENDIMENTO NORMAL</p>
          <span>{ultimaSenhaNormal ? `Senha: 0${ultimaSenhaNormal}` : "Nenhuma chamada"}</span>
        </div>
        <div
          className={`${styles.prioritario} ${destaquePrioritario ? styles.destaquePrioritario : ""}`}
        >
          <p>ATENDIMENTO PRIORITÁRIO</p>
          <span>{ultimaSenhaPrioritario ? `Senha: 0${ultimaSenhaPrioritario}` : "Nenhuma chamada"}</span>
        </div>
      </div>

      {/* Área dos slides */}
      <div className={styles.slideArea}>
        {slides.length > 0 ? (
          <div className={styles.slide}>
            {slides[slideAtual].endsWith(".mp4") ? (
              <video autoPlay muted loop playsInline>
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

      {overlay && (
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
            <p className={styles.overlayTipo}>
              {overlay.tipo === "normal" ? "ATENDIMENTO NORMAL" : "ATENDIMENTO PRIORITÁRIO"}
            </p>
            <h1 className={styles.overlaySenha}>Senha: 0{overlay.senha}</h1>
            <p className={styles.overlayNome}>{overlay.nome}</p>
            <p className={styles.overlaySetor}>
              {overlay.setor}{" "}
              {overlay.guiche ? `- ${overlay.guiche.replace("guiche", "")}` : ""}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Painel;
