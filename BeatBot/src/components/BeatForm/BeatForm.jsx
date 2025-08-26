// src/components/BeatForm/BeatForm.jsx
import React, { useState } from 'react';
import styles from './BeatForm.module.scss';
import ResultCard from '../ResultCard/ResultCard';

const BeatForm = () => {
  const [formData, setFormData] = useState({
    ageGroup: '',
    mood: '',
    activity: '',
    energy: '',
    genres: [],
    language: 'any',
    count: 10
  });

  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState('');

  const ageGroups = [
    { value: 'under-12', label: 'Under 12' },
    { value: '13-17', label: '13-17' },
    { value: '18-29', label: '18-29' },
    { value: '30-44', label: '30-44' },
    { value: '45-59', label: '45-59' },
    { value: '60+', label: '60+' }
  ];

  const moods = [
    'energetic','chill','happy','sad','focused','romantic','angry','nostalgic'
  ];

  const activities = [
    'studying','work','workout','driving','cooking','relaxing','party','sleep'
  ];

  const energyLevels = ['low', 'medium', 'high'];

  const availableGenres = [
    'pop','rock','hip-hop','jazz','classical','electronic',
    'country','r&b','folk','blues','reggae','metal',
    'indie','punk','ambient','latin','world'
  ];

  const languages = [
    { value: 'any', label: 'Any Language' },
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'italian', label: 'Italian' },
    { value: 'portuguese', label: 'Portuguese' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'korean', label: 'Korean' },
    { value: 'chinese', label: 'Chinese' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenreToggle = (genre) => {
    setFormData(prev => {
      const selected = prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre];
      return { ...prev, genres: selected.slice(0, 8) };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setRecommendation(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to get recommendation');

      const data = await response.json();
      setRecommendation(data);
    } catch (err) {
      setError('Failed to get music recommendation. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      ageGroup: '',
      mood: '',
      activity: '',
      energy: '',
      genres: [],
      language: 'any',
      count: 10
    });
    setRecommendation(null);
    setError('');
  };

  const maxGenresSelected = formData.genres.length >= 8;

  return (
    <div className={styles.beatForm}>
      <h2 className={styles.title}>Your Perfect Music Recommendation</h2>

      {!recommendation ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="ageGroup">Age Group </label>
            <select
              id="ageGroup"
              name="ageGroup"
              value={formData.ageGroup}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Age Group</option>
              {ageGroups.map(group => (
                <option key={group.value} value={group.value}>{group.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="mood">Mood </label>
            <select
              id="mood"
              name="mood"
              value={formData.mood}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Mood</option>
              {moods.map(mood => (
                <option key={mood} value={mood}>
                  {mood.charAt(0).toUpperCase() + mood.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="activity">Activity </label>
            <select
              id="activity"
              name="activity"
              value={formData.activity}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Activity</option>
              {activities.map(activity => (
                <option key={activity} value={activity}>
                  {activity.charAt(0).toUpperCase() + activity.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="energy">Energy Level </label>
            <select
              id="energy"
              name="energy"
              value={formData.energy}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Energy Level</option>
              {energyLevels.map(level => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Genres (Select up to 8)</label>
            <div className={styles.genreGrid}>
              {availableGenres.map(genre => {
                const selected = formData.genres.includes(genre);
                const disabled = maxGenresSelected && !selected;
                return (
                  <label key={genre} className={styles.genreCheckbox}>
                    <input
                      type="checkbox"
                      checked={selected}
                      disabled={disabled}
                      onChange={() => handleGenreToggle(genre)}
                    />
                    <span>{genre.charAt(0).toUpperCase() + genre.slice(1)}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="language">Language Preference</label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleInputChange}
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="count">Number of Tracks (3-20)</label>
            <input
              type="range"
              id="count"
              name="count"
              min="3"
              max="20"
              value={formData.count}
              onChange={handleInputChange}
              className={styles.rangeSlider}
            />
            <span className={styles.rangeValue}>{formData.count}</span>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            disabled={isLoading || !formData.ageGroup || !formData.mood || !formData.activity || !formData.energy}
            className={styles.submitButton}
          >
            {isLoading ? 'Getting Recommendation...' : 'Get Music Recommendation'}
          </button>
        </form>
      ) : (
        <ResultCard recommendation={recommendation} onReset={resetForm} />
      )}
    </div>
  );
};

export default BeatForm;