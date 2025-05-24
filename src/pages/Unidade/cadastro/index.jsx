import { useForm } from "react-hook-form";
import styles from './styles.module.scss';

const CadastroUnidade = ({ onSubmit }) => {

    const { register, handleSubmit, formState: { errors } } = useForm();


    const submitForm = (payload) => {
        // Converte nome para maiúsculas
        payload.nome = payload.nome.toUpperCase();

        // Agora passa o payload ajustado para a função onSubmit
        onSubmit(payload);
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
                <button type="submit" className={styles.buttonSave}>Cadastrar</button>
            </div>
        </form>

    );
};

export default CadastroUnidade;
