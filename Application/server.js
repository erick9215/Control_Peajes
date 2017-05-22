const 	express = require('express'),
		expressLayouts = require('express-ejs-layouts'),
		app = express(),
		MongoClient = require('mongodb').MongoClient,
		dbMng = require('./scripts/dbManager.js');

let dbManager = new dbMng();

app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');
app.set('layout extractScripts', true)
app.set('layout extractStyles', true)

app.use(expressLayouts);
app.use('/public', express.static('public'));

app.listen(3000, (req, res) => {
    console.log('listening on 3000')
});

app.get('/', (req, res) => {
	let records = dbManager.getTrafficRecordsCount();
    
    records.then(function(data){
        res.render('index', {
			activeTab : 1,
	    	tabTitle: 'Dashboard - TCSb',
	    	mainTitle: 'Dashboard',
	    	subTitle: 'Statistics Overview',
	    	records: data
  		});
    });

});

app.get('/charts', (req, res) => {
  	res.render('charts', {
    	activeTab : 2,
	    tabTitle: 'Charts - TCSb',
	    mainTitle: 'Charts',
	    subTitle: '',
  	});
});

app.get('/tables', (req, res) => {
    res.render('tables', {
    	activeTab : 3,
	    tabTitle: 'Tables - TCSb',
	    mainTitle: 'Tables',
	    subTitle: '',
  	}); 
});

app.get('/settings', (req, res) => {
    res.render('settings', {
    	activeTab : 4,
	    tabTitle: 'Settings - TCSb',
	    mainTitle: 'Settings',
	    subTitle: '',
  	}); 
});

// app.get('/rest', (req, res) => {
    
// });

app.get('*', function(req, res){
   	res.render('404', {
    	activeTab : 0,
		tabTitle: 'Not found error - TCSb',
	 	mainTitle: '',
		subTitle: '',
  	});
});
