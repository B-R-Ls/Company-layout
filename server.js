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
      host: 'j21q532mu148i8ms.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
      // MySQL username,
      user: 'bintnoni1x3wcgic',
      // MySQL password
      password: 'ad2qw8tbgf472p6d',
      database: 'fltrh47f9miodpcc'
    },
    console.log(`Connected to the courses_db database.`)
);

var roles = []

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
                    'add an emplyee',
                    'update an employee role'
                ]
            }
        ])
        .then((data) => {
            switch (data.initchoice) {
                case 'view all departments':
                    db.query('SELECT * FROM department', function (err, table) {
                        console.table(table)
                    });
                    break;
                case 'view all roles':
                    db.query('SELECT * FROM role', function (err, table) {
                        console.table(table)
                    });
                    break;
                case 'view all employees':
                    db.query('SELECT * FROM employee', function (err, table) {
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
                            db.query(`INSERT INTO department (name) VALUES('${data.dname}')`, function (err, table) {
                            console.table(table)
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
                        }
                    ]) .then((data) => {
                        roles.push(`${data.rname}`);
                        db.query(`INSERT INTO role (title, salary) VALUES('${data.rname}','${data.pay}')`, function (err, table) {
                        console.table(table);
                        });
                    })
                    break;
                case 'add an employee':
                    inquirer
                        .prompt([
                            {
                                type:'input',
                                message:'What is the name of the employee?',
                                name: 'ename',
                            },
                            {
                                type:'list',
                                message:'What is his role',
                                name: 'rchoice',
                                choices: roles
                            }
                        ]) .then((data) => {
                            db.query(`INSERT INTO department (name) VALUES('${data.ename}')`, function (err, table) {
                            console.table(table)
                            });
                        })
                    break;
                case 'update an employee role':

                    break;
            }
        })
}

init();