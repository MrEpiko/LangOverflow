import React, { useState } from 'react'
import styles from './QuestionPage.module.css'
import { useTagStore } from '../services/store/useTagStore';
import Tags from '../components/Tags';
import { useToastMessage } from '../hooks/useToastMessage';
import { useQuestionService } from '../services/api/useQuestionService';
import { useAuthContext } from '../hooks/useAuthContext';

const QuestionPage = () => {

  const tagStore = useTagStore();
  const { errorMessage } = useToastMessage();
  const { question } = useQuestionService();
  const { user } = useAuthContext();
  
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    currentTag: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if(formData.title.length < 5)errorMessage("Title needs atleast 5 letters.");
    if(formData.content.length < 5)errorMessage("Content needs atleast 10 letters.");
    if(tagStore.title.length < 1)errorMessage("You need atleast 1 tag in your post");
    const requestObj = {
      title: formData.title,
      content: formData.content,
      author_id: user.id,
      tags: tagStore.title
    }
    question(requestObj);
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOnClickTag = () => {
    if(formData.currentTag.length < 3){
      errorMessage("Tag needs to have 3 or more characters");
      return;
    }
    tagStore.addTag(formData.currentTag);
    setFormData({...formData, ["currentTag"] : ""});
  }

  
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
        <textarea
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
        <button type="button" onClick={handleOnClickTag}>add</button>
        <p>*</p> 
        {/* TOOLTIP Tag can be a language or type of help that you need. Example for tags: (English, Spanish, synonym, antonym, grammar)  */}
        </div>
        <div>
        {tagStore.title.map((title,index) => (
          <Tags title={title} key={index} id = {index} ></Tags>
        ))}
        </div>
        <button type="submit">Post it</button>
      </form>
    </div>

  )
}

export default QuestionPage