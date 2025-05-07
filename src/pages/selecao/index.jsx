import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '../../services/api';
import styles from './styles.module.scss';
import { useNavigate } from 'react-router-dom';

const Selecao = () => {
  const {register,handleSubmit, formState: { errors },} = useForm();


  const navigate = useNavigate();

  const onSubmit = async(data) => {
    const token = JSON.parse(localStorage.getItem("@token"));   
    const cpf = JSON.parse(localStorage.getItem("@cpf")); 
    
    const payload = {...data, cpf};

    try {
        await api.patch(`/usuario/${cpf}`, payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        toast.success("Usuário Atualizado!");
        navigate("/operador");
    } catch (error) {
        toast.error(error.response.data.message);
    }
  };
  

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.box}>
        <label>Selecione o local de trabalho:</label>
        <select
          className={styles.select}
          {...register('terminal', { required: true })}
        >
          <option value="">-- Escolher --</option>
          <option value="guiche1">Guichê 1</option>
          <option value="guiche2">Guichê 2</option>
          <option value="coordenador">Coordenador</option>
        </select>
        {errors.terminal && <span className={styles.error}>Campo obrigatório</span>}

        <button type="submit" className={`${styles.button} ${styles.save}`}>
          Salvar
        </button>
      </form>
    </div>
  );
};

export default Selecao;
