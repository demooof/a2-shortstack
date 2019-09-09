var http = require('http')
    , qs = require('querystring')
    , fs = require('fs')
    , url = require('url')
    , fuzzy = require('fuzzy')
    , port = 8080

// Add more movies! (For a technical challenge, use a file, database, or even an API!)
var movies = ['Jaws', 'Jaws 2', 'Jaws 3', 'Doctor Strange', 'Logan','Spider-man','Pirates of Caribbean']

var server = http.createServer(function (req, res) {

    var uri = url.parse(req.url, true)

    // Note we no longer have an index.html file, but we handle the cases since that's what the browser will request
    // You'll need to modify the below to account for POSTs
    switch (uri.pathname) {
        case '/':

        case '/index.html':

            if ('search' in uri.query) { // Search
                handleSearch(res, uri)

            } else if (req.method == "POST") { // POST
                handlePost(res, req, uri)
            } else {

                sendIndex(res, movies)
            }
            break
        case '/style.css':
            sendFile(res, 'style.css', 'text/css')
            break
        case '/js/scripts.js':
            sendFile(res, 'scripts.js', 'text/javascript')
            break
        default:
            res.end('404 not found')
    }

})

server.listen(process.env.PORT || port)
console.log('listening on 8080')

// You'll be modifying this function for the search / query part
function handleSearch(res, uri) {
    var contentType = 'text/html'
    res.writeHead(200, {'Content-type': contentType})
    // PROCESS THE URI TO FILTER MOVIES ARRAY BASED ON THE USER INPUT
    // somehow filter movies

    searchresult = fuzzy.filter(uri.query.search, movies)
    var matches = searchresult.map(function (el) {
        return el.string;
    })
    sendIndex(res, matches)
}


function handlePost(res, req, uri) {
    var postdata = ''
    req.on('data', function (d) {
        postdata += d
    })
    req.on('end', function () {
        var data = qs.parse(postdata)

        if ('add' in data) { // client adds to list
            index = movies.indexOf(data.add)
            if (index == -1) {
                movies.push(data.add)
            }
        }
        else { // client removes from list
            index = movies.indexOf(data.remove)
            if (index != -1) {
                movies.splice(index, 1)
            }
        }
        sendIndex(res, movies)
    })
}

// Note: consider this your "index.html" for this assignment
// You'll be modifying this function

function sendIndex(res, movies) {
    var contentType = 'text/html'
        , html = ''

    html = html + '<html>'


    html = html + '<head>'
    html = html + '<link rel="stylesheet" href="style.css">'

    html = html + '</head>'

    html = html + '<body>'

    html = html + '<h1>Movie Search!</h1>'

    // Here's where we build the form YOU HAVE STUFF TO CHANGE HERE


    html = html + '<form action="/" method="GET">'
    html = html + '<input type="text"  name="search" placeholder="Search"/>'
    html = html + '<button type="submit" >Search</button>'
    html = html + '</form>'

    // YOU MAY WANT ANOTHER FORM FOR ADDING AND DELETING ITEMS FROM YOUR LIST.
    // (alternately-- it should be possible to do it with URLs.)


    html = html + '<form action="/" method="POST">'
    html = html + '<input type="text"  name="add" placeholder="Add Movie"/>'
    html = html + '<button type="submit" >Add</button>'
    html = html + '</form>'

    html = html + '<form action="/" method="POST">'
    html = html + '<input type="text"  name="delete" placeholder="Delete Movie"/>'
    html = html + '<button type="submit" >Delete</button>'
    html = html + '</form>'

    html = html + '<ul>'


    html = html + movies.map(function (d) {
            return '<li>' + d + '</li>'
        }).join(' ')
    html = html + '</ul>'


    html = html + '</body>'
    html = html + '</html>'


    res.writeHead(200, {'Content-type': contentType})
    res.end(html, 'utf-8')
}

function sendFile(res, filename, contentType) {
    contentType = contentType || 'text/html'

    fs.readFile(filename, function (error, content) {
        res.writeHead(200, {'Content-type': contentType})
        res.end(content, 'utf-8')
    })

}