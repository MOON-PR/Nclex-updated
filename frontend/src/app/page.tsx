'use client';

import { motion } from 'framer-motion';
import Image from "next/image";
import styles from "../styles/HeroSection.module.css"
import dynamic from "next/dynamic";
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';


export default function HeroSection() {
  const [showModal, setShowModal] = useState(false);

  let { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false);


  const Modal = dynamic(() => import('../components/layouts/Modal'), {
    ssr: false
  });
  useEffect(() => { setMounted(true); }, [showModal]);

  if (!mounted) return null; // Or show a skeleton/fallback

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.backgroundSvg}>
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              fill={`${resolvedTheme == "dark" ? "#1e2d4f" : "#cce4ff"}`}
              d="M0,224L60,197.3C120,171,240,117,360,122.7C480,128,600,192,720,213.3C840,235,960,213,1080,181.3C1200,149,1320,107,1380,85.3L1440,64V320H0Z"
            />
          </svg>
        </div>
        {/* Left Side: Text */}
        <motion.div
          className={styles.heroLeft}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className={styles.heroTitle}>Master Your NCLEX Journey</h1>
          <p className={styles.heroSubtitle}>
            Comprehensive nursing exam preparation with expert-crafted questions and personalized learning paths.
          </p>
          <div className={styles.buttonGroup}>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              transition={{ duration: 0.2 }}
              className="button-primary"
              onClick={() => setShowModal(true)}
            >
              Get Started
            </motion.button>
            <Link href="/test">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                transition={{ duration: 0.2 }}
                className="button-success"
              >
                Quick Test
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Right Side: SVG */}
        <motion.div
          className={styles.heroRight}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          {/* Replace with your actual SVG or <Image /> */}
          <Image src="/images/svg/OnlineDoctor.svg" alt='NCLEX' width={500} height={500} data-aos="zoom-out" data-aos-delay="100" />

        </motion.div>
      </section>
     
      <section className={styles.backSvg}>
        {/* Text */}
        <div className={styles.heroContent}>
          <motion.h1 
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            learn anytime, anywhere
          </motion.h1>
          
          <motion.p 
            className={styles.heroDescription}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Master your NCLEX preparation with our comprehensive study materials, 
            practice questions, and expert guidance. Study at your own pace, 
            track your progress, and achieve your nursing career goals.
          </motion.p>

          <motion.div 
            className={styles.statsContainer}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className={styles.statItem}>
              <motion.div 
                className={styles.statNumber}
                whileHover={{ scale: 1.1 }}
              >
                10,000+
              </motion.div>
              <div className={styles.statLabel}>Practice Questions</div>
            </div>
            
            <div className={styles.statItem}>
              <motion.div 
                className={styles.statNumber}
                whileHover={{ scale: 1.1 }}
              >
                95%
              </motion.div>
              <div className={styles.statLabel}>Success Rate</div>
            </div>
            
            <div className={styles.statItem}>
              <motion.div 
                className={styles.statNumber}
                whileHover={{ scale: 1.1 }}
              >
                50,000+
              </motion.div>
              <div className={styles.statLabel}>Students Helped</div>
            </div>
          </motion.div>

          <motion.div
            className={styles.buttonGroup}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link href="/practice" target="_blank" rel="noopener noreferrer">
              <motion.button
                whileHover={{ y: -4, scale: 1.05 }}
                whileTap={{ y: 0 }}
                transition={{ duration: 0.2 }}
                className="button-primary"
              >
                Start Practicing
              </motion.button>
            </Link>
            
            <Link href="/courses">
              <motion.button
                whileHover={{ y: -4, scale: 1.05 }}
                whileTap={{ y: 0 }}
                transition={{ duration: 0.2 }}
                className="button-success"
              >
                View Courses
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>




      {showModal && <Modal onClose={() => setShowModal(false)} />}
    </>
  );
}
