import { useTagStore } from '../services/store/useTagStore';
import style from './Tag.module.css';
const Tag = ({ title }) => {
  const tagStore = useTagStore();
  const handleOnClick = () => {
    tagStore.removeTag(title);
  }
  return (
    <div className={style.tag}>
      <p>{title}</p>
      <button type="button" onClick={handleOnClick}>✖</button>
    </div>
  );
}
export default Tag;