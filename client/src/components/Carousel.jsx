import { flag_images } from "../utils/constants";
import styles from "../components/Carousel.module.css";
const Carousel = () => {
  const width = '120px';
  const height = '70px';
  const quantity = flag_images.length;
  const sliderStyle = {
    '--width': width,
    '--height': height,
    '--quantity': quantity,
  }
  return (
    <div className={styles.carouselContainer}>
        <div className={styles.slider} style={sliderStyle}>
            <div className={styles.list}>
                {
                    flag_images.map((image, index) => (
                        <div key={index} style={{'--position': index}} className={styles.item}>
                            <img src={image} alt={`Flag ${index}`} />
                        </div>
                    ))
                }
            </div>
        </div>
    </div>
  );
};
export default Carousel;