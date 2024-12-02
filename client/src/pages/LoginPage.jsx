import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthService } from '../services/api/useAuthService';
import { useAuthContext } from '../hooks/useAuthContext';
import { useToastMessage } from '../hooks/useToastMessage';
import { validateEmail } from '../utils/utils';
import styles from './LoginPage.module.css';
const LoginPage = () => {
  const { login } = useAuthService();
  const { token } = useAuthContext();
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
  if (token != null) return <Navigate to="/" replace />;
  return (
    <div className={styles.loginForm}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
export default LoginPage;