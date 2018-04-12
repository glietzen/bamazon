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

let getCommand = () => {
    console.log('Enter a command number:\n1: Products For Sale\n2: View Low Inventory\n3: Add to Inventory\n4: Add New Product');
    prompt.get(['command'], (err,result) => {
        if (result.command == 1) {
            listProducts(1);
        } else if (result.command == 2) {
            viewLowInventory();
        } else if (result.command == 3) {
            addToInventory();
        } else if (result.command == 4) {
            addNewProduct();
        } else {
            console.log('Command not recognized');
            getCommand();
        }
    });
}

let listProducts = (a) => {
    if (a === 1) {
    console.log('Listing All Products');
    console.log('--------------------------')
    console.log("Here's our product selection:\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(`Product ID: ${res[i].id} | Product Name: ${res[i].product_name} | Price: $${res[i].price} | Quantity: ${res[i].quantity}`);
        }
        setTimeout(getCommand,1500);
    })} else if (a === 3) {
        console.log('Listing All Products');
        console.log('--------------------------')
        console.log("Here's our product selection:\n");
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                console.log(`Product ID: ${res[i].id} | Product Name: ${res[i].product_name} | Price: $${res[i].price} | Quantity: ${res[i].quantity}`);
            }
        });
        prompt.get(['itemNumber', 'newQuantity'], (err, b) => {
            updateInventory(b.itemNumber, b.newQuantity);
        })
    }
    
}

let viewLowInventory = () => {
    console.log('view low inventory');
    let query = connection.query(`SELECT * FROM products WHERE quantity < 6`, function (err, res) {
        if (err) throw err;
        if (res.length > 0) {
            for (var i = 0; i < res.length; i++) {
                console.log(`Product: ${res[i].product_name} | Quantity: ${res[i].quantity}`);
            }
        }
    })
    setTimeout(getCommand,1500);
}

let addToInventory = () => {
    console.log('What item would you like to edit?');
    listProducts(3);
}

let updateInventory = (a, b) => {
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                quantity: b
            },
            {
                id: a
            }
        ],
        console.log(`Quatity for ${a} is now updated to ${b}\n`)
    );
    setTimeout(getCommand, 1500);
}

let addNewProduct = () => {
    console.log('What would you like to add?');
    prompt.get(['pName', 'pDept', 'pPrice', 'pQuantity'], (err, res) => {
        if (err) throw err;
        else {
            let query = connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: res.pName,
                    department_name: res.pDept,
                    price: res.pPrice,
                    quantity: res.pQuantity
                },
                function (err, res) {
                    console.log('Product inserted!');
                    setTimeout(getCommand,1500);
                })
        }
    })
}


getCommand();