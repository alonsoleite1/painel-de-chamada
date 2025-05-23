import { useEffect } from "react";
import { useForm } from "react-hook-form";
import styles from './styles.module.scss';

const AtualizarUnidade = ({ unidade, onSubmit }) => {

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    useEffect(() => {
        if (unidade) {

            reset({
                nome: unidade.nome,
            });
        }
    }, [unidade, reset]); // Atualiza os dados sempre que o 'usuario' mudar

    const submitForm = (data) => {
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

        
            <div className={styles.buttonContainer}>
                <button type="submit" className={styles.buttonSave}>Atualizar</button>
            </div>
        </form>
    );
};

export default AtualizarUnidade;
