import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../../services/api";
import styles from './styles.module.scss';

const AtualizarUsuario = ({ usuario, onSubmit }) => {

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const [unidades, setUnidades] = useState([]);
    const [unidadeSelecionada, setUnidadeSelecionada] = useState('');

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("@token"));
        const unidades = async () => {
            try {
                const response = await api.get(`/unidade`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUnidades(response.data);

            } catch (error) {
                console.log(error);
            }
        };

        unidades();
    }, []);

    useEffect(() => {
        if (usuario) {

            reset({
                nome: usuario.nome,
                cpf: usuario.cpf,
                login: usuario.login,
                unidadeId: usuario.unidadeId,
                setor: usuario.setor,
                perfil: usuario.perfil,
            });
        }
    }, [usuario, reset]); // Atualiza os dados sempre que o 'usuario' mudar

    const submitForm = (data) => {
         data.unidadeId = Number(data.unidadeId);
        onSubmit(data); 
    };

    return (
        <form onSubmit={handleSubmit(submitForm)} className={styles.form}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Nome:</label>
                <input
                    {...register('nome', { required: 'Este campo é obrigatório' })}
                    className={styles.input}
                    type="text"
                />
                {errors.nome && <span className={styles.error}>{errors.nome.message}</span>}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>CPF:</label>
                <input
                    {...register('cpf', { required: 'Este campo é obrigatório' })}
                    className={styles.input}
                    type="text"
                    readOnly  // Torna o campo não editável
                />
                {errors.cpf && <span className={styles.error}>{errors.cpf.message}</span>}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Login:</label>
                <input
                    {...register('login', { required: 'Este campo é obrigatório' })}
                    className={styles.input}
                    type="text"
                />
                {errors.login && <span className={styles.error}>{errors.login.message}</span>}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Senha:</label>
                <input
                    {...register('senha', { required: 'Este campo é obrigatório' })}
                    className={styles.input}
                    type="password"
                />
                {errors.senha && <span className={styles.error}>{errors.senha.message}</span>}
            </div>

            <div className={`${styles.formGroup} ${styles.halfWidth}`}>
                <label className={styles.label}>Unidade:</label>
                <select
                    {...register('unidadeId', { required: 'Este campo é obrigatório' })}
                    className={styles.select}
                    onChange={(e) => {
                        setUnidadeSelecionada(e.target.value);
                    }}
                >
                    <option value="">Selecione...</option>
                    {unidades.map((unidade) => (
                        <option key={unidade.id} value={unidade.id}>{unidade.nome}</option>
                    ))}
                </select>
                {errors.unidade && <span className={styles.error}>{errors.unidade.message}</span>}
            </div>

            <div className={`${styles.formGroup} ${styles.halfWidth}`}>
                <label className={styles.label}>Perfil:</label>
                <select
                    {...register('perfil', { required: 'Este campo é obrigatório' })}
                    className={styles.select}
                >
                    <option value="">Selecione...</option>
                    <option value="admin">Admin</option>
                    <option value="gestor">Gestor</option>
                    <option value="operador">Operador</option>
                    <option value="painel">Painel</option>
                    <option value="recepcao">Recepção</option>
                </select>
                {errors.perfil && <span className={styles.error}>{errors.perfil.message}</span>}
            </div>

            <div className={`${styles.formGroup} ${styles.halfWidth}`}>
                <label className={styles.label}>Setor:</label>
                <select
                    {...register('setor', { required: 'Este campo é obrigatório' })}
                    className={styles.select}
                >
                    <option value="">Selecione...</option>
                    {
                        unidades
                            .find((u) => String(u.id) === unidadeSelecionada)
                            ?.Setor?.map((setor) => (
                                <option key={setor.id} value={setor.nome}>
                                    {setor.nome}
                                </option>
                            ))
                    }
                </select>
                {errors.setor && <span className={styles.error}>{errors.setor.message}</span>}
            </div>

            <div className={styles.buttonContainer}>
                <button type="submit" className={styles.buttonSave}>Atualizar</button>
            </div>
        </form>
    );
};

export default AtualizarUsuario;
