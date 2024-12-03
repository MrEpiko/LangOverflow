import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import styles from "./NavBar.module.css";
import CTA from "./CTA";
const NavBar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const { token, user } = useAuthContext();
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.left}>
        <NavLink to="/home"><h1>LangOverflow</h1></NavLink>
      </div>
      <div className={styles.middle}>
        <ul>
          <li>
            <NavLink to="/home" exact="true" className={({ isActive }) => (isActive ? styles.active : "")}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/questions" className={({ isActive }) => (isActive ? styles.active : "")}>Questions</NavLink>
          </li>
          <li>
            <NavLink to="/tags" className={({ isActive }) => (isActive ? styles.active : "")}>Tags</NavLink>
          </li>
        </ul>
      </div>
      <div className={styles.right}>
        {
          token ?
          <NavLink to="/profile">
            <img className={styles.profile_picture} src={user?.profile_picture} alt="Profile" />
          </NavLink> :
          <CTA title="Get started" className={styles.CTA} onClick={() => navigate("/login", { replace: true })}/>
        }
      </div>
    </nav>
  );
};
export default NavBar;