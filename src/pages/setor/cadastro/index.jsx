import { useForm } from "react-hook-form";
import styles from "./style.module.scss";

const CadastroSetor = ({ onSubmit, unidades, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const submitForm = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className={styles.form}>
      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nome:</label>
          <input
            {...register("nome", { required: "Este campo é obrigatório" })}
            className={styles.input}
            type="text"
          />
          {errors.nome && (
            <span className={styles.error}>{errors.nome.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Unidade:</label>
          <select
            {...register("unidadeId", { required: "Este campo é obrigatório" })}
            className={styles.select}
          >
            <option value="">Selecione...</option>
            {unidades.map((unidade) => (
              <option key={unidade.id} value={unidade.id}>
                {unidade.nome}
              </option>
            ))}
          </select>
          {errors.unidadeId && (
            <span className={styles.error}>{errors.unidadeId.message}</span>
          )}
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button type="submit" className={styles.buttonSave}>
          Salvar
        </button>
        <button
          type="button"
          className={styles.buttonCancel}
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default CadastroSetor;
