import { useState, useEffect } from 'react';
import DefaultTemplate from "../../../components/DefaultTemplate";
import CadastroUsuario from '../cadastro';
import AtualizarUsuario from '../atualizar';
import BuscaUsuario from '../pesquisar';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import styles from './styles.module.scss';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]); // Todos usuários
    const [filtro, setFiltro] = useState(""); // Filtro de busca (cpf)
    const [usuarioEdicao, setUsuarioEdicao] = useState(null);

    const [showCadastro, setShowCadastro] = useState(false);
    const [showAtualizar, setShowAtualizar] = useState(false);

    // Paginação
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 10;

    // Buscar todos usuários na API ao carregar
    useEffect(() => {
        const fetchUsuarios = async () => {
            const token = JSON.parse(localStorage.getItem("@token"));
            try {
                const response = await api.get("/usuario", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsuarios(response.data);
            } catch (error) {
                toast.error(error.response?.data?.message || "Erro ao carregar usuários");
            }
        };

        fetchUsuarios();
    }, []);

    const handleCadastro = async (payload) => {
        const token = JSON.parse(localStorage.getItem("@token"));
        try {
            await api.post("/usuario", payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowCadastro(false);
            toast.success("Usuário Cadastrado!");
            window.location.reload(); // recarregar lista
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    const handleAtualizar = async (payload) => {
        const token = JSON.parse(localStorage.getItem("@token"));
        payload.unidadeId = Number(payload.unidadeId);

        try {
            await api.patch(`/usuario/${payload.cpf}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowAtualizar(false);
            toast.success("Usuário Atualizado!");
            window.location.reload();
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    // Filtro de busca local
    const usuariosFiltrados = usuarios.filter(user =>
        filtro ? user.cpf.includes(filtro) : true
    );

    // Paginação
    const indiceUltimo = paginaAtual * itensPorPagina;
    const indicePrimeiro = indiceUltimo - itensPorPagina;
    const usuariosPaginados = usuariosFiltrados.slice(indicePrimeiro, indiceUltimo);

    const totalPaginas = Math.ceil(usuariosFiltrados.length / itensPorPagina);

    return (
        <DefaultTemplate>
            <div className={styles.header}>
                <h1 className={styles.title}>Usuários</h1>
                {!showCadastro && !showAtualizar && (
                    <button onClick={() => setShowCadastro(true)} className={styles.buttonCadastrar}>
                        Cadastrar
                    </button>
                )}
            </div>

            {!showCadastro && !showAtualizar && (
                <BuscaUsuario onSearch={(cpf) => setFiltro(cpf)} />
            )}

            {showCadastro && <CadastroUsuario onSubmit={handleCadastro} />}
            {showAtualizar && usuarioEdicao && (
                <AtualizarUsuario usuario={usuarioEdicao} onSubmit={handleAtualizar} />
            )}

            {!showCadastro && !showAtualizar && usuariosPaginados.length > 0 && (
                <div className={styles.listaUsuarios}>
                    <table className={styles.tableUsuarios}>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>CPF</th>
                                <th>Login</th>
                                <th>Perfil</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuariosPaginados.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.nome}</td>
                                    <td>{user.cpf}</td>
                                    <td>{user.login}</td>
                                    <td>{user.perfil}</td>
                                    <td>
                                        <button
                                            className={styles.buttonUpdate}
                                            onClick={() => {
                                                setUsuarioEdicao(user);
                                                setShowAtualizar(true);
                                            }}
                                        >
                                            Atualizar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Paginação */}
                    <div className={styles.paginacao}>
                        <button
                            disabled={paginaAtual === 1}
                            onClick={() => setPaginaAtual(paginaAtual - 1)}
                        >
                            &lt;
                        </button>

                        <span>Página {paginaAtual} de {totalPaginas}</span>

                        <button
                            disabled={paginaAtual === totalPaginas}
                            onClick={() => setPaginaAtual(paginaAtual + 1)}
                        >
                            &gt;
                        </button>
                    </div>

                </div>
            )}
        </DefaultTemplate>
    );
};

export default Usuarios;
