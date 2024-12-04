import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthService } from '../services/api/useAuthService';
import { useAuthContext } from '../hooks/useAuthContext';
import { useToastMessage } from '../hooks/useToastMessage';
import { validateEmail } from '../utils/utils';
import flags_img from '../assets/flags_fill.png'
import styles from './LoginPage.module.css';
const LoginPage = () => {
  const { token } = useAuthContext();
  const { login, authWithGoogle } = useAuthService();
  const { errorMessage } = useToastMessage();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email) || formData.password.length < 5) {
      errorMessage("Invalid user data");
      return;
    }
    login(formData);
  };
  const handleGoogleSuccess = async (payload) => {
    const { credential } = payload;
    authWithGoogle({ credential })
  };
  const handleGoogleFailure = (error) => {
    console.error('Google login failed', error);
    errorMessage('Google login failed');
  };
  if (token != null) return <Navigate to="/home" replace />;
  return (
    <div className={styles.container}>
      <div className={styles.loginForm}>
        <div className={styles.loginForm_left}>
          <h2 className={styles.form_title}>Log in</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="email"
              placeholder="E-mail"
              onChange={handleChange}
              value={formData.email}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={formData.password}
            />
            <div className={styles.registerWrapper}>
              <span>Don't have an account?</span>
              <span>
                <Link to="/register" replace>Register</Link>
              </span>
            </div>
            <div className={styles.googleLoginContainer}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                buttonText="Continue with Google"
                theme="filled_black"
              />
            </div>
            <button type="submit">Log in</button>
          </form>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.loginForm_right}>
          <Link to='/' replace><h2 className={styles.logotitle}>LangOverflow</h2></Link>
          <p>Best language learning site supported by the community</p>
          <div className={styles.imgWrapper}>
            <img src={flags_img} alt="" />
          </div>
        </div>
      </div>   
    </div>
  );  
};
export default LoginPage;