// ==============================
// GET HTML ELEMENTS
// ==============================

const addExpenseBtn =
    document.getElementById("addExpenseBtn");

const closeModal =
    document.getElementById("closeModal");

const expenseModal =
    document.getElementById("expenseModal");

const expenseForm =
    document.getElementById("expenseForm");

const expenseList =
    document.getElementById("expenseList");

const totalExpense =
    document.getElementById("totalExpense");

const expenseCount =
    document.getElementById("expenseCount");

const averageExpense =
    document.getElementById("averageExpense");

const highestExpense =
    document.getElementById("highestExpense");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const categoryAnalytics =
    document.getElementById("categoryAnalytics");

const expenseChart =
    document.getElementById("expenseChart");


// ==============================
// FORM ELEMENTS
// ==============================

const titleInput =
    document.getElementById("title");

const amountInput =
    document.getElementById("amount");

const categoryInput =
    document.getElementById("category");

const dateInput =
    document.getElementById("date");


// ==============================
// GET EXPENSES FROM LOCALSTORAGE
// ==============================

let expenses =
    JSON.parse(localStorage.getItem("expenses")) || [];


// ==============================
// VARIABLE FOR EDITING
// ==============================

let editId = null;


// ==============================
// CHART VARIABLE
// ==============================

let chartInstance = null;


// ==============================
// OPEN MODAL - ADD EXPENSE
// ==============================

addExpenseBtn.addEventListener("click", function () {

    editId = null;

    document.querySelector(".modal-header h2").textContent =
        "Add Expense";

    document.querySelector(".modal-header p").textContent =
        "NEW TRANSACTION";

    document.querySelector(".submit-btn").textContent =
        "Add Expense";

    expenseForm.reset();

    // Set today's date automatically
    dateInput.value =
        new Date().toISOString().split("T")[0];

    expenseModal.style.display = "flex";
});


// ==============================
// CLOSE MODAL
// ==============================

closeModal.addEventListener("click", function () {

    expenseModal.style.display = "none";

    editId = null;

    expenseForm.reset();
});


// ==============================
// CLOSE WHEN CLICKING OUTSIDE
// ==============================

expenseModal.addEventListener("click", function (event) {

    if (event.target === expenseModal) {

        expenseModal.style.display = "none";

        editId = null;

        expenseForm.reset();
    }
});


// ==============================
// ADD / UPDATE EXPENSE
// ==============================

expenseForm.addEventListener("submit", function (e) {

    e.preventDefault();


    // ==============================
    // GET FORM VALUES
    // ==============================

    const title =
        titleInput.value.trim();

    const amount =
        parseFloat(amountInput.value);

    const category =
        categoryInput.value;

    const date =
        dateInput.value;


    // ==============================
    // VALIDATION
    // ==============================

    if (title === "") {

        alert("Please enter an expense title.");

        titleInput.focus();

        return;
    }


    if (isNaN(amount) || amount <= 0) {

        alert("Please enter a valid amount greater than 0.");

        amountInput.focus();

        return;
    }


    if (category === "") {

        alert("Please select a category.");

        categoryInput.focus();

        return;
    }


    if (date === "") {

        alert("Please select a date.");

        dateInput.focus();

        return;
    }


    // ==============================
    // EDIT EXPENSE
    // ==============================

    if (editId !== null) {

        expenses =
            expenses.map(function (expense) {

                if (expense.id === editId) {

                    return {
                        ...expense,
                        title: title,
                        amount: amount,
                        category: category,
                        date: date
                    };
                }

                return expense;
            });

        editId = null;
    }


    // ==============================
    // ADD EXPENSE
    // ==============================

    else {

        const newExpense = {

            id: Date.now(),

            title: title,

            amount: amount,

            category: category,

            date: date
        };

        expenses.push(newExpense);
    }


    // ==============================
    // SAVE TO LOCALSTORAGE
    // ==============================

    saveExpenses();


    // ==============================
    // REFRESH UI
    // ==============================

    displayExpenses();

    updateSummary();


    // ==============================
    // CLOSE MODAL
    // ==============================

    expenseModal.style.display = "none";


    // ==============================
    // RESET FORM
    // ==============================

    expenseForm.reset();
});


// ==============================
// SAVE EXPENSES
// ==============================

function saveExpenses() {

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );
}


// ==============================
// FORMAT DATE
// ==============================

function formatDate(dateString) {

    const date =
        new Date(dateString);

    return date.toLocaleDateString("en-IN", {

        day: "2-digit",

        month: "short",

        year: "numeric"
    });
}


