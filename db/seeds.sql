INSERT INTO department (name)
VALUES ("Engineering"),
       ("Cyber Development"),
       ("Marketing"),
       ("Sales")


INSERT INTO role (title, salary, department_id)
VALUES ("Cheif_Engineer", 80,000, 1),
       ("Engineer", 60,000, 1),
       ("Cyber_Cheif", 80,000, 2),
       ("Cyber_engineer", 60,000, 2),
       ("Marketing_Cheif", 70,000, 3),
       ("Marketing_Agent", 50,000, 3),
       ("Sales_Mangager", 65,000, 4),
       ("Sales_Person", 40,000, 4)

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Ben", "Franco", 1, null),
       ("Tom", "markus", 2, 1),
       ("Deep", "Miriam", 3, null),
       ("Kamen", "Alfons", 4, 3),
       ("Tina", "Julia", 5, null),
       ("Susanna", "Keaton", 6, 5),
       ("Catherin", "Hasan", 7, null),
       ("Samuel", "Girish", 8, 7)