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
        $ele.style.backgroundImage = "url('https://cdn.prod.www.spiegel.de/images/145cad44-5958-4d8f-a12b-c8ecad47af67_w948_r1.77_fpx52.84_fpy49.98.jpg')";
        $ele.style.backgroundRepeat = "none";
        $ele.style.backgroundSize = "cover";
    }

    App.fn.getData = function(){
        if(navigator.onLine) {
            fetch('https://api.thevirustracker.com/free-api?countryTotal=MM')
                .then(response => response.json())
                .then((data) => {
                    var cData = data.countrydata[0];
                    var displayData = {
                        cases: cData.total_cases,
                        deaths: cData.total_deaths,
                        recovered: cData.total_recovered,
                        rank: cData.total_danger_rank
                    }
                    localStorage.covidmm = JSON.stringify(displayData);
                })
                .catch(err => console.log("Error: ", err));
        } else {
            var displayData = {
                cases: '--',
                deaths: '--',
                recovered: '--',
                rank: '--'
            }
            localStorage.covidmm = JSON.stringify(displayData);
        }
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
