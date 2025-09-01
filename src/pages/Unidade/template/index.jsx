import { useState, useEffect } from 'react';
import DefaultTemplate from "../../../components/DefaultTemplate";
import CadastroUnidade from '../cadastro';
import AtualizarUnidade from '../atualizar';
import BuscarUnidade from '../pesquisar';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import styles from './styles.module.scss';

const Unidade = () => {
    const [unidades, setUnidades] = useState([]); // Todas as unidades
    const [filtro, setFiltro] = useState(""); // Filtro de busca (nome)
    const [unidadeEdicao, setUnidadeEdicao] = useState(null);

    const [showCadastro, setShowCadastro] = useState(false);
    const [showAtualizar, setShowAtualizar] = useState(false);

    // Paginação
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 10;

    // Buscar todas as unidades na API ao carregar
    useEffect(() => {
        const fetchUnidades = async () => {
            const token = JSON.parse(localStorage.getItem("@token"));
            try {
                const response = await api.get("/unidade", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUnidades(response.data);
            } catch (error) {
                toast.error(error.response?.data?.message || "Erro ao carregar unidades");
            }
        };

        fetchUnidades();
    }, []);

    const handleCadastro = async (payload) => {
        const token = JSON.parse(localStorage.getItem("@token"));
        try {
            await api.post("/unidade", payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowCadastro(false);
            toast.success("Unidade cadastrada!");
            window.location.reload();
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    const handleAtualizar = async (payload) => {
        console.log(unidadeEdicao)
        const token = JSON.parse(localStorage.getItem("@token"));
        try {
            await api.patch(`/unidade/${unidadeEdicao.id}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowAtualizar(false);
            toast.success("Unidade atualizada!");
            window.location.reload();
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    // Filtro de busca local
    const unidadesFiltradas = unidades.filter(uni =>
        filtro ? uni.nome.toLowerCase().includes(filtro.toLowerCase()) : true
    );

    // Paginação
    const indiceUltimo = paginaAtual * itensPorPagina;
    const indicePrimeiro = indiceUltimo - itensPorPagina;
    const unidadesPaginadas = unidadesFiltradas.slice(indicePrimeiro, indiceUltimo);

    const totalPaginas = Math.ceil(unidadesFiltradas.length / itensPorPagina);

    return (
        <DefaultTemplate>
            <div className={styles.header}>
                <h1 className={styles.title}>Unidades</h1>
                {!showCadastro && !showAtualizar && (
                    <button onClick={() => setShowCadastro(true)} className={styles.buttonCadastrar}>
                        Cadastrar
                    </button>
                )}
            </div>

            {/* Busca */}
            {!showCadastro && !showAtualizar && (
                <BuscarUnidade onSearch={(nome) => setFiltro(nome)} />
            )}

            {/* Formulários */}
            {showCadastro && <CadastroUnidade onSubmit={handleCadastro} />}
            {showAtualizar && unidadeEdicao && (
                <AtualizarUnidade unidade={unidadeEdicao} onSubmit={handleAtualizar} />
            )}

            {/* Lista de unidades */}
            {!showCadastro && !showAtualizar && unidadesPaginadas.length > 0 && (
                <div className={styles.listaUsuarios}>
                    <table className={styles.tableUsuarios}>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {unidadesPaginadas.map((uni) => (
                                <tr key={uni.id}>
                                    <td>{uni.nome}</td>
                                    <td>
                                        <button
                                            className={styles.buttonUpdate}
                                            onClick={() => {
                                                setUnidadeEdicao(uni);
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

export default Unidade;
