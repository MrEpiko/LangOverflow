import styles from "./CTA.module.css";
const CTA = ({ title, onClick, loading = false, ...props }) => {
  return (
    <button className={styles.CTA} onClick={onClick} disabled={loading} {...props}>
      {loading ? <p>loading...</p> : title}
    </button>
  );
};
export default CTA;