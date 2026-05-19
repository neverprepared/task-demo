document.getElementById('checkStatus').addEventListener('click', async () => {
  const output = document.getElementById('statusOutput');
  output.textContent = 'Fetching...';
  try {
    const res = await fetch('/api/status');
    const data = await res.json();
    output.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    output.textContent = 'Error: ' + err.message;
  }
});
