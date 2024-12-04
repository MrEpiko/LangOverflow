import { NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import styles from "./NavBar.module.css";
import profile_img from "../assets/profile.png";
import CTA from "./CTA";
const NavBar = () => {
  const navigate = useNavigate();
  const { token, user } = useAuthContext();
  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <NavLink to="/home" replace><h1>LangOverflow</h1></NavLink>
      </div>
      <div className={styles.rightNav}>
      <div className={styles.middle}>
        <ul>
          <li>
            <NavLink to="/home" exact="true" replace className={({ isActive }) => (isActive ? styles.active : "")}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/questions" replace className={({ isActive }) => (isActive ? styles.active : "")}>Questions</NavLink>
          </li>
          <li>
            <NavLink to="/tags" replace className={({ isActive }) => (isActive ? styles.active : "")}>Tags</NavLink>
          </li>
          <li>
            <NavLink to="/ask-question" replace className={styles.addPost}>+</NavLink>
          </li>
        </ul>
      </div>
      <div className={styles.right}>
        {
          token ?
          <NavLink to="/profile" replace>
            <img className={styles.profile_picture} src={user.profile_picture ? user.profile_picture : profile_img} alt="Profile" />
          </NavLink> :
          <CTA title="Get started" className={styles.CTA} onClick={() => navigate("/login", { replace: true })}/>
        }
      </div>
      </div>
    </nav>
  );
};
export default NavBar;