import { FaRegCircleUser } from "react-icons/fa6";
import { MdHomeWork } from "react-icons/md";
import logo from "../../assets/logo.png";
import { useContext } from "react";
import { UsuarioContext } from "../../provider/userContext";
import styles from "./styles.module.scss";

const Header = () => {

    const { logout } = useContext(UsuarioContext);
    const nome = JSON.parse(localStorage.getItem("@nome"));
    const unidade = JSON.parse(localStorage.getItem("@unidade"));

    return (
        <header>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <img className={styles.logoImg} src={logo} alt="logo-pacatuba" />
                </div>
                <div className={styles.infoBox}>
                    <div className={styles.userInfo}>
                        <span className={styles.userDetail}>
                            <FaRegCircleUser /><p>{nome}</p>
                        </span>
                        <span className={styles.userDetail}>
                            <MdHomeWork /><p>{unidade}</p>
                        </span>
                    </div>
                    <button className={styles.logoutButton} onClick={logout}>Sair</button>
                </div>
            </div>
        </header>

    )
};

export default Header;