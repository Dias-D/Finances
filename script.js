import fakeJS from "./app.js";

/** TRANSACTION LIST ======================= */
const transactionList = [
    {
        //lista de transações
        description: "Luz",
        amount: -50000,
        date: "10 / 02 / 2022",
    },
    {
        //lista de transações
        description: "Água",
        amount: -24000,
        date: "15 / 02 / 2022",
    },
    {
        //lista de transações
        description: "Salário",
        amount: 750000,
        date: "30 / 02 / 2022",
    },
];

/** OPEN / CLOSE MODAL FUNCTIONS ============ */
const modal = {
    action() {
        document.querySelector(".modal-overlay").classList.toggle("active");
    },
};

const balance = {
    all: transactionList,
    add(transaction) {
        balance.all.push(transaction);
        App.reload();
    },
    remove(index) {
        balance.all.splice(index, 1);
        App.reload();
    },
    incomes() {
        let income = 0;
        balance.all.forEach((item) => {
            if (item.amount > 0) {
                income += item.amount;
            }
        });
        return income;
    },
    expenses() {
        let expense = 0;
        balance.all.forEach((item) => {
            if (item.amount < 0) {
                expense += item.amount;
            }
        });
        return expense;
    },
    total() {
        return balance.incomes() + balance.expenses();
    },
};

const dom = {
    container: document.querySelector("#data-table tbody"),
    addTransaction(transaction, index) {
        const tr = document.createElement("tr");
        tr.innerHTML = this.innerHTMLTransaction(transaction);

        this.container.appendChild(tr);
    },
    innerHTMLTransaction(transaction) {
        const cssClass = transaction.amount > 0 ? "income" : "expense";
        const amount = utils.formatCurrency(transaction.amount);

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${cssClass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img
                    src="./assets/minus.svg"
                    alt="Remover Transação"
                />
            </td>
        `;

        return html;
    },
    updateBalance() {
        document.getElementById("incomeDisplay").innerHTML =
            utils.formatCurrency(balance.incomes());
        document.getElementById("expenseDisplay").innerHTML =
            utils.formatCurrency(balance.expenses());
        document.getElementById("totalDisplay").innerHTML =
            utils.formatCurrency(balance.total());
    },
    clearTransactions() {
        this.container.innerHTML = "";
    },
};

const form = {
    description: document.querySelector("input#description"),
    amount: document.querySelector("input#amount"),
    date: document.querySelector("input#date"),

    getValues() {
        return {
            description: form.description.value,
            amount: form.amount.value,
            date: form.date.value,
        };
    },
    validateFields() {
        const { description, amount, date } = form.getValues();

        if (
            description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === ""
        ) {
            throw new Error("Por favor, preencha todos os campos");
        }
    },
    formatData() {},
    submit(event) {
        event.preventDefault();

        try {
            form.validateFields();
            form.formatData();
        } catch (error) {
            alert(error.message);
        }
    },
};

const utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "";
        value = String(value).replace(/\D/g, "");
        value = Number(value) / 100;
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });

        return `${signal}${value}`;
    },
};

const App = {
    init() {
        document
            .querySelectorAll("[key-modal-action]")
            .forEach((item) => item.addEventListener("click", modal.action));

        balance.all.forEach((item) => dom.addTransaction(item));
        dom.updateBalance();
    },
    reload() {
        dom.clearTransactions();
        App.init();
    },
};

App.init();
fakeJS();
