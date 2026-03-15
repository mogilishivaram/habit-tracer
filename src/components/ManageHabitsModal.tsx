import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useHabits } from '../hooks/useHabits';

interface ManageHabitsModalProps {
  open: boolean;
  onClose: () => void;
}

const ManageHabitsModal: React.FC<ManageHabitsModalProps> = ({ open, onClose }) => {
  const { habits, addHabit, editHabit, deleteHabit } = useHabits();
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 50) {
      setError('Habit name must be 2-50 characters.');
      return;
    }
    try {
      await addHabit(trimmed);
      setName('');
      setError('');
    } catch {
      setError('Failed to add habit.');
    }
  };

  const handleSave = async (habitId: string) => {
    const trimmed = editingName.trim();
    if (trimmed.length < 2 || trimmed.length > 50) {
      setError('Habit name must be 2-50 characters.');
      return;
    }
    try {
      await editHabit(habitId, trimmed);
      setEditingId(null);
      setEditingName('');
      setError('');
    } catch {
      setError('Failed to update habit.');
    }
  };

  const handleDelete = async (habitId: string) => {
    if (!window.confirm('Delete this habit?')) return;
    try {
      await deleteHabit(habitId);
      setError('');
    } catch {
      setError('Failed to delete habit.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={`absolute inset-0 bg-slate-900/60 transition-opacity duration-200 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />
      <div
        className={`relative w-full max-w-xl mx-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl transform transition-all duration-200 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Manage habits</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              aria-label="Add habit"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter habit name"
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition"
            >
              Add
            </button>
          </form>

          {error && <p className="text-xs text-rose-500">{error}</p>}

          <div className="space-y-2 max-h-[320px] overflow-y-auto">
            {habits.map((habit) => (
              <div
                key={habit._id}
                className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 p-2 rounded-lg border border-slate-100 dark:border-slate-800"
              >
                {editingId === habit._id ? (
                  <input
                    aria-label="Edit habit"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
                  />
                ) : (
                  <span className="flex-1 text-sm text-slate-700 dark:text-slate-200">{habit.name}</span>
                )}

                <div className="flex gap-2">
                  {editingId === habit._id ? (
                    <>
                      <button
                        onClick={() => handleSave(habit._id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditingName('');
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(habit._id);
                          setEditingName(habit.name);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(habit._id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-500 text-white text-xs font-medium hover:bg-rose-600 transition"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageHabitsModal;
