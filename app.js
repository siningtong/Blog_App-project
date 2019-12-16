const express = require('express');
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");
const app = express();
const mongoose = require('mongoose');
const PORT = 3000;
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/restful_blog_app', {useNewUrlParser: true,useFindAndModify: false});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"))

//mongoose modal config
const blogSchema = new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type: Date, default: Date.now }
})
const blog = mongoose.model('blog',blogSchema )

 

//restful routes

app.get('/',(req,res)=>{
	res.redirect('/blogs')
})
//index route
app.get('/blogs',(req,res)=>{
	blog.find({},(err,blogs)=>{
		err?console.log(err):	res.render('index',{blogs})
	})
})
//new route
app.get('/blogs/new',(req,res)=>{
	res.render('new')
})
//create route
app.post('/blogs',(req,res)=>{
	req.body.blog.body = req.sanitize(req.body.blog.body)
	blog.create(req.body.blog,(err,newlyCreatedBlog)=>{
		err?console.log(err):res.redirect('/blogs')
	})
	
})
//show route
app.get('/blogs/:id',(req,res)=>{
	const blogId = req.params.id
	blog.findById(blogId,(err,result)=>{
		err?res.redirect("/blogs"):res.render('show',{result})
})
})
//edit route
app.get('/blogs/:id/edit',(req,res)=>{
	const blogId = req.params.id
	blog.findById(blogId,(err,result)=>{
		err?console.log(err):res.render('edit',{result})
})
})
//update route
app.put('/blogs/:id',(req,res)=>{
		req.body.blog.body = req.sanitize(req.body.blog.body)
	blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,updatedBlog)=>{
		err?res.redirect("/blogs"):res.redirect(`\/blogs\/${req.params.id}`)
	})
})

//delete route
app.delete("/blogs/:id",(req,res)=>{
	blog.findByIdAndRemove(req.params.id,(err,deletedBlog)=>{
		err?res.redirect("/blogs"):res.redirect("/blogs")
	})
})


app.listen(PORT,()=>{
	console.log('server is up')
})