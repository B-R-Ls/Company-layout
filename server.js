const inquirer = require("inquirer");
const logo = require('asciiart-logo');
const config = require('./package.json');
const express = require('express')
const mysql = require('mysql2')

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
      host: '',
      // MySQL username,
      user: '',
      // MySQL password
      password: '',
      database: ''
    },
    console.log(`Connected to the courses_db database.`)
);

var roles = ['Cheif_Engineer', 'Engineer', 'Cyber_Cheif', 'Cyber_Engineer', 'Marketing_Cheif', 'Marketing_Agent', 'Sales_Manager', 'Sales_Person']
var managers = ['none','Ben', 'Deep', 'Tina', 'Catherin']
var departments = ['Engineering', 'Cyber Development', 'Marketing', 'Sales']

function init () {
    console.log(
        logo({
            name: 'Company Layout',
            font: 'ANSI Shadow',
            lineChars: 10,
            padding: 2,
            margin: 3,
            borderColor: 'grey',
            logoColor: 'bold-green',
            textColor: 'green',
        })
        .render()
    );
    questions();
}

function questions() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to kwow about the company?',
                name: 'initchoice',
                choices: [
                    'view all departments',
                    'view all roles',
                    'view all employees',
                    'add a department',
                    'add a role',
                    'add an employee',
                    'update an employee role'
                ]
            }
        ])
        .then((data) => {
            switch (data.initchoice) {
                case 'view all departments':
                    db.query('SELECT name FROM department', function (err, table) {
                        console.table(table);
                    });
                    break;
                case 'view all roles':
                    db.query('SELECT title, salary FROM role', function (err, table) {
                        console.table(table)
                    });
                    break;
                case 'view all employees':
                    db.query(`SELECT 
                    department.name, role.title, role.salary, employee.first_name, employee.last_name, manager.id as manager
                    FROM employee 
                    inner JOIN role ON role.id = employee.role_id 
                    inner JOIN department ON department.id = role.department_id
                    left JOIN employee as manager ON employee.manager_id = manager.id;`, function (err, table) {
                        console.table(table)
                    });
                    break;
                case 'add a department':
                    inquirer
                        .prompt([
                            {
                                type:'input',
                                message:'What department would you like to add?',
                                name: 'dname',
                            }
                        ]) .then((data) => {
                            departments.push(`${data.dname}`);
                            db.query(`INSERT INTO department (name) VALUES('${data.dname}')`, function (err, table) {
                            });
                            db.query('SELECT name FROM department', function (err, table) {
                                console.table(table);
                            });
                            
                        })
                    break;
                case 'add a role':
                    inquirer
                    .prompt([
                        {
                            type:'input',
                            message:'What role would you like to add?',
                            name: 'rname',
                        },
                        {
                            type:'input',
                            message:'How much does this role pay?',
                            name:'pay',
                        },
                        {
                            type:'rawlist',
                            message:'Which Department is it part of?',
                            name:'dname',
                            choices: departments
                        }
                    ])
                     .then((data) => {
                        var choice = 0

                        if (data.dname === 'Engineering') {
                            var choice = 1
                        } else if (data.dname === 'Cyber Development') {
                            var choice = 2
                        } else if (data.dname === 'Marketing') {
                            var choice = 3
                        } else {
                            var choice = 4
                        }
                        
                        db.query(`INSERT INTO role (title, salary, department_id) VALUES('${data.rname}',${data.pay}, ${choice})`, function (err, table) {
                        
                        }) 
                        db.query(`SELECT title, salary FROM role`, function (err, data) {
                            console.table(data);
                        })
                    })
                    break;
                case 'add an employee':
                    inquirer
                        .prompt([
                            {
                                type:'input',
                                message:'What is the first name of the employee?',
                                name: 'fename'
                            },
                            {
                                type:'input',
                                message:'Whate is the last name of the employee?',
                                name: 'lename'
                            },
                            {
                                type:'list',
                                message:'What is their role',
                                name: 'rchoice',
                                choices: roles
                            },
                            {
                                type:'list',
                                message:`Who's their manager?`,
                                name:'manager',
                                choices: managers
                            }
                        ]) .then((data) => {
                            var choice = 0;
                            var role = 0;

                            if (data.rchoice === 'Cheif_Engineer') {
                                var role = 1;
                            } else if (data.rchoice === 'Engineer') {
                                var role =2;
                            } else if (data.rchoice === 'Cyber_Cheif') {
                                var role =3;
                            } else if (data.rchoice === 'Cyber_Engineer') {
                                var role =4;
                            } else if (data.rchoice === 'Marketing_Cheif') {
                                var role =5;
                            } else if (data.rchoice === 'Marketing_Agent') {
                                var role =6;
                            } else if (data.rchoice === 'Sales_Manager') {
                                var role =7;
                            } else  {
                                var role =8;
                            } 

                            if (data.manager === 'Ben') {
                                var choice = 1;
                            } else if (data.manager === 'Deep') {
                                var choice = 3;
                            } else if (data.manager === 'Tina') {
                                var choice = 5;
                            } else if (data.manger === 'Catherin') {
                                var choice = 7;
                            } else {
                                var choice = null;
                            }
                            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES('${data.fename}','${data.lename}', ${role} ,${choice})`, function (err, table) {
                            console.log(table)
                            });
                            db.query(`SELECT 
                                department.name, role.title, role.salary, employee.first_name, employee.last_name, manager.id as manager
                               FROM employee 
                               inner JOIN role ON role.id = employee.role_id 
                               inner JOIN department ON department.id = role.department_id
                               left JOIN employee as manager ON employee.manager_id = manager.id;`, function (err, info) {
                                    console.table(info);
                            });
                        })
                    break;
                case 'update an employee role':
                    inquirer
                        .prompt([
                            {
                                type:'input',
                                message:'What is the first name of the employee?',
                                name: 'fename'
                            },
                            {
                                type:'list',
                                message:'What is their new role',
                                name: 'rchoice',
                                choices: roles
                            },
                        ]) .then((data) => {
                            var choice = 0;
                            
                            if (data.rchoice === 'Cheif_Engineer') {
                                var choice = 1;
                            } else if (data.rchoice === 'Engineer') {
                                var choice =2;
                            } else if (data.rchoice === 'Cyber_Cheif') {
                                var choice =3;
                            } else if (data.rchoice === 'Cyber_Engineer') {
                                var choice =4;
                            } else if (data.rchoice === 'Marketing_Cheif') {
                                var choice =5;
                            } else if (data.rchoice === 'Marketing_Agent') {
                                var choice =6;
                            } else if (data.rchoice === 'Sales_Manager') {
                                var choice =7;
                            } else  {
                                var choice =8;
                            } 
                            db.query(`UPDATE employee SET role_id = ${choice} WHERE first_name = '${data.fename}'`, function (err, table) {
                            console.table(table)
                            }) 
                            db.query(`SELECT 
                                department.name, role.title, role.salary, employee.first_name, employee.last_name, manager.id as manager
                               FROM employee 
                               inner JOIN role ON role.id = employee.role_id 
                               inner JOIN department ON department.id = role.department_id
                               left JOIN employee as manager ON employee.manager_id = manager.id;`, function (err, table) {
                               console.table(table);
                            })
                            
                        })
                    break;
            }
            return;
        })
        return;
}

init();

// db.query('SELECT name FROM department', function (err, table) {
//     for (let i = 0; i < table.length; i++) {
        // console.log(Object.values(table[i]))
//         const department = Object.values(table[i]);
//         return departments
//     }
// }) 
