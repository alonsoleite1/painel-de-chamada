import { useState } from 'react';
import DefaultTemplate from "../../../components/DefaultTemplate";
import CadastroUsuario from '../cadastro';
import AtualizarUsuario from '../atualizar';
import BuscaUsuario from '../pesquisar';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import styles from './styles.module.scss';

const Usuarios = () => {
    const [usuario, setUsuario] = useState(null); // Estado para o usuário encontrado
    const [showCadastro, setShowCadastro] = useState(false); // Estado para exibir o formulário de cadastro
    const [showAtualizar, setShowAtualizar] = useState(false); // Estado para exibir o formulário de atualização

    const handleCadastro = async (payload) => {
        const token = JSON.parse(localStorage.getItem("@token"));

        try {
            await api.post("/usuario", payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setShowCadastro(false); // Fechar o formulário 
            toast.success("Usuário Cadastrado!");
            navigate("/usuario");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleAtualizar = async (payload) => {
        const token = JSON.parse(localStorage.getItem("@token"));
        const cpf = payload.cpf; // Aqui você pode pegar o `id` do usuário
        payload.unidadeId = Number(payload.unidadeId);

        try {
            await api.patch(`/usuario/${cpf}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setShowAtualizar(false); // Fechar o formulário 
            toast.success("Usuário Atualizado!");
            navigate("/usuario");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };
    

    const handleBusca = async (cpf) => {
        const token = JSON.parse(localStorage.getItem("@token"));

        try {
            const response = await api.get(`/usuario/${cpf}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsuario(response.data); // Exemplo de retorno
            toast.success("Usuário Encontrado!");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <DefaultTemplate>
            <div className={styles.header}>
                <h1 className={styles.title}>Usuários</h1>
    
                {/* Exibe o botão de cadastro apenas se não estiver em modo de cadastro ou atualização */}
                {!showCadastro && !showAtualizar && !usuario && (
                    <button onClick={() => setShowCadastro(true)} className={styles.buttonCadastrar}>
                        Cadastrar
                    </button>
                )}
            </div>
    
            {/* Exibe o formulário de busca ou de cadastro/atualização, mas não a lista de usuários */}
            {!showCadastro && !showAtualizar && !usuario && (
                <BuscaUsuario usuario={usuario} onSearch={handleBusca} setShowAtualizar={setShowAtualizar} />
            )}
    
            {/* Exibe o formulário de cadastro */}
            {showCadastro && !usuario && (
                <CadastroUsuario onSubmit={handleCadastro} />
            )}
    
            {/* Exibe o formulário de atualização */}
            {showAtualizar && (
                <AtualizarUsuario usuario={usuario} onSubmit={handleAtualizar} />
            )}
    
            {/* Exibe a lista apenas se não estiver em modo de cadastro ou atualização */}
            {!showCadastro && !showAtualizar && usuario && usuario.length > 0 && (
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
                            {usuario.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.nome}</td>
                                    <td>{user.cpf}</td>
                                    <td>{user.login}</td>
                                    <td>{user.perfil}</td>
                                    <td>
                                        <button
                                            className={styles.buttonUpdate}
                                            onClick={() => {
                                                setShowAtualizar(true);
                                                setUsuario(user); // Passando o usuário para o formulário de atualização
                                            }}
                                        >
                                            Atualizar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </DefaultTemplate>
    );
    
};

export default Usuarios;
