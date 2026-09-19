'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import type { Section, QuizConfig, GameQuestion } from '@/types';

interface Props {
  section: Section;
  questions: GameQuestion[];
}

export default function LoveQuiz({ section, questions }: Props) {
  const config = section.config as QuizConfig;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const quizQuestions = questions.filter(q => q.type === 'quiz');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  if (!quizQuestions.length) return null;

  const current = quizQuestions[currentIdx];

  const handleAnswer = (answerId: string, correct: boolean, message: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answerId);
    setIsCorrect(correct);
    setResponseMessage(message);
    if (correct) setScore(s => s + 1);

    setTimeout(() => {
      if (currentIdx + 1 < quizQuestions.length) {
        setCurrentIdx(i => i + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setResponseMessage('');
      } else {
        setCompleted(true);
      }
    }, 1800);
  };

  return (
    <section ref={ref} className="section-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="section-heading">{config.heading || 'How Well Do You Know Us? 💕'}</h2>
        {config.subtitle && <p className="section-subheading">{config.subtitle}</p>}

        <AnimatePresence mode="wait">
          {!completed ? (
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="card mt-8 p-6 sm:p-8"
            >
              {/* Progress */}
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
                  {currentIdx + 1} / {quizQuestions.length}
                </span>
                <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--color-border)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'var(--color-primary)' }}
                    animate={{ width: `${((currentIdx + 1) / quizQuestions.length) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              {/* Question */}
              <p
                className="text-xl font-bold mb-6 leading-snug"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
              >
                {current.question}
              </p>

              {current.image_url && (
                <img src={current.image_url} alt="" className="w-full h-40 object-cover rounded-xl mb-6" />
              )}

              {/* Answers */}
              <div className="space-y-3">
                {current.answers.map(ans => {
                  const isSelected = selectedAnswer === ans.id;
                  const showResult = !!selectedAnswer;
                  let bg = 'var(--color-bg)';
                  let border = 'var(--color-border)';
                  let textColor = 'var(--color-text)';

                  if (showResult && isSelected) {
                    bg = ans.is_correct ? '#dcfce7' : '#fee2e2';
                    border = ans.is_correct ? '#86efac' : '#fca5a5';
                  } else if (showResult && ans.is_correct) {
                    bg = '#dcfce7';
                    border = '#86efac';
                  }

                  return (
                    <motion.button
                      key={ans.id}
                      whileHover={!selectedAnswer ? { scale: 1.02 } : {}}
                      whileTap={!selectedAnswer ? { scale: 0.98 } : {}}
                      onClick={() => handleAnswer(ans.id, ans.is_correct, ans.response_message)}
                      disabled={!!selectedAnswer}
                      className="w-full text-left p-4 rounded-xl border text-sm font-medium transition-all duration-300"
                      style={{ background: bg, borderColor: border, color: textColor, cursor: selectedAnswer ? 'default' : 'pointer' }}
                    >
                      {ans.text}
                    </motion.button>
                  );
                })}
              </div>

              {/* Response message */}
              <AnimatePresence>
                {responseMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 p-3 rounded-xl text-sm text-center font-medium"
                    style={{
                      background: isCorrect ? '#dcfce7' : '#fff7ed',
                      color: isCorrect ? '#166534' : '#9a3412',
                    }}
                  >
                    {isCorrect ? '✓ ' : '✗ '}{responseMessage}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="card mt-8 p-8"
            >
              <div className="text-5xl mb-4">🎉</div>
              <h3
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
              >
                {score === quizQuestions.length ? 'Perfect Score! 🌟' : `${score}/${quizQuestions.length} correct!`}
              </h3>
              <p className="text-base" style={{ color: 'var(--color-muted)' }}>
                {config.completion_message || 'You know us so well! 🥹'}
              </p>
              <button
                onClick={() => { setCurrentIdx(0); setCompleted(false); setScore(0); setSelectedAnswer(null); }}
                className="btn-primary mt-6"
              >
                Play Again 🔄
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
