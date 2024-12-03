import styles from './CTA.module.css';
import classNames from 'classnames';
const CTA = ({ title, loading = false, onClick, className, ...props }) => {
  const buttonClass = classNames(styles.cta_button, className);
  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={loading}
      {...props}
    >
      {title}
    </button>
  );
};
export default CTA;