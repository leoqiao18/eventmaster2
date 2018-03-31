module.exports = (req, res, next) => {
    if (req.user) {
        return res.send("You must be unauthenticated!");
    }
    next();
};
