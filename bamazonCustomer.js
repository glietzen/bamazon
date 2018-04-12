const mysql = require("mysql");
const prompt = require('prompt');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "garrett",
    database: "bamazon"
});

prompt.start()

let startProgram = () => {
    listItems();
}

let listItems = () => {
    console.log("Here's our product selection:\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        for (var i = 0; i < res.length; i++) {
            console.log(`Product ID: ${res[i].id} | Product Name: ${res[i].product_name} | Price: $${res[i].price}`);
        }
    }, console.log('What would you like to buy?'))
    setTimeout(getInput, 1500);
}

let getInput = () => {
    prompt.get(['itemID', 'quantity'], (err, result) => {
        checkInventory(result.itemID, result.quantity)
    });
}

let checkInventory = (item, purchaseQuantity) => {
    let query = connection.query(`SELECT * FROM products WHERE id = '${item}'`, function (err, res) {
        console.log(res);
        if (err) throw err;
        else if (res[0].quantity >= purchaseQuantity) {
            console.log('Purchase successful!');
            executePurchase(item, res[0].price, res[0].quantity,purchaseQuantity);
        } else {
            console.log('Sorry! We do not have enough in stock to complete your order.')
            setTimeout(startProgram, 1500);
        }
    })
}

let executePurchase = (id, price, qtyStock, qtyOrdered) => {
    console.log('executed purchase.');
    console.log('Total Purchase Price: $' + qtyOrdered * price);
    updateInventory(id, price, qtyStock, qtyOrdered);
}

let updateInventory = (id, price, qtyStock, qtyOrdered) => {
    console.log('inventory updated.')
    let updatedQuantity = qtyStock - qtyOrdered;
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                quantity: updatedQuantity
            },
            {
                id: id
            }
        ],
        function (err, res) {
            console.log(res.affectedRows + " products updated!\n");
        }
    );
    setTimeout(startProgram, 1500);
}

startProgram();