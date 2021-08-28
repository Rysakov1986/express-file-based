module.exports.Get = (req,res) => {
    res.json({params: req.params, url: '/[postId]/index'});
}