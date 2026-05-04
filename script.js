const storageKey = "monthly-expense-dashboard-data";

const defaultMonthlyData = {
  "2026-05": {
    label: "Maio 2026",
    budget: 4600,
    previousExpense: 3220,
    days: [
      { date: "01/05", transactions: [{ name: "Mercado Livre", category: "Compras", amount: -189 }, { name: "Padaria", category: "Alimentacao", amount: -26 }] },
      { date: "03/05", transactions: [{ name: "Spotify", category: "Assinaturas", amount: -21 }, { name: "Uber", category: "Transporte", amount: -63 }] },
      { date: "06/05", transactions: [{ name: "Supermercado", category: "Alimentacao", amount: -286 }, { name: "Farmacia", category: "Saude", amount: -54 }] },
      { date: "09/05", transactions: [{ name: "iFood", category: "Alimentacao", amount: -47 }, { name: "Cinema", category: "Lazer", amount: -81 }] },
      { date: "12/05", transactions: [{ name: "Aluguel", category: "Casa", amount: -420 }, { name: "Energia", category: "Casa", amount: -45 }] },
      { date: "15/05", transactions: [{ name: "Academia", category: "Saude", amount: -119 }, { name: "Pet shop", category: "Casa", amount: -173 }] },
      { date: "18/05", transactions: [{ name: "Cartao Nubank", category: "Compras", amount: -390 }, { name: "Livraria", category: "Lazer", amount: -120 }] },
      { date: "21/05", transactions: [{ name: "Combustivel", category: "Transporte", amount: -210 }, { name: "Estacionamento", category: "Transporte", amount: -66 }] },
      { date: "23/05", transactions: [{ name: "Plano de internet", category: "Casa", amount: -129 }, { name: "Roupas", category: "Compras", amount: -269 }] },
      { date: "25/05", transactions: [{ name: "Restaurante", category: "Alimentacao", amount: -182 }, { name: "Presente", category: "Lazer", amount: -148 }] },
      { date: "28/05", transactions: [{ name: "Curso online", category: "Educacao", amount: -249 }, { name: "Mercado", category: "Alimentacao", amount: -199 }] },
      { date: "31/05", transactions: [{ name: "Conta de agua", category: "Casa", amount: -97 }, { name: "Taxi", category: "Transporte", amount: -59 }, { name: "Farmacia", category: "Saude", amount: -200 }] }
    ],
    incomeTransactions: [{ name: "Salario", category: "Receita", amount: 6200, date: "01/05" }, { name: "Freelance", category: "Receita", amount: 2000, date: "14/05" }]
  },
  "2026-04": {
    label: "Abril 2026",
    budget: 4300,
    previousExpense: 3450,
    days: [
      { date: "02/04", transactions: [{ name: "Mercado", category: "Alimentacao", amount: -186 }] },
      { date: "05/04", transactions: [{ name: "Roupas", category: "Compras", amount: -244 }] },
      { date: "07/04", transactions: [{ name: "Streaming", category: "Assinaturas", amount: -72 }] },
      { date: "10/04", transactions: [{ name: "Aluguel", category: "Casa", amount: -410 }] },
      { date: "13/04", transactions: [{ name: "Restaurante", category: "Alimentacao", amount: -167 }] },
      { date: "16/04", transactions: [{ name: "Combustivel", category: "Transporte", amount: -312 }] },
      { date: "19/04", transactions: [{ name: "Farmacia", category: "Saude", amount: -225 }] },
      { date: "21/04", transactions: [{ name: "Cartao", category: "Compras", amount: -380 }] },
      { date: "24/04", transactions: [{ name: "iFood", category: "Alimentacao", amount: -155 }] },
      { date: "27/04", transactions: [{ name: "Conserto", category: "Casa", amount: -468 }] },
      { date: "29/04", transactions: [{ name: "Taxi", category: "Transporte", amount: -198 }] },
      { date: "30/04", transactions: [{ name: "Livraria", category: "Educacao", amount: -255 }] }
    ],
    incomeTransactions: [{ name: "Salario", category: "Receita", amount: 6200, date: "01/04" }, { name: "Venda", category: "Receita", amount: 1700, date: "20/04" }]
  },
  "2026-03": {
    label: "Marco 2026",
    budget: 4100,
    previousExpense: 3010,
    days: [
      { date: "01/03", transactions: [{ name: "Supermercado", category: "Alimentacao", amount: -150 }] },
      { date: "04/03", transactions: [{ name: "Farmacia", category: "Saude", amount: -190 }] },
      { date: "06/03", transactions: [{ name: "Presente", category: "Lazer", amount: -315 }] },
      { date: "09/03", transactions: [{ name: "Uber", category: "Transporte", amount: -98 }] },
      { date: "12/03", transactions: [{ name: "Aluguel", category: "Casa", amount: -400 }] },
      { date: "15/03", transactions: [{ name: "Mercado Livre", category: "Compras", amount: -265 }] },
      { date: "18/03", transactions: [{ name: "Spotify", category: "Assinaturas", amount: -21 }, { name: "Netflix", category: "Assinaturas", amount: -97 }] },
      { date: "20/03", transactions: [{ name: "Restaurante", category: "Alimentacao", amount: -348 }] },
      { date: "23/03", transactions: [{ name: "Combustivel", category: "Transporte", amount: -302 }] },
      { date: "26/03", transactions: [{ name: "Curso", category: "Educacao", amount: -175 }] },
      { date: "29/03", transactions: [{ name: "Cartao", category: "Compras", amount: -439 }] },
      { date: "31/03", transactions: [{ name: "Agua e luz", category: "Casa", amount: -210 }] }
    ],
    incomeTransactions: [{ name: "Salario", category: "Receita", amount: 6200, date: "01/03" }, { name: "Freelance", category: "Receita", amount: 1400, date: "22/03" }]
  }
};

