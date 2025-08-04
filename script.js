let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let monthlyGoal = localStorage.getItem('goal') || 0;

document.getElementById('goal-total').textContent = monthlyGoal;
document.getElementById('goal-input').value = monthlyGoal;

function addTransaction(e) {
  e.preventDefault();
  const text = document.getElementById('text').value;
  const amount = +document.getElementById('amount').value;
  if (!text || !amount) return;

  const transaction = {
    id: Date.now(),
    text,
    amount
  };
  transactions.push(transaction);
  updateUI();
  saveToLocalStorage();
  document.getElementById('transaction-form').reset();
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateUI();
  saveToLocalStorage();
}

function updateUI() {
  const list = document.getElementById('transactions');
  list.innerHTML = '';

  let income = 0, expense = 0;

  transactions.forEach(t => {
    const li = document.createElement('li');
    li.classList.add(t.amount > 0 ? 'income' : 'expense');
    li.innerHTML = `
      ${t.text} <span>${t.amount > 0 ? '+' : '-'}₹${Math.abs(t.amount)}</span>
      <button class="delete-btn" onclick="deleteTransaction(${t.id})">x</button>
    `;
    list.appendChild(li);

    if (t.amount > 0) income += t.amount;
    else expense += Math.abs(t.amount);
  });

  const balance = income - expense;
  document.getElementById('income').textContent = income;
  document.getElementById('expense').textContent = expense;
  document.getElementById('income-left').textContent = balance;
  document.getElementById('goal-spent').textContent = expense;
  document.getElementById('goal-total').textContent = monthlyGoal;

  let percentSpent = monthlyGoal > 0 ? Math.min((expense / monthlyGoal) * 100, 100) : 0;
  document.getElementById('goal-progress').style.width = percentSpent + '%';
}

function saveToLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

document.getElementById('transaction-form').addEventListener('submit', addTransaction);

document.getElementById('goal-input').addEventListener('change', function () {
  monthlyGoal = this.value;
  localStorage.setItem('goal', monthlyGoal);
  updateUI();
});

updateUI();
