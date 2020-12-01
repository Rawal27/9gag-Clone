const express = require('express');
const NineGag = require('9gag');
const ejs = require('ejs');
const Scraper = NineGag.Scraper;
const Downloader = NineGag.Downloader;
const path = require('path');
const app = express();
const $ = require('jquery');


let posts = {};

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

/** app.get('/', (req, res) => {
	res.json({"message": "Welcome to 9gag application. Keep track of all the hot memes."});
}); **/

app.get('/', async (req, res) => {
	try{
		const scraper = new Scraper(100, 'hot', 1000);
        	posts = await scraper.scrap();
		res.render('index', {
			posts: posts
		});
	}
	catch (err){
		res.status(500).send({
			messsage: err.message || "Some error occured while retrieving posts."
		});				
	}
});

app.get('/:pageId', async (req, res) => {
	try {
        	// number of posts, section and number of comments
        	// can pass a custom http client as the last Scraper argument
		const page = req.params.pageId;   
		const limit = 5;
		let data = [];   
		for(let i = page * limit; i < (page * limit) + limit; i++){
			data.push(posts[i]);						
		}
		res.render('index', {
			posts: data	
		});		    
    	}
    	catch (err) {
    		res.status(500).send({
	    		message: err.message || "Some error occurred while retrieving posts."					
		});
    	}
});

app.get('/meme/:memeId', async (req, res) => {
	try {
		const postId = req.params.memeId;
		let index = posts.findIndex(x => x.id == postId);
		res.render('content', {
			post : posts[index]
		});
	}
	catch (err) {
		res.status(500).send({
			message: err.message || "Error occured while fetching a post."
		});
	}
});


// listen for requests
app.listen(3000, () => {
	console.log("Server is listening on port 3000");
});