const categoryMeta = {
  Alimentacao: { label: "Alimentacao", color: "#ff9b54", icon: "utensils" },
  Casa: { label: "Casa", color: "#55d6ff", icon: "home" },
  Compras: { label: "Compras", color: "#ff4f5f", icon: "cart" },
  Transporte: { label: "Transporte", color: "#ffd44d", icon: "car" },
  Saude: { label: "Saude", color: "#7be495", icon: "heart" },
  Lazer: { label: "Lazer", color: "#b38cff", icon: "ticket" },
  Assinaturas: { label: "Assinaturas", color: "#4b8cff", icon: "music" },
  Educacao: { label: "Educacao", color: "#05f08c", icon: "book" },
  Receita: { label: "Receita", color: "#05f08c", icon: "wallet" }
};

const icons = {
  cart: '<path d="M6 6h15l-2 8H8L6 3H3"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/>',
  utensils: '<path d="M4 3v8"/><path d="M8 3v8"/><path d="M4 7h4"/><path d="M6 11v10"/><path d="M16 3c2 2 3 4 3 7 0 2-1 4-3 5v6"/><path d="M16 3v12"/>',
  home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
  car: '<path d="M7 17h10"/><path d="M6 17l1-5h10l1 5"/><path d="M8 12l1-4h6l1 4"/><circle cx="8" cy="18" r="1.5"/><circle cx="16" cy="18" r="1.5"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/>',
  ticket: '<path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a3 3 0 0 0 0 6v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a3 3 0 0 0 0-6Z"/><path d="M13 5v14"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z"/>',
  wallet: '<path d="M20 7H5a2 2 0 0 1 0-4h12v4"/><path d="M3 5v14a2 2 0 0 0 2 2h15V7"/><path d="M16 14h.01"/>',
  trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v5"/><path d="M14 11v5"/>'
};

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0
});

let monthlyData = loadData();

const state = {
  month: "2026-05",
  selectedIndex: 0
};

const chart = document.querySelector("#bar-chart");
const template = document.querySelector("#bar-template");
const monthSelect = document.querySelector("#month-select");
const downloadButton = document.querySelector("#download-button");
const transactionForm = document.querySelector("#transaction-form");
const typeSelect = document.querySelector("#transaction-type");
const categorySelect = document.querySelector("#transaction-category");
const dateInput = document.querySelector("#transaction-date");
const statusLabel = document.querySelector("#save-status");

populateCategories();
normalizeAllMonths();
state.selectedIndex = getMonthData().days.length - 1;
updateFormDateLimits();

monthSelect.addEventListener("change", (event) => {
  state.month = event.target.value;
  state.selectedIndex = Math.max(getMonthData().days.length - 1, 0);
  updateFormDateLimits();
  renderDashboard();
});

typeSelect.addEventListener("change", () => {
  updateCategoryState();
});

transactionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTransaction();
});

