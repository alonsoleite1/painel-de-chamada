import { createContext, useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const UsuarioContext = createContext({});

export const UsuarioContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [nome, setNome] = useState("");
    const [unidade, setUnidade] = useState("");
    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(true); // Inicie como true para mostrar carregamento

    const navigate = useNavigate();

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("@token"));
        setNome(JSON.parse(localStorage.getItem("@nome")));
        setUnidade(JSON.parse(localStorage.getItem("@unidade")));
        setPerfil(JSON.parse(localStorage.getItem("@perfil")));

        const loadUser = async () => {
            if (token) {
                try {
                    const { data } = await api.get('/usuario/autentificacao/login', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    console.log(data)
                    setUser(data);
                } catch (error) {
                    console.error("Erro ao carregar usuário:", error);
                    localStorage.removeItem("@token");
                    localStorage.removeItem("@nome");
                    localStorage.removeItem("@unidade");
                    localStorage.removeItem("@cpf");
                    localStorage.removeItem("@perfil");
                    localStorage.removeItem("@terminal");
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    // Mova o redirecionamento aqui para garantir que só acontece se o loading estiver falso
    useEffect(() => {
        if (!loading) {
            if (!user) {
                navigate(""); // Redireciona apenas se não houver usuário
            }
        }
    }, [loading, user, navigate]);

    const login = async (formData) => {
        try {
            const { data } = await api.post("/usuario/login", formData);
            const token = data.accessToken;
            const { nome, unidade, perfil, terminal,cpf } = data.user;
            setUser(data.user);
            setNome(nome);
            setUnidade(unidade);
            setPerfil(perfil);
    
            localStorage.setItem("@token", JSON.stringify(token));
            localStorage.setItem("@cpf", JSON.stringify(cpf));
            localStorage.setItem("@nome", JSON.stringify(nome));
            localStorage.setItem("@unidade", JSON.stringify(unidade));
            localStorage.setItem("@perfil", JSON.stringify(perfil));
            localStorage.setItem("@terminal", JSON.stringify(terminal));
    
            const rotas = {
                recepcao: "/recepcao",
                operador: "/selecao",
                gestor: "/operador",
                painel: "/painel",
            };
    
            if (rotas[perfil]) {
                toast.success("Bem-vindo!");
                navigate(rotas[perfil]);
            } else {
                toast.error("Perfil não autorizado!");
            }
    
        } catch (error) {
            toast.error("Login ou senha inválidos!");
        }
    };
    

    const logout = () => {
        navigate("");
        setUser(null);
        localStorage.removeItem("@token");
        localStorage.removeItem("@nome");
        localStorage.removeItem("@unidade");
        localStorage.removeItem("@perfil");
        localStorage.removeItem("@terminal");
        localStorage.removeItem("@cpf");
    };

    return (
        <UsuarioContext.Provider value={{ loading, user, nome, unidade, perfil, login, logout }}>
            {children}
        </UsuarioContext.Provider>
    );
};