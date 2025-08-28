import { useForm } from "react-hook-form";
import styles from './styles.module.scss';

const BuscaUsuario = ({ onSearch }) => {
    const { register, handleSubmit } = useForm();

    const submitForm = (data) => {
        onSearch(data.termo); // agora pode ser cpf ou nome
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit(submitForm)} className={styles.formBusca}>
                <label className={styles.label}>Buscar por CPF ou Nome:</label>
                <input
                    {...register('termo')}
                    className={styles.inputBusca}
                    type="text"
                    placeholder="Digite CPF ou Nome"
                />
                <button type="submit" className={styles.buttonSearch}>Buscar</button>
            </form>
        </div>
    );
};

export default BuscaUsuario;
