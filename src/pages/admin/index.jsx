import { Link } from "react-router-dom";
import DefaultTemplate from "../../components/DefaultTemplate";
import { FaHospital, FaUser } from "react-icons/fa6";
import { BsBuildingUp } from "react-icons/bs";
import styles from "./styles.module.scss";

const Admin = () => {
    return (
        <DefaultTemplate>
            <nav className={styles.nav}>
                <Link to="/usuario" >
                    <span> <FaUser /> Usuário</span>
                </Link>

                <Link to="/unidade">
                    <span> <FaHospital /> Unidade</span>
                </Link>

                <Link to="/setor">
                    <span><BsBuildingUp /> Setor</span>
                </Link>
            </nav>
        </DefaultTemplate>
    )
}

export default Admin;