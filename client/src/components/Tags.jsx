import { useTagStore } from '../services/store/useTagStore'
import style from './Tags.module.css'
import React from 'react'

const Tags = ({ title, id }) => {
    const tagStore = useTagStore();


    const handleOnClick = () => {
        tagStore.removeTag(title);
    }

  return (
    <div className={style.tag}>
        <p>{title}</p>
        <button type="button" onClick={handleOnClick}>✖</button>
    </div>
  )
}

export default Tags