import React from 'react';
import './AIAnswer.css';

interface AIAnswerProps {
  answer: string;
  isLoading?: boolean;
}

const AIAnswer: React.FC<AIAnswerProps> = ({ answer, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="ai-answer-container content-section holographic-texture">
        <div className="section-header">
          <div className="section-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="var(--color-bright-blue)"
              />
            </svg>
          </div>
          <h2 className="section-title">AI Answer</h2>
        </div>

        <div className="ai-answer-content loading-skeleton">
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line short"></div>
        </div>
      </div>
    );
  }

  if (!answer) return null;

  return (
    <div className="ai-answer-container content-section holographic-texture fade-in-up">
      <div className="section-header">
        <div className="section-icon glow-pulse">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill="var(--color-bright-blue)"
            />
          </svg>
        </div>
        <h2 className="section-title">AI Answer</h2>
      </div>

      <div className="ai-answer-content">
        <div className="answer-text">
          {answer.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="ai-badge">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="var(--color-bright-blue)" strokeWidth="2"/>
            <circle cx="8" cy="8" r="3" fill="var(--color-bright-blue)"/>
          </svg>
          <span>Powered by Gemini AI</span>
        </div>
      </div>
    </div>
  );
};

export default AIAnswer;
