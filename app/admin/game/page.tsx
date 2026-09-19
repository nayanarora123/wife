'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAdminData } from '@/components/admin/AdminDataContext';
import type { GameQuestion, MarriageGameConfig } from '@/types';
import AdminInput from '@/components/admin/AdminInput';
import AdminTextarea from '@/components/admin/AdminTextarea';
import AdminFormCard from '@/components/admin/AdminFormCard';

export default function GamePage() {
  const {
    data,
    updateGameQuestions,
    updateSectionConfig,
    saveChanges,
    isSaving,
    isDirty,
  } = useAdminData();

  const [activeTab, setActiveTab] = useState<'quiz' | 'marriage'>('quiz');
  const [editingId, setEditingId] = useState<string | null>(null);

  const questions = data.game_questions || [];

  const marriageSection = data.sections.find(s => s.type === 'marriageGame');
  const rawMarriage = (marriageSection?.config as MarriageGameConfig) || {};
  const marriageConfig: MarriageGameConfig = {
    heading: rawMarriage.heading || 'One last question...',
    question: rawMarriage.question || 'Will you marry me? 💍❤️',
    yes_button_text: rawMarriage.yes_button_text || 'YES ❤️',
    no_button_texts:
      rawMarriage.no_button_texts?.length
        ? rawMarriage.no_button_texts
        : ['NO 😈', 'Nice try 😏', 'Nope!', 'Are you sure? 😂', "You can't escape ❤️"],
    yes_celebration_title: rawMarriage.yes_celebration_title || 'She Said YES! ❤️',
    yes_celebration_subtitle: rawMarriage.yes_celebration_subtitle || "I knew you'd choose correctly 😌",
    yes_celebration_body: rawMarriage.yes_celebration_body || 'Forever starts here. 💍',
  };

  const addQuestion = () => {
    const qId = `q-${Date.now()}`;
    const q: GameQuestion = {
      id: qId,
      page_id: data.page.id || 'mock-page-1',
      question: 'New Question?',
      order_index: questions.length,
      type: 'quiz',
      answers: [
        {
          id: `a-${Date.now()}-1`,
          question_id: qId,
          text: 'Option A',
          is_correct: true,
          response_message: 'Correct! You know me so well 🥹',
          order_index: 0,
        },
        {
          id: `a-${Date.now()}-2`,
          question_id: qId,
          text: 'Option B',
          is_correct: false,
          response_message: 'Nice try! But not quite 😄',
          order_index: 1,
        },
      ],
    };
    updateGameQuestions([...questions, q]);
    setEditingId(q.id);
  };

  const updateQ = (id: string, key: string, value: string) => {
    const updated = questions.map(q => (q.id === id ? { ...q, [key]: value } : q));
    updateGameQuestions(updated);
  };

  const updateAnswer = (qId: string, aIdx: number, key: string, value: string | boolean) => {
    const updated = questions.map(q =>
      q.id === qId
        ? {
            ...q,
            answers: q.answers.map((a, i) => (i === aIdx ? { ...a, [key]: value } : a)),
          }
        : q
    );
    updateGameQuestions(updated);
  };

  const setCorrectAnswer = (qId: string, aIdx: number) => {
    const updated = questions.map(q =>
      q.id === qId
        ? {
            ...q,
            answers: q.answers.map((a, i) => ({ ...a, is_correct: i === aIdx })),
          }
        : q
    );
    updateGameQuestions(updated);
  };

  const addAnswerOption = (qId: string) => {
    const updated = questions.map(q =>
      q.id === qId
        ? {
            ...q,
            answers: [
              ...q.answers,
              {
                id: `a-${Date.now()}`,
                question_id: qId,
                text: `Option ${q.answers.length + 1}`,
                is_correct: false,
                response_message: 'Not quite!',
                order_index: q.answers.length,
              },
            ],
          }
        : q
    );
    updateGameQuestions(updated);
  };

  const removeAnswerOption = (qId: string, aIdx: number) => {
    const updated = questions.map(q => {
      if (q.id !== qId) return q;
      if (q.answers.length <= 2) {
        alert('Questions must have at least 2 options.');
        return q;
      }
      const newAnswers = q.answers.filter((_, i) => i !== aIdx);
      if (!newAnswers.some(a => a.is_correct) && newAnswers.length > 0) {
        newAnswers[0].is_correct = true;
      }
      return { ...q, answers: newAnswers };
    });
    updateGameQuestions(updated);
  };

  const deleteQuestion = (id: string) => {
    if (confirm('Delete this quiz question?')) {
      const updated = questions.filter(q => q.id !== id);
      updateGameQuestions(updated);
    }
  };

  const updateMarriageField = (key: string, value: any) => {
    if (marriageSection) {
      updateSectionConfig(marriageSection.id, {
        ...marriageConfig,
        [key]: value,
      });
    }
  };

  const handleSave = async () => {
    await saveChanges();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold" style={{ color: '#f9d8e1' }}>Love Quiz & Marriage Proposal</h2>
          <p className="text-sm" style={{ color: '#c7889a' }}>
            Customize questions and the playful runaway "NO" proposal game
          </p>
        </div>
        <motion.button
          onClick={handleSave}
          disabled={isSaving}
          whileHover={{ scale: 1.02 }}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all disabled:opacity-50"
          style={{ background: isDirty ? '#D94F73' : '#10b981', color: 'white' }}
        >
          {isSaving ? 'Saving...' : isDirty ? 'Save Changes' : '✓ Saved'}
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 rounded-xl" style={{ background: '#1a0a0f', border: '1px solid #2d1520' }}>
        {(['quiz', 'marriage'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize"
            style={{
              background: activeTab === tab ? '#D94F73' : 'transparent',
              color: activeTab === tab ? 'white' : '#c7889a',
            }}
          >
            {tab === 'quiz' ? '🎮 Relationship Quiz' : '💍 Marriage Proposal Game'}
          </button>
        ))}
      </div>

      {activeTab === 'quiz' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: '#c7889a' }}>
              {questions.length} quiz questions
            </p>
            <button
              onClick={addQuestion}
              className="px-4 py-2 rounded-xl text-xs font-semibold"
              style={{ background: '#2d1520', color: '#f9d8e1', border: '1px solid #3d2030' }}
            >
              + Add Question
            </button>
          </div>

          <div className="space-y-3">
            {questions.map((q, qi) => (
              <div
                key={q.id}
                className="rounded-2xl overflow-hidden transition-all"
                style={{
                  background: '#1a0a0f',
                  border: `1px solid ${editingId === q.id ? '#D94F73' : '#2d1520'}`,
                }}
              >
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer"
                  onClick={() => setEditingId(editingId === q.id ? null : q.id)}
                >
                  <span className="text-xs font-bold w-7 text-pink-400">Q{qi + 1}</span>
                  <p className="flex-1 text-sm font-semibold truncate" style={{ color: '#f9d8e1' }}>
                    {q.question}
                  </p>
                  <span className="text-xs" style={{ color: '#5d3040' }}>
                    {editingId === q.id ? '▲ Close' : '▼ Edit'}
                  </span>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      deleteQuestion(q.id);
                    }}
                    className="text-sm p-1 ml-2 text-red-400 hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>

                {editingId === q.id && (
                  <div
                    className="px-5 pb-5 pt-2 space-y-4"
                    style={{ borderTop: '1px solid #2d1520', background: '#14060b' }}
                  >
                    <AdminTextarea
                      label="Question Text"
                      value={q.question}
                      onChange={v => updateQ(q.id, 'question', v)}
                      rows={2}
                    />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase tracking-wider text-pink-400">
                          Answer Options & Reactions
                        </p>
                        <button
                          type="button"
                          onClick={() => addAnswerOption(q.id)}
                          className="text-xs text-pink-300 underline"
                        >
                          + Add Option
                        </button>
                      </div>

                      {q.answers.map((ans, ai) => (
                        <div
                          key={ans.id}
                          className="rounded-xl p-3.5 space-y-2.5 transition-all"
                          style={{
                            background: '#120508',
                            border: `1px solid ${ans.is_correct ? '#22c55e66' : '#3d2030'}`,
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`correct-${q.id}`}
                                checked={Boolean(ans.is_correct)}
                                onChange={() => setCorrectAnswer(q.id, ai)}
                                className="w-4 h-4 accent-green-500"
                              />
                              <span
                                className="text-xs font-semibold"
                                style={{ color: ans.is_correct ? '#22c55e' : '#c7889a' }}
                              >
                                {ans.is_correct ? '✓ Correct Answer' : 'Option ' + (ai + 1)}
                              </span>
                            </label>
                            {q.answers.length > 2 && (
                              <button
                                type="button"
                                onClick={() => removeAnswerOption(q.id, ai)}
                                className="text-xs text-red-400"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <AdminInput
                            label="Choice Label"
                            value={ans.text}
                            onChange={v => updateAnswer(q.id, ai, 'text', v)}
                          />
                          <AdminInput
                            label="Feedback Note When Chosen"
                            value={ans.response_message}
                            onChange={v => updateAnswer(q.id, ai, 'response_message', v)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'marriage' && (
        <div className="space-y-4">
          <AdminFormCard title="Proposal Settings" icon="💍">
            <AdminInput
              label="Section Heading"
              value={marriageConfig.heading}
              onChange={v => updateMarriageField('heading', v)}
            />
            <AdminInput
              label="Question Text"
              value={marriageConfig.question}
              onChange={v => updateMarriageField('question', v)}
            />
            <AdminInput
              label="YES Button Text"
              value={marriageConfig.yes_button_text}
              onChange={v => updateMarriageField('yes_button_text', v)}
            />
          </AdminFormCard>

          <AdminFormCard title="NO Button Teasing Messages (Runaway Sequence)" icon="😈">
            <p className="text-xs mb-2" style={{ color: '#c7889a' }}>
              Whenever she tries to hover or click the "NO" button, it runs away and escalates to these playful lines:
            </p>
            {marriageConfig.no_button_texts.map((text, i) => (
              <AdminInput
                key={i}
                label={`Escape Message ${i + 1}`}
                value={text}
                onChange={v => {
                  const updated = marriageConfig.no_button_texts.map((t, idx) => (idx === i ? v : t));
                  updateMarriageField('no_button_texts', updated);
                }}
              />
            ))}
          </AdminFormCard>

          <AdminFormCard title="YES Celebration Overlay" icon="🎉">
            <AdminInput
              label="Celebration Title"
              value={marriageConfig.yes_celebration_title}
              onChange={v => updateMarriageField('yes_celebration_title', v)}
            />
            <AdminInput
              label="Celebration Subtitle"
              value={marriageConfig.yes_celebration_subtitle}
              onChange={v => updateMarriageField('yes_celebration_subtitle', v)}
            />
            <AdminInput
              label="Celebration Body Note"
              value={marriageConfig.yes_celebration_body}
              onChange={v => updateMarriageField('yes_celebration_body', v)}
            />
          </AdminFormCard>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <motion.button
          onClick={handleSave}
          disabled={isSaving}
          whileHover={{ scale: 1.02 }}
          className="px-7 py-3 rounded-xl font-semibold text-sm shadow-lg transition-all disabled:opacity-50"
          style={{ background: isDirty ? '#D94F73' : '#10b981', color: 'white' }}
        >
          {isSaving ? 'Saving...' : isDirty ? 'Save Quiz & Game' : '✓ All Saved!'}
        </motion.button>
      </div>
    </div>
  );
}
