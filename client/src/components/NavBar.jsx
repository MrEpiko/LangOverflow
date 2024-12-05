import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import hamburger_icon from "../assets/svg/hamburger.svg";
import close_icon from "../assets/svg/close.svg";
import styles from "./NavBar.module.css";
import profile_img from "../assets/profile.png";
import CTA from "./CTA";
const NavBar = () => {
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false);
  const { token, user } = useAuthContext();
  const toggleHamburger = () => {
    setOpen(!isOpen);
  };
  return (
    <header>
      <nav className={styles.navbar}>
        <div className={styles.left}>
          <NavLink to="/home" replace><h1>LangOverflow</h1></NavLink>
        </div>
        <div className={`${styles.rightNav} ${isOpen && styles.open}`}>
          <div className={styles.middle}>
            <ul>
              <li>
                <NavLink to="/home" exact="true" replace className={({ isActive }) => (isActive ? styles.active : "")}>Home</NavLink>
              </li>
              <li>
                <NavLink to="/questions" replace className={({ isActive }) => (isActive ? styles.active : "")}>Questions</NavLink>
              </li>
              <li>
                { token && <NavLink to="/ask-question" replace className={styles.addPost}>+</NavLink> }
              </li>
            </ul>
          </div>
          <div className={styles.hamburger} onClick={toggleHamburger}>
            <img src={isOpen ? close_icon : hamburger_icon} alt="hamburger icon" />
          </div>
          <div className={styles.right}>
            {token ? (
              <NavLink to="/profile" replace>
                <img className={styles.profile_picture} src={user.profile_picture ? user.profile_picture : profile_img} alt="Profile" />
              </NavLink>
            ) : (
              <CTA title="Get started" className={styles.CTA} onClick={() => navigate("/login", { replace: true })}/>
            )}
          </div>
        </div>
      </nav>
        <div className={styles.openManu} style={{display: isOpen ? 'block' : 'none'}}>
          <ul>
            <li>
              <NavLink to="/home" exact="true" replace>Home</NavLink>
            </li>
            <li>
              <NavLink to="/questions" replace>Questions</NavLink>
            </li>
              {
                token && 
                <li>
                  <NavLink to="/ask-question" replace>+</NavLink>
                </li>
              }
          </ul>
        </div>
    </header>
  );
};

export default NavBar;
