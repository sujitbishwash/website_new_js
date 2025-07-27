import React, { useEffect, useState } from 'react';
import '../styles/TestSeries.css';
import { fetchTestSeriesFormData, testSeriesApi } from '../lib/api-client';
import { useNavigate } from 'react-router-dom';

interface SubTopic {
  subject: string;
  sub_topic: string[];
}

interface TestSeriesFormData {
  subjects: SubTopic[];
  level: string[];
  language: string[];
}

const TestSeries: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TestSeriesFormData | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedSubTopics, setSelectedSubTopics] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<string>('medium');
  const [language, setLanguage] = useState<string>('en');
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Get token from your auth context/state
        const data = await fetchTestSeriesFormData();
        console.log(data);
        setFormData(data);
      } catch (err: any) {
        setError( 'Failed to save exam preferences' + err);
        // console.log(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    validateForm();
  }, [selectedSubject, difficulty, language]);

  const validateForm = () => {
    setIsFormValid(!!selectedSubject && !!difficulty && !!language);
  };

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    setSelectedSubTopics([]);
  };

  const handleSubTopicChange = (subTopic: string) => {
    setSelectedSubTopics(prev => 
      prev.includes(subTopic)
        ? prev.filter(topic => topic !== subTopic)
        : [...prev, subTopic]
    );
  };

  const generateTestUrl = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setIsLoading(true);
      const response = await testSeriesApi.createTest({
        subject: selectedSubject!,
        sub_topic: selectedSubTopics,
        level: difficulty,
        language: language
      });
      console.log(response);
      navigate(`/exam-instructions?testId=${response.testId}`);
    } catch (err: any) {
      setError('Failed to create test: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <main className="main-content-area">
      <div className="test-config-container">
        <h1>Configure Your Test</h1>
        <p>Select your preferences to start a practice test.</p>

        <form id="test-config-form" className="config-form">
          {/* Subject Selection */}
          <fieldset className="config-section">
            <legend>1. Select Subject</legend>
            <div className="radio-group subject-group">
              {formData.subjects.map((subject) => (
                <label key={subject.subject}>
                  <input
                    type="radio"
                    name="subject"
                    value={subject.subject}
                    checked={selectedSubject === subject.subject}
                    onChange={() => handleSubjectChange(subject.subject)}
                    required
                  />
                  {subject.subject}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Sub-Topic Selection */}
          {selectedSubject && formData.subjects.find(s => s.subject === selectedSubject) && (
            <fieldset className="config-section">
              <legend>2. Select Sub-Topic (Optional)</legend>
              <div className="checkbox-group">
                {formData.subjects.find(s => s.subject === selectedSubject)?.['sub_topic']?.map((topic: string) => (
                  <label key={topic}>
                    <input
                      type="checkbox"
                      name="subtopic"
                      value={topic.toLowerCase().replace(/\s+/g, '_')}
                      checked={selectedSubTopics.includes(topic.toLowerCase().replace(/\s+/g, '_'))}
                      onChange={() => handleSubTopicChange(topic.toLowerCase().replace(/\s+/g, '_'))}
                    />
                    {topic}
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {/* Difficulty Level */}
          <fieldset className="config-section">
            <legend>3. Select Difficulty Level</legend>
            <div className="radio-group">
              {formData.level.map((level) => (
                <label key={level}>
                  <input
                    type="radio"
                    name="difficulty"
                    value={level.toLowerCase()}
                    checked={difficulty === level.toLowerCase()}
                    onChange={() => setDifficulty(level.toLowerCase())}
                    required
                  />
                  {level}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Language Selection */}
          <fieldset className="config-section">
            <legend>4. Select Language</legend>
            <div className="radio-group">
              {formData.language.map((lang) => (
                <label key={lang}>
                  <input
                    type="radio"
                    name="language"
                    value={lang}
                    checked={language === lang}
                    onChange={() => setLanguage(lang)}
                    required
                  />
                  {lang === 'en' ? 'English' : 'Hindi'}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Start Button */}
          <div className="start-button-container">
            <a
              href="#"
              onClick={generateTestUrl}
              className={`btn-start-test ${!isFormValid || isLoading ? 'disabled' : ''}`}
            >
              {isLoading ? 'Creating Test...' : 'Continue'}
            </a>
            {!selectedSubject && (
              <p className="error-message">Please select a subject.</p>
            )}
          </div>
        </form>
      </div>
    </main>
  );
};

export default TestSeries; 