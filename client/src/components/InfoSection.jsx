import connection_img from '../assets/connections.png'
import style from "./InfoSection.module.css";
const InfoSection = ( { children }) => {
  return (
    <section className={style.infoSection}>
      <div className={style.leftSide}>
        <h1>Learn a second language or help someone?</h1>
        <p>
        Welcome to LangOverflow, the ultimate Q&A platform for language enthusiasts, learners, and experts alike. Whether you’re decoding tricky grammar, seeking pronunciation tips, or exploring cultural nuances, LinguaSpace connects you with a global community passionate about languages. Share your expertise, ask burning questions, and learn from native speakers and linguists across diverse languages. Our system rewards meaningful contributions with badges and recognition, fostering an environment of collaboration and growth. Dive into rich discussions, discover new perspectives, and build confidence in your language journey. At LinguaSpace, every question matters—because communication unites us all.
        </p>
        { children }
      </div>
      <div className={style.imageWrapper}>
        <img src={connection_img} alt="" />
      </div>
    </section>
  );
}
export default InfoSection;