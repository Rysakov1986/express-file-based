/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
module.exports.get = (req,res) => {
    res.json({test: '/', params: req.params});
}