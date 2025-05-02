import { Route, Routes } from "react-router-dom";
import Login from "../pages/login";


const RoutesMain = () => {
    return (
        <Routes>
            <Route path="" element={<Login />} />     
        </Routes>
    )
};
export default RoutesMain;