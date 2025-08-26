// src/components/UserLogOut/UserLogOut.jsx
import styles from './UserLogOut.module.scss';
import { logOut } from '../../utilities/users-service';

export default function UserLogOut({ user, setUser }) {
  function handleLogOut() {
    logOut();
    setUser(null);
  }

  return (
    <div className={styles.UserLogOut}>
      <div className={styles.name}>{user?.name}</div>
      <div className={styles.email}>{user?.email}</div>
      <button className={styles.btn} onClick={handleLogOut}>LOG OUT</button>
    </div>
  );
}