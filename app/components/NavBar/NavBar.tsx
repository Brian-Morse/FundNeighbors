"use client";
import React, { useEffect, useState } from "react";
import styles from "./NavBar.module.css";
import Link from "next/link";
import Image from "next/image";
import { getSession, logout, User } from "../../lib/auth";
import { useRouter, usePathname } from "next/navigation";

const NavBar = () => {
  const [session, setSession] = useState<User | null>(null);
  const [menu, setMenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchSession = async () => {
      const user = await getSession();
      setSession(user);
    };
    fetchSession();

    const handleResize = () => {
      if (window.innerWidth > 850) {
        setMenu(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      setMenu(false);
    };
    handleRouteChange();
  }, [pathname]);

  const toggleMenu = () => {
    setMenu(!menu);
  };

  if (session) {
    return (
      <div className={styles.fullBar}>
        <Link href="/" className={styles.logo}>
          <Image
            className={styles.logoImage}
            src="/fundneighbors-logo.png"
            alt="Fund Neighbors Logo"
            width={150}
            height={150}
            priority={true}
          />
        </Link>

        <div className={styles.hamburger} onClick={toggleMenu}>
          &#9776;
        </div>

        <div className={`${styles.links} ${menu ? styles.menuShow : ""}`}>
          <ul className={styles.navLinks}>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/calendar">Calendar</Link>
            </li>
            <li>
              <Link href="/addevent">Add Event</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
          </ul>

          <ul className={styles.accountLinks}>
            <li>
              <Link href="/user">{session.name}</Link>
            </li>
            <li>
              <button
                onClick={async () => {
                  setSession(null);
                  await logout();
                  router.push("/");
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.fullBar}>
      <Link href="/" className={styles.logo}>
        <Image
          className={styles.logoImage}
          src="/fundneighbors-logo.png"
          alt="Fund Neighbors Logo"
          width={150}
          height={150}
        />
      </Link>

      <div className={styles.hamburger} onClick={toggleMenu}>
        &#9776;
      </div>

      <div className={`${styles.links} ${menu ? styles.menuShow : ""}`}>
        <ul className={styles.navLinks}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/calendar">Calendar</Link>
          </li>
          <li>
            <Link href="/addevent">Add Event</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
        </ul>

        <ul className={styles.loginLinks}>
          <li>
            <Link href="/signup">Sign Up</Link>
          </li>
          <li>
            <Link href="/login">Login</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
