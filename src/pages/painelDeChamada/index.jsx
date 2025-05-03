import styles from './styles.module.scss';

const Painel = () => {
  return (
    <div className={styles.container}>
      <div className={styles.headerArea}>
        <div className={styles.normal}><p>Atendimento Normal</p> <span> 01 </span></div>
        <div className={styles.prioritario}><p>Atendimento Prioritário</p><span>02</span></div>
      </div>
      <div className={styles.slideArea}>
        {/* Aqui você pode usar um componente de slideshow, como react-slideshow-image */}
        <p>Slides serão exibidos aqui</p>
      </div>
    </div>
  );
};


export default Painel;
