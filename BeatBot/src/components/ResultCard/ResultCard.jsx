// src/components/ResultCard/ResultCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styles from './ResultCard.module.scss';

const ResultCard = ({ recommendation, onReset }) => {
  if (!recommendation) return null;

  const { title, explanation, metadata, tracks } = recommendation;

  return (
    <article className={styles.resultCard}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {explanation && <p className={styles.explanation}>{explanation}</p>}

      {metadata && (
        <div className={styles.metadata}>
          <span>Age: {metadata.ageGroup}</span>
          <span>Mood: {metadata.mood}</span>
          <span>Activity: {metadata.activity}</span>
          <span>Energy: {metadata.energy}</span>
        </div>
      )}

      {Array.isArray(tracks) && tracks.length > 0 && (
        <div className={styles.tracks}>
          <h4>Recommended Tracks</h4>
          <ul>
            {tracks.map((t, i) => (
              <li key={`${t.title}-${t.artist}-${i}`} className={styles.track}>
                <div className={styles.trackInfo}>
                  <strong>{t.title}</strong> — {t.artist}
                </div>
                {t.why && <div className={styles.trackWhy}>{t.why}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {onReset && (
        <div className={styles.actions}>
          <button onClick={onReset} className={styles.resetButton}>
            Get Another Recommendation
          </button>
        </div>
      )}
    </article>
  );
};

ResultCard.propTypes = {
  recommendation: PropTypes.shape({
    title: PropTypes.string,
    explanation: PropTypes.string,
    metadata: PropTypes.object,
    tracks: PropTypes.arrayOf(PropTypes.object),
  }),
  onReset: PropTypes.func,
};

export default ResultCard;