// ==============================
// DISPLAY EXPENSES
// ==============================

function displayExpenses(
    expensesToDisplay = expenses
) {

    expenseList.innerHTML = "";


    // ==============================
    // NO EXPENSES
    // ==============================

    if (expensesToDisplay.length === 0) {

        expenseList.innerHTML = `

            <div class="empty">

                <div class="empty-icon">
                    💰
                </div>

                <h3>
                    No expenses found
                </h3>

                <p>
                    Try adding an expense or
                    changing your filters.
                </p>

            </div>

        `;

        return;
    }


    // ==============================
    // DISPLAY EXPENSES
    // ==============================

    expensesToDisplay.forEach(function (expense) {

        const expenseItem =
            document.createElement("div");


        expenseItem.classList.add(
            "expense-item"
        );


        expenseItem.innerHTML = `

            <div class="expense-info">

                <h3>
                    ${escapeHTML(expense.title)}
                </h3>

                <p>
                    ${escapeHTML(expense.category)}
                    |
                    ${formatDate(expense.date)}
                </p>

            </div>


            <div>

                <span class="expense-amount">
                    ₹${Number(expense.amount).toFixed(2)}
                </span>


                <button
                    class="edit-btn"
                    onclick="editExpense(${expense.id})"
                >
                    Edit
                </button>


                <button
                    class="delete-btn"
                    onclick="deleteExpense(${expense.id})"
                >
                    Delete
                </button>

            </div>

        `;


        expenseList.appendChild(expenseItem);
    });
}


// ==============================
// ESCAPE HTML
// Prevent HTML injection
// ==============================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


// ==============================
// EDIT EXPENSE
// ==============================

function editExpense(id) {

    const expense =
        expenses.find(function (expense) {

            return expense.id === id;

        });


    if (!expense) {

        return;
    }


    editId = id;


    // Change modal title

    document.querySelector(".modal-header h2").textContent =
        "Edit Expense";


    document.querySelector(".modal-header p").textContent =
        "UPDATE TRANSACTION";


    // Change button text

    document.querySelector(".submit-btn").textContent =
        "Update Expense";


    // Fill form

    titleInput.value =
        expense.title;

    amountInput.value =
        expense.amount;

    categoryInput.value =
        expense.category;

    dateInput.value =
        expense.date;


    // Open modal

    expenseModal.style.display = "flex";
}


// ==============================
// FILTER EXPENSES
// ==============================

