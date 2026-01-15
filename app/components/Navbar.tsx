import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.navLeft}>
        <i className="fa fa-house"></i>
        <span>Health Amaze | SM LAB</span>
      </div>

      <nav className={styles.navLinks}>
        <Link href="/">Home</Link>
        <Link href="/bills">Bills</Link>
        <Link href="#">Reports</Link>
        <Link href="/patients">Patients</Link>
        <Link href="/doctors">Doctors</Link>
        <Link href="/tests">Tests</Link>
        <Link href="#">Test Package</Link>
        <Link href="#">Business Analysis</Link>
        <Link href="#">Help Videos</Link>
        <Link href="#">Refer & Earn</Link>
        <Link href="#">Product Tour</Link>
        <Link href="#">Feedback</Link>
      </nav>

      <div className={styles.navRight}>
        <div className={styles.searchBox}>
          <i className="fa fa-search"></i>
          <span>Search</span>
        </div>
        <i className="fa fa-bell"><span className={styles.badge}>4</span></i>
        <i className="fa fa-gear"></i>
        <i className="fa fa-download"></i>
        <i className="fa fa-user"></i>
      </div>
    </header>
  );
}
