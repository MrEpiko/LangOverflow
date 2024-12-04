import { useTagSearchStore } from '../services/store/useTagSearchStore';
import { useTagStore } from '../services/store/useTagStore';
import style from './Tag.module.css';
const Tag = ({ title, whatStore }) => {
  const tagStore = useTagStore();
  const tagSearchStore = useTagSearchStore();
  const handleOnClick = () => {
    if (whatStore === "tagStore"){tagStore.removeTag(title);}
    else (whatStore === "tagSearchStore")
    {tagSearchStore.removeTag(title);}
  }
  return (
    <div className={style.tag}>
      <p>{title}</p>
      <button type="button" onClick={handleOnClick}>✖</button>
    </div>
  );
}
export default Tag;