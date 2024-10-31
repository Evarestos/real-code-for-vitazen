import React from 'react';
import useToast from '../hooks/useToast';
import { SuccessToast, ErrorToast, ActionToast, ProgressToast } from './Notifications/CustomToasts';

const SomeComponent = () => {
  const { showToast, showCustomToast } = useToast();

  const handleSuccess = () => {
    showToast('success', 'Η ενέργεια ολοκληρώθηκε με επιτυχία!');
  };

  const handleError = () => {
    showToast('error', 'Προέκυψε ένα σφάλμα.');
  };

  const handleCustomAction = () => {
    showCustomToast(
      ({ closeToast }) => (
        <ActionToast
          closeToast={closeToast}
          message="Θέλετε να συνεχίσετε;"
          action={() => {
            console.log('Custom action executed');
            closeToast();
          }}
        />
      ),
      { autoClose: false }
    );
  };

  const handleProgress = () => {
    let progress = 0;
    const intervalId = setInterval(() => {
      progress += 10;
      showCustomToast(
        ({ closeToast }) => (
          <ProgressToast
            closeToast={closeToast}
            message="Γίνεται επεξεργασία..."
            progress={progress}
          />
        ),
        { autoClose: false, updateId: 'progress-toast' }
      );

      if (progress >= 100) {
        clearInterval(intervalId);
        showToast('success', 'Η διαδικασία ολοκληρώθηκε!');
      }
    }, 1000);
  };

  return (
    <div>
      <button onClick={handleSuccess}>Επιτυχία</button>
      <button onClick={handleError}>Σφάλμα</button>
      <button onClick={handleCustomAction}>Προσαρμοσμένη Ενέργεια</button>
      <button onClick={handleProgress}>Πρόοδος</button>
    </div>
  );
};

export default SomeComponent;
