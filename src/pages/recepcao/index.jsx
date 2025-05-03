import { useState } from "react";
import { useForm } from "react-hook-form";
import DefaultTemplate from "../../components/DefaultTemplate";
import styles from "./styles.module.scss";

const motivos = [
    "Consulta",
    "Retorno",
    "Encaminhamento",
    "Coordenador",
];

let contadorNormal = 1;
let contadorPrioritario = 1;

const Recepcao = () => {
    const [tipo, setTipo] = useState(null);
    const [numero, setNumero] = useState(null);

    const { register, handleSubmit, reset, formState: { errors }, } = useForm();

    const gerarSenha = (tipoAtendimento) => {
        const senha =
            tipoAtendimento === "normal" ? contadorNormal++ : contadorPrioritario++;
        setTipo(tipoAtendimento);
        setNumero(senha);
        reset(); // limpa o formulário
    };

    const onSubmit = (data) => {
        console.log({ tipo: tipo.toUpperCase(), numero, motivo: data.motivo, });
        // Aqui você pode enviar os dados para uma API
        setTipo(null);
        setNumero(null);
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
                                        <option key={idx} value={motivo}>
                                            {motivo}
                                        </option>
                                    ))}
                                </select>
                                {errors.motivo && <span className={styles.error}>Selecione um motivo</span>}
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
