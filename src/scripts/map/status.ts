export const showStatus = () => {
  const statusPanel = document.getElementById('status-panel');
  const statusMessage = document.getElementById('status-message');

  window.addEventListener('showStatus', (e) => {
    const { message, type } = e.detail;
    statusPanel.className = `status-panel ${type}`;
    statusMessage.textContent = message;
    statusPanel.style.display = 'block';

    setTimeout(() => {
      statusPanel.style.display = 'none';
    }, 5000);
  });
};