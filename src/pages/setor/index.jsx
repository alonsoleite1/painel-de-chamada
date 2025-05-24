import DefaultTemplate from "../../components/DefaultTemplate";
import { useForm } from 'react-hook-form';
import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import styles from './styles.module.scss';

const Setor = () => {
    const [unidades, setUnidades] = useState([]);

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

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

    const submitForm = async (payload) => {
        const token = JSON.parse(localStorage.getItem("@token"));

        payload.unidadeId = Number(payload.unidadeId);
        payload.nome = payload.nome.toUpperCase();

        try {
            await api.post("/setor", payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("Setor criado para unidade!");
            reset();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <DefaultTemplate>
            <div className={styles.header}>
                <h1 className={styles.title}>Setor</h1>
            </div>

            <form onSubmit={handleSubmit(submitForm)} className={styles.form}>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Nome:</label>
                        <input
                            {...register('nome', { required: 'Este campo é obrigatório' })}
                            className={styles.input}
                            type="text"
                        />
                        {errors.nome && <span className={styles.error}>{errors.nome.message}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Unidade:</label>
                        <select
                            {...register('unidadeId', { required: 'Este campo é obrigatório' })}
                            className={styles.select}
                        >
                            <option value="">Selecione...</option>
                            {unidades.map((unidade) => (
                                <option key={unidade.id} value={unidade.id}>{unidade.nome}</option>
                            ))}
                        </select>
                        {errors.unidadeId && <span className={styles.error}>{errors.unidadeId.message}</span>}
                    </div>
                </div>

                <div className={styles.buttonContainer}>
                    <button type="submit" className={styles.buttonSave}>Cadastrar</button>
                </div>
            </form>

        </DefaultTemplate>
    );
};

export default Setor;