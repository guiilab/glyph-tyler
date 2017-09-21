var express = require('express')
var http = require('http')
var path = require('path')

app = express()

var server = http.Server(app)

app.set('port', process.env.PORT || 3500)

app.use('/', express.static('public'))

app.use(express.static(path.join(__dirname, 'public')))

app.get('*', function(req, res) {
  res.render('index')
})

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'))
})
