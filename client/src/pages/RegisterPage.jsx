import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthService } from '../services/api/useAuthService';
import { useAuthContext } from '../hooks/useAuthContext';
import { useToastMessage } from '../hooks/useToastMessage';
import { validateEmail } from '../utils/utils';
import flags_img from '../assets/flags_fill.png'
import styles from './RegisterPage.module.css';
const RegisterPage = () => {
  const { register, authWithGoogle } = useAuthService();
  const { token } = useAuthContext();
  const { errorMessage } = useToastMessage();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, email, password } = formData;
    if (password !== formData.confirm_password) {
      errorMessage("Your password and confirmation password do not match");
      return;
    }
    if (!validateEmail(email) || password.length < 5 || username.length < 3) {
      errorMessage("Invalid user data");
      return;
    }
    register({ username, email, password});
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
      <div className={styles.registerForm}>
        <div className={styles.registerForm_left}>
          <h2>Register</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={handleChange}
                value={formData.username}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
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
              <input
                type="password"
                name="confirm_password"
                placeholder="Confirm Password"
                onChange={handleChange}
                value={formData.confirm_password}
              />
              <div className={styles.loginWrapper}>
                <span>Alrady have an account?</span>
                <span>
                  <Link to="/login" replace>Log in</Link>
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
              <button type="submit">Register</button>      
          </form>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.registerForm_right}>
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
export default RegisterPage;