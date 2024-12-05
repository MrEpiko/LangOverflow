import { useEffect } from "react";
import styles from "./NumsSection.module.css";
const NumsSection = () => {
  const isElementInView = (element) => {
    const rect = element.getBoundingClientRect();
    return rect.top <= window.innerHeight && rect.bottom >= 0;
  };
  const handleScroll = () => {
    const numItems = document.querySelectorAll('.num');
    numItems.forEach((item) => {
      if (isElementInView(item) && !item.classList.contains('visible')) {
        item.classList.add('visible');
        const targetNumber = parseInt(item.textContent);
        let currentNumber = 0;
        const increment = targetNumber / 100;
        const interval = setInterval(() => {
          if (currentNumber < targetNumber) {
            currentNumber += increment;
            item.textContent = Math.floor(currentNumber);
          } else {
            clearInterval(interval);
          }
        }, 20);
      }
    });
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <section className={styles.numsSection}>
        <h1>Did you know?</h1>
        <div className={styles.numsContainer}>
          <div className={styles.numItem}>
            <div>
              <span className='num'>86</span><span>.3%</span>
            </div>
            <div className={styles.divider}></div>
            <p>of people know how to read</p>
          </div>
          <div className={styles.numItem}>
            <div>
              <span className='num'>57</span><span>%</span>
            </div>
            <div className={styles.divider}></div>
            <p>of people don't know a second language</p>
          </div>
          <div className={styles.numItem}>
            <div>
              <span className='num'>17</span><span>.5%</span>
            </div>
            <div className={styles.divider}></div>
            <p>of people speak more than 2 languages fluently</p>
          </div>
        </div>
      </section>
  );
}
export default NumsSection;