downloadButton.addEventListener("click", () => {
  const data = getMonthData();
  const expenseTotal = getExpenseTotal(data);
  const incomeTotal = getIncomeTotal(data);
  const summary = [
    `Resumo financeiro - ${data.label}`,
    `Receita: ${currency.format(incomeTotal)}`,
    `Gastos: ${currency.format(expenseTotal)}`,
    `Saldo livre: ${currency.format(incomeTotal - expenseTotal)}`,
    `Meta restante: ${currency.format(data.budget - expenseTotal)}`
  ].join("\n");

  const blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `resumo-${state.month}.txt`;
  link.click();
  URL.revokeObjectURL(url);
});

function loadData() {
  const fallback = structuredClone(defaultMonthlyData);

  try {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function saveData() {
  localStorage.setItem(storageKey, JSON.stringify(monthlyData));
  statusLabel.textContent = "Alteracoes salvas";
  window.clearTimeout(saveData.statusTimer);
  saveData.statusTimer = window.setTimeout(() => {
    statusLabel.textContent = "Salvo localmente";
  }, 1800);
}

function normalizeAllMonths() {
  Object.entries(monthlyData).forEach(([monthKey, data]) => {
    data.days = data.days || [];
    data.incomeTransactions = data.incomeTransactions || [];

    data.days.forEach((day) => {
      day.transactions = day.transactions || [];
      day.transactions.forEach((transaction) => ensureTransactionId(transaction));
    });

    data.incomeTransactions.forEach((transaction) => ensureTransactionId(transaction));
    includeIncomeOnlyDates(monthKey, data);
    sortDays(data);
  });
}

function ensureTransactionId(transaction) {
  if (!transaction.id) {
    transaction.id = crypto.randomUUID();
  }
}

function includeIncomeOnlyDates(monthKey, data) {
  data.incomeTransactions.forEach((transaction) => {
    const dayLabel = transaction.date;
    if (!data.days.some((day) => day.date === dayLabel)) {
      data.days.push({ date: dayLabel, transactions: [] });
    }
  });

  if (data.days.length === 0) {
    data.days.push({ date: `01/${monthKey.slice(5)}`, transactions: [] });
  }
}

function sortDays(data) {
  data.days.sort((a, b) => Number(a.date.slice(0, 2)) - Number(b.date.slice(0, 2)));
}

function populateCategories() {
  const expenseCategories = Object.entries(categoryMeta).filter(([key]) => key !== "Receita");
  categorySelect.replaceChildren();

  expenseCategories.forEach(([key, meta]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = meta.label;
    categorySelect.append(option);
  });
}

function updateCategoryState() {
  const isIncome = typeSelect.value === "income";
  categorySelect.disabled = isIncome;
  categorySelect.value = isIncome ? "Alimentacao" : categorySelect.value;
}

function updateFormDateLimits() {
  const [year, month] = state.month.split("-");
  const lastDay = new Date(Number(year), Number(month), 0).getDate();
  const selectedDay = getMonthData().days[state.selectedIndex]?.date.slice(0, 2) || "01";

  dateInput.min = `${state.month}-01`;
  dateInput.max = `${state.month}-${String(lastDay).padStart(2, "0")}`;
  dateInput.value = `${state.month}-${selectedDay}`;
  updateCategoryState();
}

function getMonthData() {
  return monthlyData[state.month];
}

function getDayTotal(day) {
  return day.transactions.reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
}

function getExpenseTotal(data) {
  return data.days.reduce((sum, day) => sum + getDayTotal(day), 0);
}

function getIncomeTotal(data) {
  return data.incomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
}

function getCategoryTotals(data) {
  return data.days
    .flatMap((day) => day.transactions)
    .reduce((totals, transaction) => {
      const key = transaction.category;
      totals[key] = (totals[key] || 0) + Math.abs(transaction.amount);
      return totals;
    }, {});
}

function addTransaction() {
  const name = document.querySelector("#transaction-name").value.trim();
  const isoDate = dateInput.value;
  const amount = Number(document.querySelector("#transaction-amount").value);

  if (!name || !isoDate || !Number.isFinite(amount) || amount <= 0) {
    return;
  }

  const monthKey = isoDate.slice(0, 7);
  if (monthKey !== state.month) {
    return;
  }

  const data = getMonthData();
  const dayLabel = formatDateLabel(isoDate);
  const isIncome = typeSelect.value === "income";
  const transaction = {
    id: crypto.randomUUID(),
    name,
    category: isIncome ? "Receita" : categorySelect.value,
    amount: isIncome ? amount : -amount
  };

  if (isIncome) {
    data.incomeTransactions.push({ ...transaction, date: dayLabel });
    ensureDay(data, dayLabel);
  } else {
    ensureDay(data, dayLabel).transactions.push(transaction);
  }

  sortDays(data);
  state.selectedIndex = data.days.findIndex((day) => day.date === dayLabel);
  transactionForm.reset();
  dateInput.value = isoDate;
  updateCategoryState();
  saveData();
  renderDashboard();
}

function ensureDay(data, dayLabel) {
  let day = data.days.find((item) => item.date === dayLabel);

  if (!day) {
    day = { date: dayLabel, transactions: [] };
    data.days.push(day);
  }

  return day;
}

function removeTransaction(kind, id) {
  const data = getMonthData();

  if (kind === "income") {
    data.incomeTransactions = data.incomeTransactions.filter((transaction) => transaction.id !== id);
  } else {
    data.days.forEach((day) => {
      day.transactions = day.transactions.filter((transaction) => transaction.id !== id);
    });
  }

  data.days = data.days.filter((day) => {
    const hasExpenses = day.transactions.length > 0;
    const hasIncome = data.incomeTransactions.some((transaction) => transaction.date === day.date);
    return hasExpenses || hasIncome;
  });

  if (data.days.length === 0) {
    data.days.push({ date: `01/${state.month.slice(5)}`, transactions: [] });
  }

  sortDays(data);
  state.selectedIndex = Math.min(state.selectedIndex, data.days.length - 1);
  saveData();
  updateFormDateLimits();
  renderDashboard();
}

function formatDateLabel(isoDate) {
  const [, month, day] = isoDate.split("-");
  return `${day}/${month}`;
}

function renderDashboard() {
  const data = getMonthData();
  const expenseTotal = getExpenseTotal(data);
  const incomeTotal = getIncomeTotal(data);
  const freeBalance = incomeTotal - expenseTotal;
  const budgetLeft = data.budget - expenseTotal;
  const expenseChange = data.previousExpense > 0 ? ((expenseTotal - data.previousExpense) / data.previousExpense) * 100 : 0;

  document.querySelector("#current-month").textContent = data.label;
  document.querySelector("#chart-title").textContent = data.label;
  document.querySelector("#free-balance").textContent = currency.format(freeBalance);
  document.querySelector("#income-total").textContent = currency.format(incomeTotal);
  document.querySelector("#expense-total").textContent = currency.format(expenseTotal);
  document.querySelector("#budget-left").textContent = currency.format(Math.abs(budgetLeft));
  document.querySelector("#balance-trend").textContent = `${freeBalance >= 0 ? "\u25b2" : "\u25bc"} ${Math.abs((freeBalance / Math.max(incomeTotal, 1)) * 100).toFixed(1)}% da receita`;
  document.querySelector("#income-trend").textContent = `${data.incomeTransactions.length} entradas no mes`;
  document.querySelector("#expense-trend").textContent = `${expenseChange <= 0 ? "\u25bc" : "\u25b2"} ${Math.abs(expenseChange).toFixed(1)}% vs mes anterior`;
  document.querySelector("#budget-trend").textContent = budgetLeft >= 0 ? "Dentro da meta" : "Meta ultrapassada";

  renderChart(data);
  renderTransactions(data);
  renderCategories(data);
}

function renderChart(data) {
  const maxValue = Math.max(...data.days.map((day) => getDayTotal(day)), 0);
  const roundedMax = Math.max(Math.ceil(maxValue / 100) * 100, 100);
  const selectedDay = data.days[state.selectedIndex] || data.days[0];

  document.querySelector("#axis-max").textContent = currency.format(roundedMax);
  document.querySelector("#axis-mid").textContent = currency.format(roundedMax / 2);
  document.querySelector("#selected-day span").textContent = selectedDay.date;
  document.querySelector("#selected-day strong").textContent = currency.format(getDayTotal(selectedDay));

  chart.replaceChildren();
  chart.style.gridTemplateColumns = `repeat(${data.days.length}, minmax(38px, 1fr))`;
  data.days.forEach((day, index) => {
    const dayTotal = getDayTotal(day);
    const node = template.content.firstElementChild.cloneNode(true);
    const height = dayTotal === 0 ? 3 : Math.max((dayTotal / roundedMax) * 100, 4);
    node.classList.toggle("active", index === state.selectedIndex);
    node.setAttribute("aria-label", `${day.date}: ${currency.format(dayTotal)} em gastos`);
    node.querySelector(".bar-value").textContent = currency.format(dayTotal);
    node.querySelector(".bar-date").textContent = day.date;
    node.querySelector(".bar-fill").style.height = `${height}%`;
    node.addEventListener("click", () => {
      state.selectedIndex = index;
      updateFormDateLimits();
      renderChart(data);
      renderTransactions(data);
    });
    chart.append(node);
  });
}

function renderTransactions(data) {
  const list = document.querySelector("#transaction-list");
  const selectedDay = data.days[state.selectedIndex];
  const transactions = getTransactionsForDay(data, selectedDay.date);

  document.querySelector("#transaction-count").textContent = transactions.length;
  list.replaceChildren();

  if (transactions.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Nenhuma transacao nesta data.";
    list.append(empty);
    return;
  }

  transactions.forEach((transaction) => {
    list.append(createTransactionItem(transaction));
  });
}

function getTransactionsForDay(data, dayLabel) {
  const expenseDay = data.days.find((day) => day.date === dayLabel);
  const expenses = (expenseDay?.transactions || []).map((transaction) => ({
    ...transaction,
    date: dayLabel,
    kind: "expense"
  }));
  const incomes = data.incomeTransactions
    .filter((transaction) => transaction.date === dayLabel)
    .map((transaction) => ({ ...transaction, kind: "income" }));

  return [...expenses, ...incomes];
}

function createTransactionItem(transaction) {
  const meta = categoryMeta[transaction.category] || categoryMeta.Compras;
  const item = document.createElement("article");
  const icon = document.createElement("span");
  const info = document.createElement("span");
  const name = document.createElement("strong");
  const date = document.createElement("small");
  const value = document.createElement("strong");
  const removeButton = document.createElement("button");

  item.className = "transaction-item";
  icon.className = "transaction-icon";
  icon.style.setProperty("--icon-color", meta.color);
  icon.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[meta.icon]}</svg>`;

  name.className = "transaction-name";
  name.textContent = transaction.name;
  date.className = "transaction-date";
  date.textContent = `${transaction.date} - ${meta.label}`;
  info.append(name, date);

  value.className = `transaction-value ${transaction.amount > 0 ? "income" : ""}`;
  value.textContent = `${transaction.amount > 0 ? "+" : "-"} ${currency.format(Math.abs(transaction.amount))}`;

  removeButton.className = "remove-transaction";
  removeButton.type = "button";
  removeButton.title = "Remover transacao";
  removeButton.setAttribute("aria-label", `Remover ${transaction.name}`);
  removeButton.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icons.trash}</svg>`;
  removeButton.addEventListener("click", () => removeTransaction(transaction.kind, transaction.id));

  item.append(icon, info, value, removeButton);
  return item;
}

function renderCategories(data) {
  const grid = document.querySelector("#category-grid");
  const totals = getCategoryTotals(data);
  const entries = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  grid.replaceChildren();

  if (entries.length === 0) {
    document.querySelector("#top-category").textContent = "Sem gastos";
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Adicione uma despesa para ver a distribuicao por categoria.";
    grid.append(empty);
    return;
  }

  const max = Math.max(...entries.map((entry) => entry[1]));
  const [topKey] = entries[0];

  document.querySelector("#top-category").textContent = `Maior gasto: ${categoryMeta[topKey].label}`;

  entries.forEach(([key, value]) => {
    const meta = categoryMeta[key];
    const progress = Math.max((value / max) * 100, 8);
    const card = document.createElement("article");
    card.className = "category-card";
    card.style.setProperty("--category-color", meta.color);
    card.innerHTML = `
      <div class="category-title">
        <span>${meta.label}</span>
        <span class="category-dot" aria-hidden="true"></span>
      </div>
      <strong>${currency.format(value)}</strong>
      <div>
        <div class="progress-track" aria-hidden="true">
          <div class="progress-fill" style="--progress: ${progress}%"></div>
        </div>
        <p class="category-meta">${Math.round((value / Math.max(getExpenseTotal(data), 1)) * 100)}% dos gastos</p>
      </div>
    `;
    grid.append(card);
  });
}

renderDashboard();