function filterExpenses() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();

    const selectedCategory =
        categoryFilter.value;


    const filteredExpenses =
        expenses.filter(function (expense) {

            const matchesSearch =

                expense.title
                    .toLowerCase()
                    .includes(searchText)

                ||

                expense.category
                    .toLowerCase()
                    .includes(searchText);


            const matchesCategory =

                selectedCategory === "All"

                ||

                expense.category ===
                selectedCategory;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    displayExpenses(filteredExpenses);
}


// ==============================
// SEARCH
// ==============================

searchInput.addEventListener(
    "input",
    filterExpenses
);


// ==============================
// CATEGORY FILTER
// ==============================

categoryFilter.addEventListener(
    "change",
    filterExpenses
);


// ==============================
// UPDATE SUMMARY
// ==============================

function updateSummary() {

    let total = 0;

    let highest = 0;


    // ==============================
    // CALCULATE TOTAL + HIGHEST
    // ==============================

    expenses.forEach(function (expense) {

        const amount =
            Number(expense.amount) || 0;

        total =
            total + amount;


        if (amount > highest) {

            highest =
                amount;
        }

    });


    // ==============================
    // CALCULATE AVERAGE
    // ==============================

    let average = 0;


    if (expenses.length > 0) {

        average =
            total / expenses.length;
    }


    // ==============================
    // DISPLAY SUMMARY
    // ==============================

    totalExpense.textContent =
        total.toFixed(2);

    expenseCount.textContent =
        expenses.length;

    averageExpense.textContent =
        average.toFixed(2);

    highestExpense.textContent =
        highest.toFixed(2);


    // ==============================
    // UPDATE CATEGORY ANALYTICS
    // ==============================

    updateCategoryAnalytics();


    // ==============================
    // UPDATE CHART
    // ==============================

    updateChart();
}


// ==============================
// CATEGORY-WISE ANALYTICS
// ==============================

function updateCategoryAnalytics() {

    const categories = [

        "Food",

        "Travel",

        "Shopping",

        "Education",

        "Other"

    ];


    categoryAnalytics.innerHTML = "";


    // ==============================
    // NO EXPENSES
    // ==============================

    if (expenses.length === 0) {

        categoryAnalytics.innerHTML = `

            <div class="analytics-empty">

                No spending data available yet.

            </div>

        `;

        return;
    }


    // ==============================
    // CATEGORY TOTALS
    // ==============================

    let categoryTotals = {};


    categories.forEach(function (category) {

        categoryTotals[category] = 0;

    });


    expenses.forEach(function (expense) {

        if (
            categoryTotals[expense.category]
            !== undefined
        ) {

            categoryTotals[expense.category] +=
                Number(expense.amount) || 0;

        }

    });


    // ==============================
    // TOTAL SPENDING
    // ==============================

    let total = 0;


    expenses.forEach(function (expense) {

        total =
            total +
            (Number(expense.amount) || 0);

    });


    // ==============================
    // CREATE ANALYTICS
    // ==============================

    categories.forEach(function (category) {

        const amount =
            categoryTotals[category];


        // Don't display categories
        // with zero spending

        if (amount === 0) {

            return;
        }


        const percentage =
            total > 0
                ? (amount / total) * 100
                : 0;


        const item =
            document.createElement("div");


        item.className =
            "analytics-item";


        item.innerHTML = `

            <div class="analytics-info">

                <span class="analytics-category">
                    ${category}
                </span>

                <span class="analytics-amount">
                    ₹${amount.toFixed(2)}
                </span>

            </div>


            <div class="progress-container">

                <div
                    class="progress-bar"
                    style="width: ${percentage}%"
                ></div>

            </div>

        `;


        categoryAnalytics.appendChild(item);

    });

}


// ==============================
// DELETE EXPENSE
// ==============================

function deleteExpense(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this expense?"
        );


    if (!confirmDelete) {

        return;
    }


    expenses =
        expenses.filter(function (expense) {

            return expense.id !== id;

        });


    // Save

    saveExpenses();


    // Refresh

    displayExpenses();

    updateSummary();


    // Re-apply current filters

    filterExpenses();
}


// ==============================
// CREATE / UPDATE CHART
// ==============================

function updateChart() {

    // ==============================
    // MAKE SURE CHART.JS IS LOADED
    // ==============================

    if (typeof Chart === "undefined") {

        console.error(
            "Chart.js is not loaded."
        );

        return;
    }


    // ==============================
    // MAKE SURE CANVAS EXISTS
    // ==============================

    if (!expenseChart) {

        console.error(
            "Canvas with id 'expenseChart' was not found."
        );

        return;
    }


    const categories = [

        "Food",

        "Travel",

        "Shopping",

        "Education",

        "Other"

    ];


    // ==============================
    // CATEGORY TOTALS
    // ==============================

    let categoryTotals = {

        Food: 0,

        Travel: 0,

        Shopping: 0,

        Education: 0,

        Other: 0

    };


    expenses.forEach(function (expense) {

        if (
            categoryTotals[expense.category]
            !== undefined
        ) {

            categoryTotals[expense.category] +=
                Number(expense.amount) || 0;

        }

    });


    // ==============================
    // DESTROY OLD CHART
    // ==============================

    if (chartInstance) {

        chartInstance.destroy();

        chartInstance = null;
    }


    // ==============================
    // NO EXPENSES
    // ==============================

    if (expenses.length === 0) {

        return;
    }


    // ==============================
    // CREATE NEW CHART
    // ==============================

    chartInstance =
        new Chart(

            expenseChart,

            {

                type: "doughnut",


                data: {

                    labels: categories,

                    datasets: [

                        {

                            data: [

                                categoryTotals.Food,

                                categoryTotals.Travel,

                                categoryTotals.Shopping,

                                categoryTotals.Education,

                                categoryTotals.Other

                            ],


                            backgroundColor: [

                                "#8b5cf6",

                                "#3b82f6",

                                "#ec4899",

                                "#22c55e",

                                "#f59e0b"

                            ],


                            borderWidth: 0

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,


                    plugins: {

                        legend: {

                            position: "bottom",

                            labels: {

                                color: "#d1d5db",

                                padding: 20,

                                font: {

                                    size: 13

                                }

                            }

                        }

                    }

                }

            }

        );
}


// ==============================
// INITIAL DISPLAY
// ==============================

displayExpenses();

updateSummary();