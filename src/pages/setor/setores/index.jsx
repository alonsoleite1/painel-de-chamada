import { useState } from "react";
import styles from "./style.module.scss";

const ListaSetores = ({ setores, onDelete, onEdit }) => {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [filtroUnidade, setFiltroUnidade] = useState("");
  const itensPorPagina = 10;

    const unidades = [
  ...new Map(
    setores.map((s) => [s.unidade?.id, s.unidade])
  ).values(),
];

const setoresFiltrados = filtroUnidade
  ? setores.filter(
      (setor) =>
        setor.unidadeId === Number(filtroUnidade)
    )
  : setores;

const totalPaginas = Math.ceil(
  setoresFiltrados.length / itensPorPagina
);

const setoresExibidos = setoresFiltrados.slice(
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
      <div className={styles.filtroContainer}>
  <select
    value={filtroUnidade}
    onChange={(e) => {
      setFiltroUnidade(e.target.value);
      setPaginaAtual(1);
    }}
    className={styles.selectFiltro}
  >
    <option value="">Todas as unidades</option>

    {unidades.map((unidade) => (
      <option key={unidade.id} value={unidade.id}>
        {unidade.nome}
      </option>
    ))}
  </select>
</div>

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
                    onClick={() => onEdit(setor)}
                    className={styles.buttonAtualizar}
                  >
                    Atualizar
                  </button>

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
          <button onClick={handleAnterior} disabled={paginaAtual === 1}>
            « Anterior
          </button>

          <span>
            Página {paginaAtual} de {totalPaginas}
          </span>

          <button
            onClick={handleProxima}
            disabled={paginaAtual === totalPaginas}
          >
            Próxima »
          </button>
        </div>
      )}
    </div>
  );
};

export default ListaSetores;