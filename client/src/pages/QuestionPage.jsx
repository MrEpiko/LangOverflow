import { useState } from 'react'
import { useTagStore } from '../services/store/useTagStore';
import { useToastMessage } from '../hooks/useToastMessage';
import { useQuestionService } from '../services/api/useQuestionService';
import { useAuthContext } from '../hooks/useAuthContext';
import Tag from '../components/Tag';
import styles from './QuestionPage.module.css'
const QuestionPage = () => {
  const titles = useTagStore((state) => state.title);
  const addTag = useTagStore((state) => state.addTag);
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
    if(formData.title.length < 5) {
      errorMessage("Title needs atleast 5 letters.");
      return;
    }
    if(formData.content.length < 5) {
      errorMessage("Content needs atleast 10 letters.");
      return;
    }
    if(titles.length < 1) {
      errorMessage("You need atleast 1 tag in your post");
      return;
    }
    const requestObj = {
      title: formData.title,
      content: formData.content,
      author_id: user.id,
      tags: titles
    }
    question(requestObj);
  }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleOnClickTag = () => {
    if(formData.currentTag.length < 3) {
      errorMessage("Tag needs to have 3 or more characters");
      return;
    }
    if (titles.length + 1 > 5) {
      errorMessage("Maximum of 5 tags are allowed");
      return
    }
    addTag(formData.currentTag);
    setFormData({...formData, ["currentTag"] : ""});
  }
  return (
    <div className={styles.container}>
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
          <div>
            <input
              type="text"
              name="currentTag"
              placeholder="Add a tag"
              onChange={handleChange}
              value={formData.currentTag}
            />
            <button type="button" className={styles.tagButton} onClick={handleOnClickTag}>Add</button>
          </div>
          <span className={styles.tooltipIcon}>
              ?
              <span className={styles.tooltipText}>
                Tag can be a language or type of help that you need. Example for tags: (English, Spanish, synonym, antonym, grammar)
              </span>
            </span>
        </div>
        <div className={styles.tagsWrapper}>
        {titles.map((title,index) => (
          <Tag title={title} key={index} id={index} ></Tag>
        ))}
        </div>
        <button type="submit">Post it</button>
      </form>
    </div>
    </div>
  );
}
export default QuestionPage