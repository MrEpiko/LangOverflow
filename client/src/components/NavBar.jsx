import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import style from "./NavBar.module.css";
import CTA from "./CTA";
const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
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
    <nav className={`${style.navbar} ${scrolled ? style.scrolled : ""}`}>
      <div className={style.left}>
        <h1>LangOverFlow</h1>
      </div>
      <div className={style.middle}>
        <ul>
          <li>
            <NavLink to="/home" exact="true" className={({ isActive }) => (isActive ? style.active : "")}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/questions" className={({ isActive }) => (isActive ? style.active : "")}>Questions</NavLink>
          </li>
          <li>
            <NavLink to="/tags" className={({ isActive }) => (isActive ? style.active : "")}>Tags</NavLink>
          </li>
        </ul>
      </div>
      <div className={style.right}>
        <CTA title="GET STARTED"/>
      </div>
    </nav>
  );
};
export default NavBar;