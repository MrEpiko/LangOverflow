import { useState, useEffect } from 'react';
import { translations, typingSpeed, deletingSpeed, pauseBetweenText } from '../utils/constants';
const useTypingAnimation = () => {
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTranslation, setCurrentTranslation] = useState(0);
  useEffect(() => {
    const handleTyping = () => {
      const currentWord = translations[currentTranslation];
      if (isDeleting) {
        setTypedText((prev) => prev.slice(0, -1));
      } else {
        setTypedText((prev) => currentWord.slice(0, prev.length + 1));
      }
    };
    const timer = setInterval(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
    if (typedText === translations[currentTranslation] && !isDeleting) {
      setTimeout(() => setIsDeleting(true), pauseBetweenText);
    }
    if (typedText === '' && isDeleting) {
      setIsDeleting(false);
      setCurrentTranslation((prev) => (prev + 1) % translations.length);
    }
    return () => clearInterval(timer);
  }, [typedText, isDeleting, currentTranslation]);
  return typedText;
};
export default useTypingAnimation;