import React from 'react';
import { useForm } from 'react-hook-form';
import logo from "../../assets/logo.png";
import styles from "./styles.module.scss";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log('Dados enviados:', data);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.loginBox}>
        <div className={styles.logo}><img src={logo} alt="Logo" /></div>

        <div className={styles.formGroup}>
          <label htmlFor="usuario">Usuário</label>
          <input
            id="usuario"
            type="text"
            className={styles.input}
            {...register("usuario", { required: true })}
          />
          {errors.usuario && (
            <span className={styles.error}>Usuário é obrigatório</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            className={styles.input}
            {...register("senha", { required: true })}
          />
          {errors.senha && (
            <span className={styles.error}>Senha é obrigatória</span>
          )}
        </div>

        <button type="submit" className={`${styles.button} ${styles.save}`}>
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
