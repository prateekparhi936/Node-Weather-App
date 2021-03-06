const path = require('path')
const express = require('express')
const hbs=require('hbs')
const geocode=require('./utils/geocode')
const forecast=require('./utils/forecast')

const app = express()
const port=process.env.PORT || 3000

//define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath=path.join(__dirname,'../templates/views')
const partialsPath=path.join(__dirname,'../templates/partials')

//setup handlerbars and views locations
app.set('view engine', 'hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Prateek'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Prateek'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title:"Help",
        helpText: 'Find weather',
        name:'Prateek'
    })
})


app.get('/weather', (req, res) => {
    if (!req.query.address) {  
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location }={}) => {
        if (error) {
            return res.send({ error })
        }

    forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/help/*',(req,res)=>{
    res.render('404',{
        title:'404',
        name:'prateek',
        errormessage:'help article not found'
    })
})

//* wildcard-everything else goes here
//this app.get must come after all the other routes before starting the server(listen)
app.get('*',(req,res)=>{
    res.render("404",{
        title:'404',
        name:'prateek',
        errormessage:'page not found'
    })
})

app.listen(port, () => {
    console.log('Server is up on port '+port)
})