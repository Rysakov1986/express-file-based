/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
module.exports.Get = (req,res) => {
    res.json({params: req.params, url: req.originalUrl});
}

module.exports.post = (req,res) => {
    res.json({params: req.params, url: req.url});
}

module.exports.del = (req,res) => {
    res.json({params: req.params, url: req.url});
}