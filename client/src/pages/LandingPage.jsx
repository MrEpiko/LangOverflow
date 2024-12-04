import { Navigate, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import CTA from '../components/CTA';
import world_img from '../assets/world.jpg';
import flags_img from '../assets/flags.png';
import styles from './LandingPage.module.css';
import useTypingAnimation from '../hooks/useTypingAnimation';
import Carousel from '../components/Carousel';
const LandingPage = () => {
  const navigate = useNavigate();
  const { token } = useAuthContext();
  const typedText = useTypingAnimation()
  if (token != null) return <Navigate to="/home" replace />;
  return (
    <div className={styles.landingPage}>
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <h1>
            What does <span className={styles.translation}>{typedText}</span> mean?!
          </h1>
          <p>
            It is a long established fact that a reader will be distracted
            by the readable content of a page when looking at its layout.
          </p>
          <CTA title="Get started" className={styles.CTA} onClick={() => navigate("/login", { replace: true })}/>
        </div>
        <div className={styles.imageWrapper}>
          <div><img src={world_img} alt="" /></div>
          <div><img src={flags_img} alt="" /></div>
        </div>
      </section>
      <section>
        <Carousel/>
      </section>
    </div>
  );
}
export default LandingPage;