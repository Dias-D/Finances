const modal = {
    action() {
        document.querySelector(".modal-overlay").classList.toggle("active");
    },
};

const storage = {
    get() {
        return (
            JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
        );
    },
    set(transactions) {
        localStorage.setItem(
            "dev.finances:transactions",
            JSON.stringify(transactions)
        );
    },
};

const balance = {
    all: storage.get(),
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
        tr.innerHTML = dom.innerHTMLTransaction(transaction, index);
        tr.dataset.index = index;

        dom.container.appendChild(tr);
    },
    innerHTMLTransaction(transaction, index) {
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
                    onclick="balance.remove(${index})"
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
    formatValues() {
        let { description, amount, date } = form.getValues();
        amount = utils.formatAmount(amount);
        date = utils.formatDate(date);

        return {
            description,
            amount,
            date,
        };
    },
    clearFields() {
        form.description.value = "";
        form.amount.value = "";
        form.date.value = "";
    },
    submit(event) {
        event.preventDefault();

        try {
            form.validateFields();
            const transaction = form.formatValues();
            balance.add(transaction);
            form.clearFields();
            modal.action();
        } catch (error) {
            alert(error.message);
        }
    },
};

const utils = {
    formatAmount(value) {
        value = Number(value) * 100;

        return value;
    },
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
    formatDate(value) {
        const splitedDate = value.split("-");
        return `${splitedDate[2]}/${splitedDate[1]}/${splitedDate[0]}`;
    },
};

const App = {
    init() {
        balance.all.forEach((item, index) => dom.addTransaction(item, index));
        dom.updateBalance();
        storage.set(balance.all);
    },
    reload() {
        dom.clearTransactions();
        App.init();
    },
};

App.init();
