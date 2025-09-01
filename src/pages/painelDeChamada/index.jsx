import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import logo from "../../assets/inicio.png";
import versiculos from "./versiculo";
import styles from "./styles.module.scss";

const Painel = () => {
  // Pega a unidade do contexto de usuário
  const unidade = JSON.parse(localStorage.getItem("@unidade"));

  const [destaqueNormal, setDestaqueNormal] = useState(false);
  const [destaquePrioritario, setDestaquePrioritario] = useState(false);
  const [slides, setSlides] = useState([]);
  const [slideAtual, setSlideAtual] = useState(0);
  const [overlay, setOverlay] = useState(null);
  const [versiculo, setVersiculo] = useState(null);
  const [versiculoIndex, setVersiculoIndex] = useState(0);
  const [temperatura, setTemperatura] = useState(null);
  const [noticias, setNoticias] = useState([]);
  const [noticiaAtual, setNoticiaAtual] = useState(0);

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

      setTimeout(() => setOverlay(null), 20000); // some após 10 segundos


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

  // Controle do slide atual (avança a cada 60 segundos)
  useEffect(() => {
    if (slides.length === 0) return;

    const intervalo = setInterval(() => {
      setSlideAtual((prev) => (prev + 1) % slides.length);
    }, 60000);

    return () => clearInterval(intervalo);
  }, [slides]);

  //Buscar temperatura 
  useEffect(() => {
    const buscarTemperatura = async () => {
      try {
        const response = await fetch(
          "https://api.openweathermap.org/data/2.5/weather?q=Pacatuba,CE,BR&appid=1856bad14abe99fdb90a136ca91c3d70&units=metric&lang=pt_br"
        );
        const data = await response.json();
        const temp = Math.round(data.main.temp);
        const condicao = data.weather[0].description;
        setTemperatura(`${temp}°C · ${condicao}`);
      } catch (err) {
        console.error("Erro ao buscar temperatura:", err);
        setTemperatura("Clima indisponível");
      }
    };

    buscarTemperatura();
    const intervalo = setInterval(buscarTemperatura, 10 * 60 * 1000);
    return () => clearInterval(intervalo);
  }, []);

  // Buscar noticias
  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const response = await fetch(
          `https://gnews.io/api/v4/top-headlines?country=br&max=5&token=1f482e0e8896e703760bdc9a1587dc99`
        );
        const data = await response.json();

        if (data.articles && data.articles.length > 0) {
          setNoticias(data.articles);
          setNoticiaAtual(0);
        } else {
          setNoticias([]);
        }
      } catch (error) {
        console.error("Erro ao buscar notícias:", error);
        setNoticias([]);
      }
    };

    fetchNoticias(); // primeira chamada ao carregar

    const interval = setInterval(fetchNoticias, 3 * 60 * 60 * 1000); // <-- Aqui: 3 horas

    return () => clearInterval(interval);
  }, []);

  // Troca a notícia exibida a cada 5 segundos
  useEffect(() => {
    if (noticias.length === 0) return;

    const intervaloNoticia = setInterval(() => {
      setNoticiaAtual((prev) => (prev + 1) % noticias.length);
    }, 30000);

    return () => clearInterval(intervaloNoticia);
  }, [noticias]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setVersiculoIndex((oldIndex) => (oldIndex + 1) % versiculos.length);
    }, 100000);

    return () => clearInterval(intervalo);
  }, []);

  // Versículo atual baseado no índice
  const versiculoAtual = versiculos[versiculoIndex];

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        {/* Área do slide - 60% largura e 70% altura */}
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

        {/* Coluna lateral direita 40% */}
        <div className={styles.sidePanel}>
          {/* Emblema do município */}
          <div className={styles.emblema}>
            <img
              src={logo}
              alt="Emblema do Município"
            // Ajuste o caminho da imagem conforme sua pasta pública
            />
          </div>

          {/* Últimas senhas chamadas */}
          <div className={styles.ultimasSenhas}>
            <div className={`${styles.senhaBox} ${styles.normal}`}>
              <p>ATENDIMENTO NORMAL</p>
              <span>{ultimaSenhaNormal ? `0${ultimaSenhaNormal}` : "00"}</span>
            </div>
            <div className={`${styles.senhaBox} ${styles.prioritario}`}>
              <p>ATENDIMENTO PRIORITÁRIO</p>
              <span>{ultimaSenhaPrioritario ? `0${ultimaSenhaPrioritario}` : "00"}</span>
            </div>
          </div>

          {/* Informações inferiores: data, hora, temperatura */}
          <div className={styles.infoInferior}>
            <div className={styles.dataHora}>
              {new Date().toLocaleString("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </div>
            <div className={styles.temperatura}>{temperatura || "Carregando clima..."}</div>
          </div>
        </div>
      </div>

      <div className={styles.extraInfo}>
        📖 "{versiculoAtual.texto}" — {versiculoAtual.referencia}
      </div>

      {/* Footer para notícias */}
      <div className={styles.footer}>
        {noticias.length > 0 ? (
          <a
            href={noticias[noticiaAtual].url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.noticiaLink}
            title={noticias[noticiaAtual].description || noticias[noticiaAtual].title}
          >
            <img
              src={noticias[noticiaAtual].image}
              alt="Imagem da notícia"
              className={styles.noticiaImagem}
              loading="lazy"
            />
            <div className={styles.noticiaTexto}>
              <h4 className={styles.noticiaTitulo}>{noticias[noticiaAtual].title}</h4>
              <span className={styles.noticiaFonte}>
                {noticias[noticiaAtual].source.name} —{" "}
                {new Date(noticias[noticiaAtual].publishedAt).toLocaleDateString('pt-BR', {
                  day: '2-digit', month: '2-digit', year: 'numeric'
                })}
              </span>
            </div>
          </a>
        ) : (
          "Carregando notícias..."
        )}
      </div>


      {/* Overlay da chamada da senha */}
      {overlay && (
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
            <p className={styles.overlayTipo}>
              {overlay.tipo === "normal" ? "ATENDIMENTO NORMAL" : "ATENDIMENTO PRIORITÁRIO"}
            </p>
            <h1 className={styles.overlaySenha}>SENHA: 0{overlay.senha}</h1>
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
