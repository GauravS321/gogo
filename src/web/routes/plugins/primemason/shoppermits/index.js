const router = require('express').Router();

router.get('/create',(req,res)=>{
	res.render('components/wizard/create');
})

module.exports = router;