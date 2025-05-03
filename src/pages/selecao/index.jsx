import React from 'react';
import { useForm } from 'react-hook-form';
import styles from './styles.module.scss';

const Selecao = () => {
  const {register,handleSubmit, formState: { errors },} = useForm();

  const onSubmit = (data) => {
    console.log('Guichê selecionado:', data.guiche);
    // Aqui você pode salvar em contexto ou redirecionar com base no valor
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.box}>
        <label htmlFor="guiche">Selecione o local de trabalho:</label>
        <select
          id="guiche"
          className={styles.select}
          {...register('guiche', { required: true })}
        >
          <option value="">-- Escolher --</option>
          <option value="guiche1">Guichê 1</option>
          <option value="guiche2">Guichê 2</option>
          <option value="coordenador">Coordenador</option>
        </select>
        {errors.guiche && <span className={styles.error}>Campo obrigatório</span>}

        <button type="submit" className={`${styles.button} ${styles.save}`}>
          Salvar
        </button>
      </form>
    </div>
  );
};

export default Selecao;
