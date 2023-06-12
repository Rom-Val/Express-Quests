const database = require("./database");


const getUsers = (req, res, next) => {
    const initialSql = "select * from users";
    const where = [];

    if (req.query.language = 'English') {
        where.push({
            column: "language",
            value: req.query.language,
            operator: "=",
        });
    }
    if (req.query.city = 'Paris') {
        where.push({
            column: "city",
            value: req.query.city,
            operator: "=",
        });
    }

    database
        .query(
            where.reduce(
                (sql, { column, operator }, index) =>
                    `${sql} ${index === 0 ? "where" : "and"} ${column} ${operator} ?`,
                initialSql
            ),
            where.map(({ value }) => value)
        )
        .then(([users]) => {
            res.users = users;
            next();
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error retrieving data from database");
        });
};



const getUserById = (req, res, next) => {
    const id = parseInt(req.params.id);

    database
        .query("select * from users where id = ?", [id])
        .then(([users]) => {
            if (users.length === 0)
                return res.status(404).send("not found")
            res.users = users[0];
            next();
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error retrieving data from database");
        });
};

//fonction pour l'ajout de Users
const postUser = (req, res) => {
    const { firstname, lastname, email, city, language, hashedPassword } = req.body;
    database
        .query(
            "INSERT INTO users(firstname, lastname, email, city, language, hashedPassword) VALUES (?, ?, ?, ?, ?, ?)",
            [firstname, lastname, email, city, language, hashedPassword]
        )
        .then(([result]) => {
            res.location(`/api/users/${result.insertId}`).sendStatus(201);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error saving user");
        });
};

//fonction update users

const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { firstname, lastname, email, city, language } = req.body;

    database
        .query(
            "update users set firstname = ?, lastname = ?, email = ?, city = ?, language = ? where id = ?",
            [firstname, lastname, email, city, language, id]
        )
        .then(([result]) => {
            if (result.affectedRows === 0) {
                res.status(404).send("Not Found");
            } else {
                res.sendStatus(204);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error editing user");
        });
};

//fonction pour Delete un User

const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);

    database
        .query("delete from users where id = ?", [id])
        .then(([result]) => {
            if (result.affectedRows === 0) {
                res.status(404).send("Not Found");
            } else {
                res.sendStatus(204);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error deleting the user");
        });
};


module.exports = {
    getUsers,
    getUserById,
    postUser,
    updateUser,
    deleteUser,
};