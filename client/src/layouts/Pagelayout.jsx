import NavBar from "../components/NavBar";
import styles from "./Pagelayout.module.css";
const Pagelayout = ({ children }) => {
  return (
    <div className={styles.pageLayout}>
      <NavBar />
      <main>
        {children}
      </main>
    </div>
  );
};
export default Pagelayout;