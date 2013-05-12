var casper = require('casper').create({verbose: true, logLevel: "debug"});
var utils = require('utils');
var link = "https://clients.mindbodyonline.com/ASP/home.asp?studioid=1134"
var link2 = "https://clients.mindbodyonline.com/ASP/main_class.asp?tg=&vt=&lvl=&stype=&view=&trn=0&page=&catid=&prodid=&date=5%2F12%2F2013&classid=0&sSU=&optForwardingLink=&qParam=&justloggedin=&nLgIn=&pMode=";


function extractTimetable(){
    var date = '';
    function groupByDays (memo, elem) {
        console.log('inside');
        if(!elem.hasAttribute('class')) {
            date = elem.textContent.trim();
        } else {
            var fields = toArray(elem.children).map(function(elem){ return elem.textContent;})
            var teacher = fields[3];
            if(!memo[teacher]){
                    memo[teacher] = [];
            }
            memo[teacher].push([date,fields[0].trim(), fields[4].trim()]);
        }
        return memo;
    }
    function toArray(obj) {
      var ret = [];
      for (var i = 0, len = obj.length; i < len; i++) {
        ret[i] = obj[i];
      }
      return ret;
    }
    String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};

    var rows = document.querySelectorAll('#classSchedule tr');
    var result = toArray(rows).reduce(groupByDays, {});
    return result;
};



casper.on('remote.message', function(message) {
    casper.log(message);
});
casper.start(link, function(){
    casper.withFrame("mainFrame", function() {
        result = this.evaluate(extractTimetable);
        utils.dump(result);
   }); 
});

casper.run(function () {
    this.exit();
});
