import { useEffect, useState } from 'react';
import { useTagSearchStore } from '../services/store/useTagSearchStore';
import styles from './Questions.module.css'
import Tag from '../components/Tag';
import { useToastMessage } from '../hooks/useToastMessage';
import { useQuestionService } from '../services/api/useQuestionService';
import { Link } from 'react-router-dom';

const Questions = () => {
    const titles = useTagSearchStore((state) => state.title);
    const addTag = useTagSearchStore((state) => state.addTag);
    const { errorMessage } = useToastMessage();
    const [formData, setFormData] = useState({
        currentTag: ''
      });
    const [datat, setData] = useState({});
    const {searchQuestionQuery} = useQuestionService();

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
          return;
        }
        addTag(formData.currentTag);
        setFormData({...formData, ["currentTag"] : ""});
      }

      const handleOnClickSearch =  async () => {
        if (titles.length < 1){
            errorMessage("At least 1 tag is needed for search.");
            return;
        }
        
        const  data  = await searchQuestionQuery();
          setData(data);

      }

     

  return (
    <> 
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <br></br> 
    <h1>Questions</h1>
    <div className={styles.tagSearch}>
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
                Tag can be a language or type of help that you need. Examples for tags: English, Spanish, synonym, antonym, grammar.
              </span>
            </span>
        </div>
    <div className={styles.tagsWrapper}>
        {titles.map((title,index) => (
          <Tag title={title} key={index} id={index} whatStore={"tagSearchStore"} ></Tag>
        ))}
    </div>
    <button onClick={handleOnClickSearch}>Search</button>
    {datat && Object.keys(datat).length > 0 ? (
    datat.threads.map((thread) => (
        <Link to={`/questioninfullfocus/${thread.id}`} key={thread.id}>
            <h1>{thread.title}</h1>
            <h3>
                {thread.content.length > 20
                    ? thread.content.substring(0, 20) + "..."
                    : thread.content}
            </h3>
        </Link>
    ))
    ) : null}
    </>
  )
}

export default Questions