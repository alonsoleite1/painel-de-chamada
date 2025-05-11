import { useForm } from "react-hook-form";
import styles from './styles.module.scss';

const BuscaUsuario = ({  onSearch }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const submitForm = (data) => {
        onSearch(data.cpf); // Buscar usuário pelo CPF
    };

    return (
        <div className={styles.container}>
            {/* Formulário de busca */}
            <form onSubmit={handleSubmit(submitForm)} className={styles.formBusca}>
                <label className={styles.label}>CPF:</label>
                <input
                    {...register('cpf', { required: 'Este campo é obrigatório' })}
                    className={styles.inputBusca}
                    type="text"
                />
                {errors.cpf && <span className={styles.errorBusca}>{errors.cpf.message}</span>}

                <button type="submit" className={styles.buttonSearch}>Buscar</button>
            </form>

        </div>
    );
};

export default BuscaUsuario;

