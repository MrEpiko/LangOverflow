import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import style from "./NavBar.module.css";
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
      <ul>
        <li>
          <NavLink to="/register" className={({ isActive }) => (isActive ? style.active : "")}>Register</NavLink>
        </li>
        <li>
          <NavLink to="/login" className={({ isActive }) => (isActive ? style.active : "")}>Login</NavLink>
        </li>
        <li>
          <NavLink to="/home" exact="true" className={({ isActive }) => (isActive ? style.active : "")}>Home</NavLink>
        </li>
        <li>
          <NavLink to="/" exact="true" className={({ isActive }) => (isActive ? style.active : "")}>Landing Page</NavLink>
        </li>
        <li>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? style.active : "")}>Profile</NavLink>
        </li>
      </ul>
    </nav>
  );
};
export default NavBar;