module.exports.priority = 1
/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
 module.exports.get = (req,res) => {
    res.json({test: 'another-custom-url [id]', params: req.params});
}