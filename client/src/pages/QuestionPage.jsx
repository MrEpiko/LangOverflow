import React, { useState } from 'react'
import styles from './QuestionPage.module.css'
import { useAuthContext } from '../hooks/useAuthContext'

const QuestionPage = () => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    currentTag: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  }



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  return (
    <div className={styles.questionForm}>
        <h1>Ask a question?</h1>
        <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          onChange={handleChange}
          value={formData.title}
        />
        <input
          type="text"
          name="content"
          placeholder="Content"
          onChange={handleChange}
          value={formData.content}
        />
        <div className={styles.tagForm}>
        <input
          type="text"
          name="currentTag"
          placeholder="Add a tag"
          onChange={handleChange}
          value={formData.currentTag}
        />
        <button>add</button>
        <p>*</p> 
        {/* TOOLTIP Tag can be a language or type of help that you need. Example for tags: (English, Spanish, synonym, antonym, homonym)  */}
        </div>
       
        <button type="submit">Post it</button>
      </form>
    </div>

  )
}

export default QuestionPage