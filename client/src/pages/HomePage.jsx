import { useNavigate } from 'react-router-dom';
import Carousel from '../components/Carousel';
import NumsSection from '../components/NumsSection';
import InfoSection from '../components/InfoSection';
import HeroSection from '../components/HeroSection';
import CTA from '../components/CTA';
import styles from './HomeLandingPage.module.css';
const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <HeroSection>
        <CTA
            title="Ask question"
            className={styles.CTA_hero}
            onClick={() => navigate('/ask-question', { replace: true })}
          />
      </HeroSection>
      <Carousel />
      <NumsSection/>
      <InfoSection>
        <CTA
            title="Ask question"
            className={styles.CTA_info}
            onClick={() => navigate('/ask-question', { replace: true })}
          />
      </InfoSection>
    </div>
  );
}
export default HomePage;