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
);

const query = utils.promisify(db.query).bind(db);

const nextAction = async () => {
    const res = await inquirer.prompt([
        {
            type:"list",
            message: "What would you like to do?",
            name: "nextAction",
            choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"]
        }
    ]);
    switch (res.nextAction) {
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
};

const viewAllEmployees = () => {
    query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, role.department, role.salary, manager.employee_name AS manager FROM employee employee LEFT OUTER JOIN (SELECT role.id, role.title, department.name AS department, role.salary FROM role role JOIN department department ON role.department_id = department.id) role ON employee.role_id = role.id LEFT OUTER JOIN (SELECT id, CONCAT(first_name, " ", last_name) as employee_name FROM employee) manager ON employee.manager_id = manager.id`)
    .then((res) => {
        console.table(res);
        return nextAction();
    })
    .catch((err) => {
        console.error(err);
    })
};

const addEmployee = async () => {
    let roleString = [], roleTitles = [], managerString = [], managerNames = [];
    await query(`Select role.id, role.title FROM role role`)
    .then((res) => {
        roleString = JSON.parse(JSON.stringify(res));
        for (let i = 0; i < roleString.length; i++) {
            roleTitles.push(roleString[i].title);
        }
    })
    .catch((err) => {
        console.error(err);
    })
    await query(`SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS name FROM employee employee`)
    .then((res) => {
        managerString = JSON.parse(JSON.stringify(res));
        managerString.push({ id: null, name: 'None' });
        for (let i = 0; i < managerString.length; i++) {
            managerNames.push(managerString[i].name);
        };
    })
    .catch((err) => {
        console.error(err);
    })
    const addEmployeePrompts = await inquirer.prompt([
        {
            type: "input",
            message: "What is the employee's first name?",
            name: "employeeFirstName"
        }, {
            type: "input",
            message: "What is the employee's last name?",
            name: "employeeLastName"
        }, {
            type: "list",
            message: "What is the employee's role?",
            name: "employeeRole",
            choices: roleTitles
        }, {
            type: "list",
            message: "Who is the employee's manager?",
            name: "employeeManager",
            choices: managerNames
        }
    ]);

    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
    const employeeRoleId = roleString[roleString.findIndex(arr => arr.title === addEmployeePrompts.employeeRole)].id;
    const employeeManagerId = managerString[managerString.findIndex(arr => arr.name === addEmployeePrompts.employeeManager)].id;
    const params = [addEmployeePrompts.employeeFirstName, addEmployeePrompts.employeeLastName, employeeRoleId, employeeManagerId];

    query(sql, params).then((res) => {
        console.log(`Added ${addEmployeePrompts.employeeFirstName + " " + addEmployeePrompts.employeeLastName} to the database.`);
        return nextAction();
    })
    .catch((err) => {
        console.error(err);
    })
};

const updateEmployeeRole = async () => {
    inquirer
    .prompt([

    ])
    .then((res) => {

    })
}

const viewAllRoles = () => {
    query(`SELECT role.id, role.title, department.name AS department, role.salary FROM role role JOIN department department ON role.department_id = department.id`)
    .then((res) => {
        console.table(res);
        return nextAction();
    })
    .catch((err) => {
        console.error(err)
    })
};

const addRole = async () => {
    let departmentString = [], departmentNames = [];
    await query(`SELECT * FROM department`).then((res) => {
        departmentString = JSON.parse(JSON.stringify(res));
        for (let i = 0; i < departmentString.length; i++) {
            departmentNames.push(departmentString[i].name)
        }
    })
    .catch((err) => console.error(err))
    
    const addRolePrompts = await inquirer.prompt([
        {
            type: "input",
            message:"What is the name of the role?",
            name: "roleName"
        }, {
            type: "input",
            message: "What is the salary of the role?",
            name: "roleSalary"
        }, {
            type: "list",
            message: "Which department does the role belong to?",
            name: "roleDepartment",
            choices: departmentNames
        }
    ])
    const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
    const roleDepartmentId = departmentString[departmentString.findIndex(arr => arr.name === addRolePrompts.roleDepartment)].id;
    const params = [addRolePrompts.roleName, addRolePrompts.roleSalary, roleDepartmentId];

    query(sql, params).then((res) => {
        console.log(`Added ${addRolePrompts.roleName} to the database.`)
        return nextAction()
    })
    .catch((err) => {
        console.error(err);
    })
};

const viewAllDepartments = () => {
    query(`SELECT * FROM department`).then((res) => {
        console.table(res);
        return nextAction();
    })
    .catch((err) => {
        console.error(err);
    })
};

const addDepartment = async () => {
    // `inquirer.prompt` for department info
    const addDepartmentPrompts = await inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the department?",
            name: "departmentName"
        }
    ]);
    const sql = `INSERT INTO department (name) VALUES (?)`;
    const params = addDepartmentPrompts.departmentName;
    query(sql, params).then((res) => {
        console.log(`Added ${params} to the database.`)
        return nextAction();
    })
    .catch((err) => {
        console.error(err);
    })
};

nextAction();