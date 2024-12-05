import useTypingAnimation from '../hooks/useTypingAnimation';
import world_img from '../assets/world.jpg';
import flags_img from '../assets/flags.png';
import styles from "./HeroSection.module.css";
const HeroSection = ({ children }) => {
  const typedText = useTypingAnimation();
  return (
    <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <h1>
            What does <span className={styles.translation}>{typedText}</span> mean?!
          </h1>
          <p>
            It is a long established fact that a reader will be distracted
            by the readable content of a page when looking at its layout.
          </p>
          {children}
        </div>
        <div className={styles.imageWrapper}>
          <div>
            <img src={world_img} alt="" />
          </div>
          <div>
            <img src={flags_img} alt="" />
          </div>
        </div>
      </section>
  );
}
export default HeroSection;