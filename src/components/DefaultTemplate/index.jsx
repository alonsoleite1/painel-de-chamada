import React from 'react';
import Header from '../Header';
import styles from './styles.module.scss';

const DefaultTemplate = ({ children }) => {
  return (
    <>
      <header className={styles.header}>
        <Header />
      </header>
      <div className={styles.layout}>
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </>
  );
};

export default DefaultTemplate;
