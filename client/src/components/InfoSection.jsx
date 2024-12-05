import connection_img from '../assets/connections.png'
import style from "./InfoSection.module.css";
const InfoSection = ( { children }) => {
  return (
    <section className={style.infoSection}>
      <div className={style.leftSide}>
        <h1>Learn a second language or help someone?</h1>
        <p>
            Contrary to popular belief, Lorem Ipsum is not simply random text. 
            It has roots in a piece of classical Latin literature from 45 BC, 
            making it over 2000 years old. Richard McClintock,
            a Latin professor at Hampden-Sydney College in Virginia,
            looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage,
            and going through the cites of the word in classical literature, discovered the undoubtable source.
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