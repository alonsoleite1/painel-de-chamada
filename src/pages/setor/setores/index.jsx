import { useState } from "react";
import styles from "./style.module.scss";

const ListaSetores = ({ setores, onDelete }) => {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  const totalPaginas = Math.ceil(setores.length / itensPorPagina);

  const setoresExibidos = setores.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  const handleProxima = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };

  const handleAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  return (
    <div className={styles.listaSetores}>
      <table className={styles.tableSetores}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Unidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {setoresExibidos.length > 0 ? (
            setoresExibidos.map((setor) => (
              <tr key={setor.id}>
                <td>{setor.nome}</td>
                <td>{setor.unidade?.nome ?? "Sem unidade"}</td>
                <td>
                  <button
                    onClick={() => onDelete(setor.id)}
                    className={styles.buttonDelete}
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className={styles.noData}>
                Nenhum setor encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPaginas > 1 && (
        <div className={styles.paginacao}>
          <button onClick={() => setPaginaAtual(1)} disabled={paginaAtual === 1}>
            « Primeira
          </button>
          <button onClick={handleAnterior} disabled={paginaAtual === 1}>
            Anterior
          </button>
          <span>
            Página {paginaAtual} de {totalPaginas}
          </span>
          <button onClick={handleProxima} disabled={paginaAtual === totalPaginas}>
            Próxima
          </button>
          <button onClick={() => setPaginaAtual(totalPaginas)} disabled={paginaAtual === totalPaginas}>
            Última »
          </button>
        </div>
      )}

    </div>
  );
};

export default ListaSetores;
