(function(){

    var $  = document.getElementById.bind(document);
    var $$ = document.querySelectorAll.bind(document);

    var App = function($el){
        this.$el = $el;
        this.setBackground($('bg'));
        this.getData();

        this.renderLoop();

    };

    App.fn = App.prototype;

    App.fn.setBackground = function($ele){
        var index = Math.floor(Math.random() * Math.floor(3)) + 1;
        $ele.style.backgroundImage = "url('./../images/tamar-ywat-bg-0" + index + ".jpg')";
        $ele.style.backgroundRepeat = "none";
        $ele.style.backgroundSize = "cover";
    }

    App.fn.getData = function(){
        if(navigator.onLine) {
            fetch('https://covid-api.com/api/reports?iso=MMR')
                .then(response => response.json())
                .then((data) => {
                    // console.log(data.data[0]);
                    var cData = data.data[0];
                    var displayData = {
                        cases: cData.confirmed,
                        deaths: cData.deaths,
                        recovered: cData.recovered,
                        date: this.dateConvert(cData.date),
                        active_case: cData.active
                    }
                    localStorage.covidmm = JSON.stringify(displayData);
                })
                .catch(err => console.log("Error: ", err));
        } else {
            var displayData = {
                cases: '--',
                deaths: '--',
                recovered: '--',
                date: '--'
            }
            localStorage.covidmm = JSON.stringify(displayData);
        }
    }

    App.fn.dateConvert = function(date) {
        var now = new Date(date);
        var day = now.getDate()<10? "0"+now.getDate() : now.getDate();
        var month = (now.getMonth()+1)<10? "0"+(now.getMonth()+1) : (now.getMonth()+1);
        var year = ''+now.getFullYear();
        return day+"/"+month+"/"+year;
    }

    App.fn.renderLoop = function() {
        this.interval = setInterval(this.render.bind(this), 100);
    }

    App.fn.render = function() {
        this.load();
        this.html(this.view('covid')(this.covidmm));
    }

    App.fn.load = function() {
        var data;
        if(data = localStorage.covidmm)
            this.covidmm = JSON.parse(localStorage.covidmm);
    }

    App.fn.$$ = function(sel){
        return this.$el.querySelectorAll(sel);
    };
    
    App.fn.html = function(html){
        this.$el.innerHTML = html;
    };
    
    App.fn.view = function(name){
        var $el = $(name + '-template');
        return Handlebars.compile($el.innerHTML);
    };

    window.app = new App($('app'));
})();
