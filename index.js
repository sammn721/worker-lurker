const utils = require('util');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'yopassword',
        database: 'workers_db'
    }
)

const query = utils.promisify(db.query).bind(db);

const nextAction = async () => {
    const response = await inquirer.prompt([
        {
            type:"list",
            message: "What would you like to do?",
            name: "nextAction",
            choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"]
        }
    ]);
    switch (response.nextAction) {
        case "View All Employees":
            return viewAllEmployees();
        case "Add Employee":
            return addEmployee();
        case "Update Employee Role":
            return updateEmployeeRole();
        case "View All Roles":
            return viewAllRoles();
        case "Add Role":
            return addRole();
        case "View All Departments":
            return viewAllDepartments();
        case "Add Department":
            return addDepartment();
        default:
            console.log(`\nthx4lurkin'\n`);
            return process.exit(0);
    }
}

const viewAllEmployees = () => {
    inquirer
    .prompt([

    ])
    .then((response) => {

    })
}

const addEmployee = async () => {
    inquirer
    .prompt([

    ])
    .then((response) => {

    })
}

const updateEmployeeRole = async () => {
    inquirer
    .prompt([

    ])
    .then((response) => {

    })
}

const viewAllRoles = () => {
    inquirer
    .prompt([

    ])
    .then((response) => {

    })
}

const addRole = async () => {
    // Get all existing departments
    db.query( `SELECT`, response.department_name, function(err, response) {
        // `inquirer.prompt` for role info
        inquirer
        .prompt([

        ])
        .then((response) => {
            //  THEN INSERT INTO department () VALUES
            db.query(`INSERT INTO role (name) VALUES (?)`, response.roles, function (err, response) {

                nextAction();
                
            })
        })
    })
}

const viewAllDepartments = () => {
    inquirer
    .prompt([

    ])
    .then((response) => {

    })
}

const addDepartment = async () => {
    // `inquirer.prompt` for department info
    inquirer
    .prompt([

    ])
    .then((response) => {
        // THEN INSERT INTO department () VALUES
        db.query( `INSERT INTO department (department_name) VALUES (?)`, response.department_name, function(err, response) {

            nextAction();

        })
    })
}

nextAction();