const storageKey = "monthly-expense-dashboard-data-v2";

const defaultMonthlyData = {};

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
  month: getCurrentMonthKey(),
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
const budgetInput = document.querySelector("#budget-input");
const budgetCard = document.querySelector("#budget-card");

populateCategories();
normalizeAllMonths();
ensureMonth(state.month);
monthSelect.value = state.month;
state.selectedIndex = Math.max(getMonthData().days.length - 1, 0);
updateFormDateLimits();

monthSelect.addEventListener("change", (event) => {
  state.month = event.target.value;
  ensureMonth(state.month);
  state.selectedIndex = Math.max(getMonthData().days.length - 1, 0);
  updateFormDateLimits();
  renderDashboard();
});

typeSelect.addEventListener("change", () => {
  updateCategoryState();
});

budgetInput.addEventListener("input", () => {
  const value = Number(budgetInput.value);
  getMonthData().budget = Number.isFinite(value) && value > 0 ? value : 0;
  saveData();
  renderDashboard();
});

budgetCard.addEventListener("click", () => {
  budgetInput.focus();
});

budgetCard.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    budgetInput.focus();
  }
});

transactionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTransaction();
});

downloadButton.addEventListener("click", () => {
  const blob = createMonthlyPdf(getMonthData());
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `resumo-financeiro-${state.month}.pdf`;
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

function getCurrentMonthKey() {
  return new Date().toISOString().slice(0, 7);
}

function createMonthData(monthKey) {
  return {
    label: formatMonthLabel(monthKey),
    budget: 0,
    previousExpense: 0,
    days: [],
    incomeTransactions: []
  };
}

function ensureMonth(monthKey) {
  if (!monthlyData[monthKey]) {
    monthlyData[monthKey] = createMonthData(monthKey);
    saveData();
  }
}

function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" })
    .format(new Date(year, month - 1, 1))
    .replace(/^./, (letter) => letter.toUpperCase());
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
  document.querySelector("#balance-trend").textContent = `${freeBalance >= 0 ? "\u25b2" : "\u25bc"} ${Math.abs((freeBalance / Math.max(incomeTotal, 1)) * 100).toFixed(1)}% da receita`;
  document.querySelector("#income-trend").textContent = `${data.incomeTransactions.length} entradas no mes`;
  document.querySelector("#expense-trend").textContent = `${expenseChange <= 0 ? "\u25bc" : "\u25b2"} ${Math.abs(expenseChange).toFixed(1)}% vs mes anterior`;
  budgetInput.value = data.budget > 0 ? data.budget : "";
  document.querySelector("#budget-trend").textContent = data.budget > 0
    ? (budgetLeft >= 0 ? `${currency.format(budgetLeft)} disponíveis` : `${currency.format(Math.abs(budgetLeft))} acima da meta`)
    : "Informe sua meta mensal";

  renderChart(data);
  renderTransactions(data);
  renderCategories(data);
}

function renderChart(data) {
  const maxValue = Math.max(...data.days.map((day) => getDayTotal(day)), 0);
  const roundedMax = Math.max(Math.ceil(maxValue / 100) * 100, 100);
  const selectedDay = data.days[state.selectedIndex];

  document.querySelector("#axis-max").textContent = currency.format(roundedMax);
  document.querySelector("#axis-mid").textContent = currency.format(roundedMax / 2);
  document.querySelector("#selected-day span").textContent = selectedDay ? selectedDay.date : "Sem lançamentos";
  document.querySelector("#selected-day strong").textContent = currency.format(selectedDay ? getDayTotal(selectedDay) : 0);

  chart.replaceChildren();
  chart.style.gridTemplateColumns = `repeat(${Math.max(data.days.length, 1)}, minmax(38px, 1fr))`;
  if (data.days.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Adicione seu primeiro gasto para ver o gráfico por data.";
    chart.append(empty);
    return;
  }
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
  const transactions = getAllTransactions(data);

  document.querySelector("#transaction-count").textContent = transactions.length;
  list.replaceChildren();

  if (transactions.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Nenhuma transação cadastrada neste mês.";
    list.append(empty);
    return;
  }

  transactions.forEach((transaction) => {
    list.append(createTransactionItem(transaction));
  });
}

function getAllTransactions(data) {
  const expenses = data.days.flatMap((day) =>
    day.transactions.map((transaction) => ({ ...transaction, date: day.date, kind: "expense" }))
  );
  const incomes = data.incomeTransactions.map((transaction) => ({ ...transaction, kind: "income" }));

  return [...expenses, ...incomes].sort((first, second) => {
    const firstDate = first.date.split("/").reverse().join("");
    const secondDate = second.date.split("/").reverse().join("");
    return secondDate.localeCompare(firstDate);
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

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function createMonthlyPdf(data) {
  const expenses = getExpenseTotal(data);
  const income = getIncomeTotal(data);
  const balance = income - expenses;
  const categories = Object.entries(getCategoryTotals(data)).sort((a, b) => b[1] - a[1]);
  const daily = data.days.filter((day) => getDayTotal(day) > 0);
  const transactions = getAllTransactions(data);
  const firstPageRows = transactions.slice(0, 11);
  const overflowRows = transactions.slice(11);
  const pages = [createPdfOverviewPage(data, income, expenses, balance, categories, daily, firstPageRows, transactions.length)];

  for (let start = 0; start < overflowRows.length; start += 27) {
    pages.push(createPdfTransactionPage(data, overflowRows.slice(start, start + 27), start + 12));
  }

  return buildPdf(pages);
}

function createPdfOverviewPage(data, income, expenses, balance, categories, daily, transactions, transactionCount) {
  const commands = [];
  const maxDaily = Math.max(...daily.map((day) => getDayTotal(day)), 1);
  const maxCategory = Math.max(...categories.map(([, value]) => value), 1);

  pdfRect(commands, 0, 0, 595, 842, "0.94 0.96 0.98");
  pdfRect(commands, 0, 702, 595, 140, "0.06 0.13 0.22");
  pdfText(commands, 46, 803, 10, "F2", "RESUMO FINANCEIRO", "0.48 0.93 0.77");
  pdfText(commands, 46, 768, 27, "F2", data.label, "1 1 1");
  pdfText(commands, 46, 746, 10, "F1", `Gerado em ${formatPdfDate(new Date())}`, "0.72 0.8 0.88");

  const cards = [
    ["RECEITAS", currency.format(income), "0.05 0.62 0.42"],
    ["GASTOS", currency.format(expenses), "0.85 0.25 0.33"],
    ["SALDO", currency.format(balance), balance >= 0 ? "0.08 0.53 0.86" : "0.85 0.25 0.33"]
  ];
  cards.forEach(([label, value, color], index) => {
    const x = 46 + index * 168;
    pdfRect(commands, x, 623, 151, 61, "1 1 1");
    pdfText(commands, x + 12, 664, 8, "F2", label, "0.39 0.48 0.58");
    pdfText(commands, x + 12, 640, 18, "F2", value, color);
  });

  pdfText(commands, 46, 583, 13, "F2", "Gastos por data", "0.08 0.13 0.2");
  pdfLine(commands, 46, 418, 370, 418, "0.79 0.84 0.9", 0.7);
  const chartDays = daily.slice(-14);
  chartDays.forEach((day, index) => {
    const width = Math.min(18, 288 / Math.max(chartDays.length, 1));
    const x = 50 + index * (288 / Math.max(chartDays.length, 1));
    const height = Math.max(4, (getDayTotal(day) / maxDaily) * 128);
    pdfRect(commands, x, 418, width, height, "0.85 0.25 0.33");
    pdfText(commands, x - 1, 404, 6, "F1", day.date, "0.39 0.48 0.58");
  });
  if (!chartDays.length) {
    pdfText(commands, 70, 492, 10, "F1", "Nenhum gasto registrado neste mes.", "0.39 0.48 0.58");
  }

  pdfText(commands, 398, 583, 13, "F2", "Categorias", "0.08 0.13 0.2");
  const categoryRows = categories.slice(0, 5);
  categoryRows.forEach(([key, value], index) => {
    const y = 547 - index * 29;
    const label = categoryMeta[key]?.label || key;
    pdfText(commands, 398, y, 8, "F2", truncatePdfText(label, 17), "0.08 0.13 0.2");
    pdfText(commands, 542, y, 8, "F2", currency.format(value), "0.08 0.13 0.2", "right");
    pdfRect(commands, 398, y - 12, 144, 6, "0.86 0.9 0.94");
    pdfRect(commands, 398, y - 12, 144 * (value / maxCategory), 6, "0.08 0.53 0.86");
  });
  if (!categoryRows.length) {
    pdfText(commands, 398, 535, 9, "F1", "Sem categorias ainda.", "0.39 0.48 0.58");
  }

  pdfText(commands, 46, 363, 13, "F2", `Lancamentos (${transactionCount})`, "0.08 0.13 0.2");
  pdfTableHeader(commands, 338);
  pdfTransactionRows(commands, transactions, 318);
  pdfText(commands, 46, 32, 8, "F1", "Dashboard Financeiro - resumo mensal", "0.39 0.48 0.58");
  pdfText(commands, 548, 32, 8, "F1", "Pagina 1", "0.39 0.48 0.58", "right");
  return commands.join("\n");
}

function createPdfTransactionPage(data, transactions, startNumber) {
  const commands = [];
  pdfRect(commands, 0, 0, 595, 842, "0.94 0.96 0.98");
  pdfRect(commands, 0, 764, 595, 78, "0.06 0.13 0.22");
  pdfText(commands, 46, 803, 10, "F2", "RESUMO FINANCEIRO", "0.48 0.93 0.77");
  pdfText(commands, 46, 781, 18, "F2", `${data.label} - Lancamentos`, "1 1 1");
  pdfTableHeader(commands, 736);
  pdfTransactionRows(commands, transactions, 716);
  pdfText(commands, 46, 32, 8, "F1", `Continuacao a partir do lancamento ${startNumber}`, "0.39 0.48 0.58");
  return commands.join("\n");
}

function pdfTableHeader(commands, y) {
  pdfRect(commands, 46, y - 6, 503, 18, "0.86 0.9 0.94");
  pdfText(commands, 53, y, 7, "F2", "DESCRICAO", "0.39 0.48 0.58");
  pdfText(commands, 278, y, 7, "F2", "DATA", "0.39 0.48 0.58");
  pdfText(commands, 345, y, 7, "F2", "CATEGORIA", "0.39 0.48 0.58");
  pdfText(commands, 542, y, 7, "F2", "VALOR", "0.39 0.48 0.58", "right");
}

function pdfTransactionRows(commands, transactions, startY) {
  transactions.forEach((transaction, index) => {
    const y = startY - index * 19;
    const meta = categoryMeta[transaction.category]?.label || transaction.category;
    const color = transaction.amount > 0 ? "0.05 0.62 0.42" : "0.85 0.25 0.33";
    pdfLine(commands, 46, y - 9, 549, y - 9, "0.86 0.9 0.94", 0.5);
    pdfText(commands, 53, y, 8, "F1", truncatePdfText(transaction.name, 35), "0.08 0.13 0.2");
    pdfText(commands, 278, y, 8, "F1", transaction.date, "0.08 0.13 0.2");
    pdfText(commands, 345, y, 8, "F1", truncatePdfText(meta, 20), "0.08 0.13 0.2");
    pdfText(commands, 542, y, 8, "F2", `${transaction.amount > 0 ? "+" : "-"} ${currency.format(Math.abs(transaction.amount))}`, color, "right");
  });
}

function pdfRect(commands, x, y, width, height, color) {
  commands.push(`${color} rg ${x} ${y} ${width} ${height} re f`);
}

function pdfLine(commands, x1, y1, x2, y2, color, width) {
  commands.push(`${color} RG ${width} w ${x1} ${y1} m ${x2} ${y2} l S`);
}

function pdfText(commands, x, y, size, font, value, color, align = "left") {
  const text = sanitizePdfText(value);
  const estimatedWidth = text.length * size * 0.52;
  const positionX = align === "right" ? x - estimatedWidth : x;
  commands.push(`BT /${font} ${size} Tf ${color} rg 1 0 0 1 ${positionX.toFixed(2)} ${y} Tm (${text}) Tj ET`);
}

function sanitizePdfText(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\\()]/g, "\\$&")
    .replace(/[^\x20-\x7E]/g, "");
}

function truncatePdfText(value, limit) {
  const text = sanitizePdfText(value);
  return text.length > limit ? `${text.slice(0, limit - 3)}...` : text;
}

function formatPdfDate(date) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" })
    .format(date)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function buildPdf(pageContents) {
  const objects = [];
  const addObject = (content) => {
    objects.push(content);
    return objects.length;
  };
  const catalogId = addObject("");
  const pagesId = addObject("");
  const regularFontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const boldFontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  const pageIds = pageContents.map((content) => {
    const streamId = addObject(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
    return addObject(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${regularFontId} 0 R /F2 ${boldFontId} 0 R >> >> /Contents ${streamId} 0 R >>`);
  });
  objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
  objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new Blob([pdf], { type: "application/pdf" });
}

function createMonthlyReport(data) {
  const expenses = getExpenseTotal(data);
  const income = getIncomeTotal(data);
  const balance = income - expenses;
  const categoryTotals = getCategoryTotals(data);
  const categories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const maxCategory = Math.max(...categories.map(([, value]) => value), 1);
  const daily = data.days.filter((day) => getDayTotal(day) > 0);
  const maxDaily = Math.max(...daily.map((day) => getDayTotal(day)), 1);
  const transactions = getAllTransactions(data);
  const generatedAt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short" }).format(new Date());

  const bars = daily.length
    ? daily.map((day) => `<div class="bar"><i style="height:${Math.max(8, (getDayTotal(day) / maxDaily) * 100)}%"></i><span>${escapeHtml(day.date)}</span></div>`).join("")
    : '<p class="empty">Ainda não há gastos registrados neste mês.</p>';
  const categoryRows = categories.length
    ? categories.map(([key, value]) => `<div class="category"><div><span>${escapeHtml(categoryMeta[key]?.label || key)}</span><b>${currency.format(value)}</b></div><i><em style="width:${(value / maxCategory) * 100}%"></em></i></div>`).join("")
    : '<p class="empty">As categorias aparecerão aqui após o primeiro gasto.</p>';
  const transactionRows = transactions.length
    ? transactions.map((transaction) => `<tr><td>${escapeHtml(transaction.name)}</td><td>${escapeHtml(transaction.date)}</td><td>${escapeHtml(categoryMeta[transaction.category]?.label || transaction.category)}</td><td class="${transaction.amount > 0 ? "positive" : "negative"}">${transaction.amount > 0 ? "+" : "-"} ${currency.format(Math.abs(transaction.amount))}</td></tr>`).join("")
    : '<tr><td colspan="4" class="empty">Nenhuma transação cadastrada.</td></tr>';

  return `<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Resumo ${escapeHtml(data.label)}</title><style>
  *{box-sizing:border-box}body{margin:0;background:#eef3f8;color:#142033;font:15px Arial,sans-serif}.page{max-width:1000px;margin:32px auto;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 18px 55px #19355022}.hero{padding:42px 48px;background:#102137;color:#fff}.tag{color:#7decc4;text-transform:uppercase;font-size:11px;font-weight:700;letter-spacing:1.2px}.hero h1{margin:10px 0 6px;font-size:34px}.hero p{margin:0;color:#b9cce0}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:30px 48px}.card{padding:20px;border:1px solid #dce5ef;border-radius:12px}.card span{display:block;color:#657991;font-size:12px;text-transform:uppercase;font-weight:700}.card strong{display:block;margin-top:10px;font-size:26px}.green{color:#0a9e6c}.red{color:#dd4054}.content{padding:0 48px 44px}.layout{display:grid;grid-template-columns:1.2fr .8fr;gap:28px}.section{border-top:1px solid #e4ebf2;padding-top:22px}.section h2{margin:0 0 18px;font-size:17px}.chart{height:220px;display:flex;align-items:end;gap:9px;padding:10px 0 28px;border-bottom:1px solid #dce5ef;background:repeating-linear-gradient(to bottom,#f4f7fa 0 1px,transparent 1px 54px)}.bar{height:100%;min-width:30px;flex:1;display:flex;align-items:center;justify-content:end;flex-direction:column;gap:7px}.bar i{display:block;width:100%;border-radius:5px 5px 0 0;background:linear-gradient(#ff6d7d,#d84257)}.bar span{font-size:10px;color:#657991;white-space:nowrap}.category{margin:0 0 16px}.category div{display:flex;justify-content:space-between;margin-bottom:7px}.category i{display:block;height:9px;background:#e6edf4;border-radius:99px}.category em{display:block;height:100%;background:#1387db;border-radius:inherit}table{width:100%;border-collapse:collapse;margin-top:18px}th,td{padding:12px 8px;border-bottom:1px solid #e5ebf1;text-align:left}th{font-size:11px;color:#657991;text-transform:uppercase}.positive{color:#0a9e6c;font-weight:700}.negative{color:#dd4054;font-weight:700}.empty{color:#73859a;text-align:center;padding:20px}.footer{margin-top:26px;color:#73859a;font-size:12px}@media print{body{background:#fff}.page{box-shadow:none;margin:0;max-width:none}}@media(max-width:680px){.hero,.content{padding-left:24px;padding-right:24px}.cards,.layout{grid-template-columns:1fr}.cards{padding:24px}.hero h1{font-size:28px}}
  </style></head><body><main class="page"><header class="hero"><span class="tag">Resumo mensal personalizado</span><h1>${escapeHtml(data.label)}</h1><p>Gerado em ${escapeHtml(generatedAt)}</p></header><section class="cards"><article class="card"><span>Receitas</span><strong class="green">${currency.format(income)}</strong></article><article class="card"><span>Gastos</span><strong class="red">${currency.format(expenses)}</strong></article><article class="card"><span>Saldo do mês</span><strong class="${balance >= 0 ? "green" : "red"}">${currency.format(balance)}</strong></article></section><section class="content"><div class="layout"><section class="section"><h2>Gastos por data</h2><div class="chart">${bars}</div></section><section class="section"><h2>Gastos por categoria</h2>${categoryRows}</section></div><section class="section"><h2>Todos os lançamentos</h2><table><thead><tr><th>Descrição</th><th>Data</th><th>Categoria</th><th>Valor</th></tr></thead><tbody>${transactionRows}</tbody></table><p class="footer">Relatório criado pelo Dashboard Financeiro.</p></section></section></main></body></html>`;
}

window.addEventListener("pagehide", () => {
  localStorage.setItem(storageKey, JSON.stringify(monthlyData));
});

renderDashboard();
