import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { UsuarioContext } from '../../provider/userContext';
import { locaisPorUnidade } from './stores';
import styles from './styles.module.scss';


const Selecao = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { setUser } = useContext(UsuarioContext);
  const navigate = useNavigate();

  const [locais, setLocais] = useState([]);

  useEffect(() => {
    const unidade = JSON.parse(localStorage.getItem('@unidade')); 
    if (unidade) {
      const locaisDaUnidade = locaisPorUnidade[unidade] || [];
      setLocais(locaisDaUnidade);
    } else {
      toast.error("Unidade não encontrada. Faça login novamente.");
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    const token = JSON.parse(localStorage.getItem('@token'));
    const cpf = JSON.parse(localStorage.getItem('@cpf'));

    const payload = { ...data, cpf };

    try {
      const response = await api.patch(`/usuario/${cpf}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUser(response.data);
      toast.success("Usuário Atualizado!");
      navigate("/operador");
    } catch (error) {
      const message = error.response?.data?.message || "Erro ao atualizar usuário";
      toast.error(message);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.box}>
        <label>Selecione o local de trabalho:</label>
        <select
          className={styles.select}
          {...register('terminal', { required: true })}
          disabled={locais.length === 0}
        >
          <option value="">-- Escolher --</option>
          {locais.map((local, index) => (
            <option key={index} value={local}>
              {local}
            </option>
          ))}
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
