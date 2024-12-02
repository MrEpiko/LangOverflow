import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthService } from '../services/api/useAuthService';
import { useAuthContext } from '../hooks/useAuthContext';
import { useToastMessage } from '../hooks/useToastMessage';
import { validateEmail } from '../utils/utils';
import styles from './RegisterPage.module.css';
const RegisterPage = () => {
  const { register } = useAuthService();
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
  if (token != null) return <Navigate to="/" replace />;
  return (
    <div className={styles.registerForm}>
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
};
export default RegisterPage;