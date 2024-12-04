import { NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import style from "./NavBar.module.css";
import profile_img from "../assets/profile.png";
import CTA from "./CTA";
const NavBar = () => {
  const navigate = useNavigate();
  const { token, user } = useAuthContext();
  return (
    <nav className={style.navbar}>
      <div className={style.left}>
        <NavLink to="/home" replace><h1>LangOverflow</h1></NavLink>
      </div>
      <div className={style.rightNav}>
      <div className={style.middle}>
        <ul>
          <li>
            <NavLink to="/home" exact="true" replace className={({ isActive }) => (isActive ? style.active : "")}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/questions" replace className={({ isActive }) => (isActive ? style.active : "")}>Questions</NavLink>
          </li>
          <li>
            <NavLink to="/tags" replace className={({ isActive }) => (isActive ? style.active : "")}>Tags</NavLink>
          </li>
          <li>
            { token && <NavLink to="/ask-question" replace className={style.addPost}>+</NavLink> }
          </li>
        </ul>
      </div>
      <div className={style.right}>
        {
          token ?
          <NavLink to="/profile" replace>
            <img className={style.profile_picture} src={user.profile_picture ? user.profile_picture : profile_img} alt="Profile" />
          </NavLink> :
          <CTA title="Get started" className={style.CTA} onClick={() => navigate("/login", { replace: true })}/>
        }
      </div>
      </div>
    </nav>
  );
};
export default NavBar;