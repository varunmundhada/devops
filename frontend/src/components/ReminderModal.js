import React, { useState } from 'react';
import '../styles/ReminderModal.css';

const ReminderModal = ({ isOpen, onClose, scheme, onCreateReminder }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Initialize with scheme deadline if available, or default to today
  React.useEffect(() => {
    if (isOpen && scheme) {
      if (scheme.deadline) {
        setSelectedDate(formatDateForInput(scheme.deadline));
        // Extract time from deadline if available
        const deadlineDate = new Date(scheme.deadline);
        const hours = String(deadlineDate.getHours()).padStart(2, '0');
        const minutes = String(deadlineDate.getMinutes()).padStart(2, '0');
        setSelectedTime(`${hours}:${minutes}`);
      } else {
        // Default to today's date and 9:00 AM
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        setSelectedDate(`${year}-${month}-${day}`);
        setSelectedTime('09:00');
      }
      setError('');
      setSuccess('');
    }
  }, [isOpen, scheme]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!selectedDate) {
      setError('Please select a date for the reminder.');
      setLoading(false);
      return;
    }

    // Combine date and time
    const [hours, minutes] = selectedTime.split(':');
    const reminderDate = new Date(selectedDate);
    reminderDate.setHours(parseInt(hours, 10));
    reminderDate.setMinutes(parseInt(minutes, 10));
    reminderDate.setSeconds(0);
    reminderDate.setMilliseconds(0);
    
    // Check if date/time is in the past
    if (reminderDate < new Date()) {
      setError('Please select a future date and time for the reminder.');
      setLoading(false);
      return;
    }

    try {
      await onCreateReminder(reminderDate.toISOString());
      setSuccess('Reminder set successfully!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to create reminder. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="reminder-modal-overlay" onClick={onClose}>
      <div className="reminder-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="reminder-modal-close" onClick={onClose}>×</button>
        <h2>Set Reminder</h2>
        <p className="reminder-scheme-name">{scheme?.name}</p>
        
        <form onSubmit={handleSubmit}>
          <div className="reminder-form-group">
            <label htmlFor="reminder-date">Reminder Date</label>
            <input
              type="date"
              id="reminder-date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
            {scheme?.deadline && (
              <p className="reminder-hint">
                Scheme deadline: {new Date(scheme.deadline).toLocaleDateString()}
              </p>
            )}
            {!scheme?.deadline && (
              <p className="reminder-hint">Select your preferred reminder date</p>
            )}
          </div>

          <div className="reminder-form-group">
            <label htmlFor="reminder-time">Reminder Time</label>
            <input
              type="time"
              id="reminder-time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              required
            />
            <p className="reminder-hint">Select the time for your reminder</p>
          </div>

          {error && <div className="reminder-error">{error}</div>}
          {success && <div className="reminder-success">{success}</div>}

          <div className="reminder-modal-actions">
            <button type="button" onClick={onClose} className="reminder-btn-cancel">
              Cancel
            </button>
            <button type="submit" className="reminder-btn-submit" disabled={loading}>
              {loading ? 'Setting...' : 'Set Reminder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReminderModal;

