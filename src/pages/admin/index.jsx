import { Link } from "react-router-dom";
import DefaultTemplate from "../../components/DefaultTemplate";
import { FaHospital, FaUser } from "react-icons/fa6";
import { BsBuildingUp } from "react-icons/bs";
import { useContext } from "react";
import { UsuarioContext } from "../../provider/userContext";
import styles from "./styles.module.scss";

const Admin = () => {
    const { user } = useContext(UsuarioContext);

    return (
        <DefaultTemplate>
            <nav className={styles.nav}>
                <Link to="/usuario">
                    <span> <FaUser /> Usuário</span>
                </Link>

                {/* Mostrar Unidade somente se perfil for 'admin' */}
                {user?.perfil === 'admin' && (
                    <Link to="/unidade">
                        <span> <FaHospital /> Unidade</span>
                    </Link>
                )}

                <Link to="/setor">
                    <span><BsBuildingUp /> Setor</span>
                </Link>
            </nav>
        </DefaultTemplate>
    );
};

export default Admin;
