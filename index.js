require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
var bodyParser = require('body-parser');
var validUrl = require('valid-url');
// Basic Configuration
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({
extended: false
}))
app.use(cors());



app.use('/public', express.static(`${process.cwd()}/public`));

var urls = []

app.get('/', function(req, res) {
res.sendFile(process.cwd() + '/views/index.html');
});

app.post("/api/shorturl",(req,res,next) => {
var url = req.body.url
console.log(url)
if (!validUrl.isWebUri(url)) {
res.json({
error: 'invalid URL'
})
}
next();
}, (req,res)=>{
var url = req.body.url
shorturl = urls.length + 1
urls.push({original_url:url,short_url:shorturl})
res.json({ original_url : url, short_url : shorturl})
})

app.get("/api/shorturl/:shorturl",(req,res)=>{
shorturl = req.params.shorturl
url1 = urls.find(a => a.short_url == shorturl)
if (url1) {
res.redirect(302,url1.original_url);
res.json({message:"good"})
} else {
res.json({message:"no url"})
}
})


app.listen(port, function() {
console.log(`Listening on port ${port}`);
});