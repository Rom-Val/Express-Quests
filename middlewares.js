const validateMovie = (req, res, next) => {
    const { title, director, year, color, duration } = req.body;

    if (!title || !director || !year || typeof color !== "boolean" || !duration) {
        return res.status(422).json({ error: "Invalid movie data" });
    }

    next();
};

const validateUser = (req, res, next) => {
    const { firstname, lastname, email, city, language } = req.body;

    if (!firstname || !lastname || !email || !city || !language) {
        return res.status(422).json({ error: "Invalid user data" });
    }

    next();
};

module.exports = { validateMovie, validateUser };
