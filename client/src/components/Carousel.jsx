import serbia_img from '../assets/flags/serbia.png';
import bosnia_img from '../assets/flags/bosnia.png';
import slovenia_img from '../assets/flags/slovenia.png';
import america_img from '../assets/flags/america.png';
import canada_img from '../assets/flags/canada.png';
import uk_img from '../assets/flags/uk.png';
import spain_img from '../assets/flags/spain.png';
import finland_img from '../assets/flags/finland.png';
import jamaica_img from '../assets/flags/jamaica.png';
import norway_img from '../assets/flags/norway.png';
import czech_img from '../assets/flags/czech.png';
import russia_img from '../assets/flags/russia.png';
import polland_img from '../assets/flags/polland.png';
import styles from "../components/Carousel.module.css";
const Carousel = () => {
  const images = [
    serbia_img, bosnia_img, slovenia_img, america_img, canada_img, uk_img, spain_img,
    finland_img, jamaica_img, norway_img, czech_img, russia_img, polland_img,serbia_img
  ];
  return (
    <div className={styles.carouselContainer}>
      <div
        className={styles.carouselImages}
      >
        {images.concat(images).map((image, index) => (
          <div key={index} className={styles.carouselImage}>
            <img src={image} alt={`Flag ${index}`} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default Carousel;