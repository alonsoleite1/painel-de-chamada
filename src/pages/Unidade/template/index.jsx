import { useState } from 'react';
import DefaultTemplate from "../../../components/DefaultTemplate";
import CadastroUnidade from '../cadastro';
import AtualizarUnidade from '../atualizar';
import BuscarUnidadeo from '../pesquisar';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import styles from './styles.module.scss';

const Unidade = () => {
    const [unidade, setUnidade] = useState(null); // Estado para o usuário encontrado
    const [showCadastro, setShowCadastro] = useState(false); // Estado para exibir o formulário de cadastro
    const [showAtualizar, setShowAtualizar] = useState(false); // Estado para exibir o formulário de atualização

    const handleCadastro = async (payload) => {
        const token = JSON.parse(localStorage.getItem("@token"));

        try {
            await api.post("/unidade", payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setShowCadastro(false); // Fechar o formulário 
            toast.success("Unidade Cadastrado!");
            navigate("/unidade");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleAtualizar = async (payload) => {
        const token = JSON.parse(localStorage.getItem("@token"));
        const nome = payload.nome; // Aqui você pode pegar o `id` do usuário

        try {
            await api.patch(`/unidade/${nome}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setShowAtualizar(false); // Fechar o formulário 
            toast.success("Unidade Atualizado!");
            navigate("/unidade");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };   

    const handleBusca = async (nome) => {
        const token = JSON.parse(localStorage.getItem("@token"));

        try {
            const response = await api.get(`/unidade/${nome}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUnidade(response.data); // Exemplo de retorno
            toast.success("Unidade Encontrada!");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <DefaultTemplate>
            <div className={styles.header}>
                <h1 className={styles.title}>Unidades</h1>
    
                {/* Exibe o botão de cadastro apenas se não estiver em modo de cadastro ou atualização */}
                {!showCadastro && !showAtualizar && !unidade && (
                    <button onClick={() => setShowCadastro(true)} className={styles.buttonCadastrar}>
                        Cadastrar
                    </button>
                )}
            </div>
    
            {/* Exibe o formulário de busca ou de cadastro/atualização, mas não a lista de usuários */}
            {!showCadastro && !showAtualizar && !unidade && (
                <BuscarUnidadeo unidade={unidade} onSearch={handleBusca} setShowAtualizar={setShowAtualizar} />
            )}
    
            {/* Exibe o formulário de cadastro */}
            {showCadastro && !unidade && (
                <CadastroUnidade onSubmit={handleCadastro} />
            )}
    
            {/* Exibe o formulário de atualização */}
            {showAtualizar && (
                <AtualizarUnidade unidade={unidade} onSubmit={handleAtualizar} />
            )}
    
            {/* Exibe a lista apenas se não estiver em modo de cadastro ou atualização */}
        {!showCadastro && !showAtualizar && unidade && (
    <div className={styles.listaUsuarios}>
        <table className={styles.tableUsuarios}>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr key={unidade.id}>
                    <td>{unidade.nome}</td>
                    <td>
                        <button
                            className={styles.buttonUpdate}
                            onClick={() => {
                                setShowAtualizar(true);
                                // unidade já é um objeto único
                            }}
                        >
                            Atualizar
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
)}

        </DefaultTemplate>
    );
    
};

export default Unidade;
