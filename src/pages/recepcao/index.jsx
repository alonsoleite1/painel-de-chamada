import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DefaultTemplate from "../../components/DefaultTemplate";
import styles from "./styles.module.scss";
import api from "../../services/api";
import { toast } from "react-toastify";

const motivos = ["Consulta", "Retorno", "Encaminhamento", "Coordenador"];
const setores = ["Regulação", "Atenção Primária", "Atenção Secundária", "Odontologia", "Epidemiologia"];

const Recepcao = () => {
    const [tipo, setTipo] = useState(null);
    const [numero, setNumero] = useState(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const token = JSON.parse(localStorage.getItem("@token"));

    const gerarSenha = async (tipoAtendimento) => {
        setTipo(tipoAtendimento);
    
        try {
            const { data } = await api.get("/painel", {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            // Agora considera todas as senhas, não importa o tipo
            const senhasOrdenadas = data.sort((a, b) => b.senha - a.senha);
            const ultimaSenha = senhasOrdenadas[0]?.senha || 0;
    
            const novaSenha = ultimaSenha + 1;
            setNumero(novaSenha);
        } catch (error) {
            toast.error("Erro ao gerar senha");
            console.error(error);
        }
    };    

    const onSubmit = async (formData) => {
        if (!tipo || !numero) return toast.warning("Escolha o tipo de atendimento primeiro.");

        const payload = {
            senha: numero,
            tipo,
            status: "aguardando",
            motivo: formData.motivo,
            setor: formData.setor,
        };

        try {
            await api.post("/painel", payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Atendimento cadastrado com sucesso!");
            reset();
            setTipo(null);
            setNumero(null);
        } catch (error) {
            toast.error("Erro ao cadastrar atendimento");
            console.error(error);
        }
    };

    return (
        <DefaultTemplate>
            <div className={styles.container}>
                <div className={styles.buttons}>
                    <button onClick={() => gerarSenha("normal")} className={styles.normal}>
                        Atendimento Normal
                    </button>
                    <button onClick={() => gerarSenha("prioritario")} className={styles.prioritario}>
                        Atendimento Prioritário
                    </button>
                </div>

                {numero && (
                    <>
                        <h2 className={styles.formTitle}>
                            {tipo === "normal" ? "Atendimento Normal" : "Atendimento Prioritário"}
                        </h2>
                        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                            <div>
                                <label>Número da Senha:</label>
                                <input type="text" value={numero} readOnly className={styles.numeroSenha} />
                            </div>

                            <div>
                                <label>Motivo do Atendimento:</label>
                                <select {...register("motivo", { required: true })}>
                                    <option value="">Selecione</option>
                                    {motivos.map((motivo, idx) => (
                                        <option key={idx} value={motivo}>{motivo}</option>
                                    ))}
                                </select>
                                {errors.motivo && <span className={styles.error}>Selecione um motivo</span>}
                            </div>

                            <div>
                                <label>Setor:</label>
                                <select {...register("setor", { required: true })}>
                                    <option value="">Selecione</option>
                                    {setores.map((setor, idx) => (
                                        <option key={idx} value={setor}>{setor}</option>
                                    ))}
                                </select>
                                {errors.setor && <span className={styles.error}>Selecione um setor</span>}
                            </div>

                            <button type="submit" className={styles.submit}>
                                Confirmar Atendimento
                            </button>
                        </form>
                    </>
                )}
            </div>
        </DefaultTemplate>
    );
};

export default Recepcao;
