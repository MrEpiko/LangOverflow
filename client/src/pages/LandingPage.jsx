import { Navigate, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import Carousel from '../components/Carousel';
import NumsSection from '../components/NumsSection';
import InfoSection from '../components/InfoSection';
import HeroSection from '../components/HeroSection';
import CTA from '../components/CTA';
import styles from './HomeLandingPage.module.css';
const LandingPage = () => {
  const { token } = useAuthContext();
  const navigate = useNavigate();
  if (token != null) return <Navigate to="/home" replace />;
  return (
    <div className={styles.page}>
      <HeroSection>
        <CTA
          title="Get started"
          className={styles.CTA_hero}
          onClick={() => navigate('/login', { replace: true })}
        />
      </HeroSection>
      <Carousel />
      <NumsSection/>
      <InfoSection>
        <CTA
          title="Get started"
          className={styles.CTA_info}
          onClick={() => navigate('/login', { replace: true })}
        />
      </InfoSection>
    </div>
  );
};
export default LandingPage;