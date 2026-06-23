import { useEffect } from "react";
import { useForm } from "react-hook-form";
import styles from "./styles.module.scss";

const AtualizarSetor = ({ setor, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (setor) {
      reset({
        nome: setor.nome,
      });
    }
  }, [setor, reset]);

  const submitForm = (data) => {
    onSubmit({
      nome: data.nome,
    });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className={styles.form}>
      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
        <label className={styles.label}>Unidade:</label>
        <input
          className={styles.input}
          type="text"
          value={setor?.unidade?.nome || ""}
          disabled
        />
      </div>

      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
        <label className={styles.label}>Nome do setor:</label>
        <input
          {...register("nome", {
            required: "Este campo é obrigatório",
          })}
          className={styles.input}
          type="text"
        />
        {errors.nome && (
          <span className={styles.error}>{errors.nome.message}</span>
        )}
      </div>

      <div className={styles.buttonContainer}>
        <button type="submit" className={styles.buttonSave}>
          Atualizar
        </button>

        <button type="button" onClick={onCancel} className={styles.buttonCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default AtualizarSetor;