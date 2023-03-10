var JSheight = window.innerHeight - 25;
var JSwidth = window.innerWidth - 25;
var canvas = document.getElementById("canvas");
var processing = new Processing(canvas, function (processing) {
    processing.size(JSwidth, JSheight);
    processing.background(0xFFF);

    var mouseIsPressed = false;
    processing.mousePressed = function () { mouseIsPressed = true; };
    processing.mouseReleased = function () { mouseIsPressed = false; };

    var keyIsPressed = false;
    processing.keyPressed = function () { keyIsPressed = true; };
    processing.keyReleased = function () { keyIsPressed = false; };

    function getImage(s) {
        var url = "https://www.kasandbox.org/programming-images/" + s + ".png";
        processing.externals.sketch.imageCache.add(url);
        return processing.loadImage(url);
    }

    with (processing) {
        /*   ____        _              ____            _                 
        *   / ___|  ___ | | __ _ _ __  / ___| _   _ ___| |_ ___ _ __ ___  
        *   \___ \ / _ \| |/ _` | '__| \___ \| | | / __| __/ _ \ '_ ` _ \ 
        *    ___) | (_) | | (_| | |     ___) | |_| \__ \ ||  __/ | | | | |
        *   |____/ \___/|_|\__,_|_|    |____/ \__, |___/\__\___|_| |_| |_|
        *                                     |___/		           
        *   Codename: Solar-2.28dev191005
        *   FullSize: ?width=700&height=700
        *   3D View is here!
        *   Realistic orbits, sizes, revolutions!
        *   Planet Description
        *   
        *   Scale 1 pixel : 1,000,000 miles
        *   Still needs some bug fixing
        *   Font: Segoe UI
        *   Short URL: http://goo.gl/zPbGpE
        *   URL Clicks: http://goo.gl/#analytics/goo.gl/zPbGpE/all_time
        *   Found this program while researching, shoutout to this guy: https://www.khanacademy.org/computer-programming/scale-solar-system/991918981
        
        ~~~~~~~~~~README~~~~~~~~~~~~~~~
        
        /*Solar System
            Keys
                'W' Tilt Up
                'S' Tilt Down
                'C' Center
                'R' Restart
                'Q' Names
                'M' Stop Time
                '<' Scroll back in time
                '>' Scroll forward in time
                '/' Normal Speed
                '+' Zoom In
                '-' Zoom Out
                
            Info
        This is a scale model of our solar system at a scale of 1,000,000 miles
        in 1. You can also track and see planets' info, AKA "Solar Experience Tool", by using numbers on your keyboard.
        
                0 - Sun
                1 - Mercury
                2 - Venus
                3 - Earth
                4 - Mars
                5 - Jupiter
                6 - Saturn
                7 - Uranus
                8 - Neptune
                9 - Pluto
                
            Solar Experience Tool
        
            The Solar Experience Tool is currently in beta, which is not stable. The only stabilized feature is the info inside it. To open one, you'll need to use numbers according to the order of the planets (See Above in Info). The following is featured in the Tool-box:
                
                    Name
                    Type
                    Mass
                    Surface Gravity
                    Planetary Satellites
                    Distance to Sun in miles
                    Distance to Earth in miles
                    Current Year on the planet
        
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        
        */
        /*variables*/
        var version = "2.28.191005";
        var name = "Solar System\xB2";
        var pcSpeed = 0.00015;
        var broSpeed = 0.05;
        var speed = pcSpeed;
        var spdInter;
        if (speed === pcSpeed) {
            spdInter = 50;
        } else {
            spdInter = 1;
        }

        var scene = "start";
        var JSx = JSwidth / 2;
        var JSy = JSheight / 2;
        var locationX = JSwidth / 2;
        var locationY = JSheight / 2;
        var locPX = 952;
        var t = speed;
        var yr = 2015;
        var mo = 1;
        var showPlInfo = false;
        var PlData = false;
        textFont(createFont("Segoe UI"));
        var stx = locationX;
        var sty = locationY;
        var zoom = 1.0;
        var tilt = 0.3;
        var x = new Array(9);
        var y = new Array(9);
        var realX = new Array(9);
        var realY = new Array(9);
        var dev_mode = false;
        var dev_highcontrast = false;
        var dev_mouse = false;
        var dev_graph = true;

        var primaryColor = color(33, 150, 243);
        var secondaryColor = color(25, 118, 210);
        var accentColor = color(0, 150, 136);

        var brown500 = color(121, 85, 72);
        var amber700 = color(255, 160, 0);
        var blue500 = color(33, 150, 243);
        var red700 = color(211, 47, 47);
        var brown700 = color(93, 64, 55);
        var yellow600 = color(253, 216, 53);
        var lightblue400 = color(41, 182, 246);
        var blue900 = color(13, 71, 161);
        var grey500 = color(158, 158, 158);

        ////////ErrorWindow///////
        var error = function (title, errors, explanation, number) {
            this.title = title;
            this.errors = errors;
            this.exp = explanation;
            this.num = number;
        };
        error.prototype.draw = function () {
            rectMode(LEFT);
            textAlign(LEFT, LEFT);
            var bx = JSx - 179;
            var by = JSy - 110.5;
            noStroke();
            fill(0, 0, 0, 150);
            rect(0, 0, JSwidth, JSheight);
            fill(255, 255, 255);
            fill(255, 255, 255);
            rect(bx, by, 358, 221, 7);
            textSize(28);
            fill(92, 92, 92);
            text(this.title, bx + 25, by + 25, 302, 30);
            textSize(20);
            text(this.errors, bx + 25, by + 68, 301, 150);
            textSize(15);
            text("Error " + this.num + ": " + this.exp, bx + 25, by + 180, 304, 36);
        };

        ////////Buttons//////////
        var button = function (xB, yB, width, height, background, textColor, radius, shape, text) {
            this.xB = xB;
            this.yB = yB;
            this.width = width;
            this.height = height;
            this.background = background;
            this.textColor = textColor;
            this.radius = radius;
            this.shape = shape;
            this.text = text;
        };
        //This draws the buttons//
        button.prototype.draw = function () {
            noStroke();
            fill(this.background);
            if (this.shape === "ellipse") {
                ellipse(this.xB, this.yB, this.width, this.height);
            } else if (this.shape === "rect") {
                rect(this.xB, this.yB, this.width, this.height, this.radius);
                textAlign(LEFT, LEFT);
                fill(this.textColor);
                textSize(20);
                text(this.text, this.xB - 20, this.yB - 7, this.width, this.height);
            } else {
                var btnError = new error("Error", "Function values are entered wrong or can't find that value", "There is no such element as \"" + this.shape + "\" that was entered in the \'button\' function", "003");
                btnError.draw();
            }
            fill(255, 255, 255);
            //rect(this.xB, this.yB, this.width, this.height/2, 5);
        };
        //This is when the mouse is in the button//
        button.prototype.mouseIn = function () {
            if (this.shape === "rect") {
                return mouseX >= this.xB && mouseY >= this.yB && mouseX <= this.xB + this.width && mouseY <= this.yB + this.height;
            } else if (this.shape === "ellipse") {
                return mouseX >= this.xB - 20 && mouseY >= this.yB - 20 && mouseX <= this.xB - 20 + this.width && mouseY <= this.yB - 20 + this.height;
            }
        };

        //Needs origins
        var earthMoonMultiplier = 20;
        var marsMoonMultiplier = 800;
        var jupiterMoonMultiplier = 20;
        var saturnMoonMultiplier = 20;
        var uranusMoonMultiplier = 20;
        var neptuneMoonMultiplier = 20;
        var plutoMoonMultiplier = 200;
        var planetNumber = 50;
        var planet = {
            0: {
                "d": 35.98,
                "a": 0,
                "c": brown500,
                "s": 2,
                "n": "Mercury",
                "y": 0.24,
                "coordX": 0,
                "coordY": 0
            }/*Mercury (Planet)*/,
            1: {
                "d": 67.24,
                "a": 0,
                "c": amber700,
                "s": 2.5,
                "n": "Venus",
                "y": 0.62,
                "coordX": 0,
                "coordY": 0
            }/*Venus (Planet)*/,
            2: {
                "d": 92.96,
                "a": 0,
                "c": blue500,
                "s": 3,
                "n": "Earth",
                "y": 1.0,
                "coordX": 0,
                "coordY": 0
            }/*Earth (Planet)*/,
            3: {
                "d": 141.6,
                "a": 0,
                "c": red700,
                "s": 2,
                "n": "Mars",
                "y": 1.88,
                "coordX": 0,
                "coordY": 0
            }/*Mars (Planet)*/,
            4: {
                "d": 483.8,
                "a": 0,
                "c": brown700,
                "s": 6,
                "n": "Jupiter",
                "y": 11.9,
                "coordX": 0,
                "coordY": 0
            }/*Jupiter (Planet)*/,
            5: {
                "d": 890.7,
                "a": 0,
                "c": yellow600,
                "s": 5,
                "n": "Saturn",
                "y": 29.7,
                "coordX": 0,
                "coordY": 0
            }/*Saturn (Planet)*/,
            6: {
                "d": 1787.0,
                "a": 0,
                "c": lightblue400,
                "s": 5,
                "n": "Uranus",
                "y": 84.3,
                "coordX": 0,
                "coordY": 0
            }/*Uranus (Planet)*/,
            7: {
                "d": 2798.0,
                "a": 0,
                "c": blue900,
                "s": 5,
                "n": "Neptune",
                "y": 164.8,
                "coordX": 0,
                "coordY": 0
            }/*Neptune (Planet)*/,
            8: {
                "d": 3524.4,
                "a": 0,
                "c": grey500,
                "s": 1,
                "n": "Pluto",
                "y": 248.0,
                "coordX": 0,
                "coordY": 0
            }/*Pluto (Dwarf Planet)*/,
            9: {
                "d": 0,
                "a": 0,
                "c": color(235, 242, 17),
                "s": 12,
                "n": "Sun",
                "y": 0,
                "coordX": 0,
                "coordY": 0
            }/*Sun (Star)*/,
            10: {
                "d": 257,
                "a": 0,
                "c": grey500,
                "s": 1,
                "n": "Ceres",
                "y": 0.374751,
                "coordX": 0,
                "coordY": 0,
                "type": "Asteroid"
            }/*Ceres (Asteroid)*/,
            11: {
                "d": 0.2389 * earthMoonMultiplier,
                "a": 0,
                "c": grey500,
                "s": 1,
                "n": "Moon",
                "y": 0.07397260273,
                "coordX": 0,
                "coordY": 0,
                "parent": 2
            }/*Moon (Earth Moon)*/,
            12: {
                "d": 65069.065,
                "a": 0,
                "c": color(73, 70, 252),
                "s": 3,
                "n": "Planet Nine",
                "y": 15000,
                "coordX": 0,
                "coordY": 0
            }/*Planet Nine (Hypothetical Planet)*/,
            13: {
                "d": 0.005825976 * marsMoonMultiplier,
                "a": 0,
                "c": color(214, 214, 214),
                "s": 1,
                "n": "Phobos",
                "y": 0.000913242,
                "coordX": 0,
                "coordY": 0,
                "parent": 3
            }/*Phobos (Mars Moon)*/,
            14: {
                "d": 0.00273972602 * marsMoonMultiplier,
                "a": 0,
                "c": color(214, 214, 214),
                "s": 1,
                "n": "Deimos",
                "y": 0.00342465753,
                "coordX": 0,
                "coordY": 0,
                "parent": 3
            }/*Deimos (Mars Moon)*/,
            15: {
                "d": 0.7592348187 * saturnMoonMultiplier,
                "a": 0,
                "c": color(214, 214, 214),
                "s": 1,
                "n": "Titan",
                "y": 0.04383561643,
                "coordX": 0,
                "coordY": 0,
                "parent": 5
            }/*Titan (Saturn Moon)*/,
            16: {
                "d": 0.147854032 * saturnMoonMultiplier,
                "a": 0,
                "c": color(214, 214, 214),
                "s": 1,
                "n": "Enceladus",
                "y": 0.00375402191,
                "coordX": 0,
                "coordY": 0,
                "parent": 5
            }/*Enceladus (Saturn Moon)*/,
            17: {
                "d": 0.11528859 * saturnMoonMultiplier,
                "a": 0,
                "c": color(214, 214, 214),
                "s": 1,
                "n": "Mimas",
                "y": 0.00262557077,
                "coordX": 0,
                "coordY": 0,
                "parent": 5
            }/*Mimas (Saturn Moon)*/,
            18: {
                "d": 0.23450292991 * saturnMoonMultiplier,
                "a": 0,
                "c": color(214, 214, 214),
                "s": 1,
                "n": "Dione",
                "y": 0.00753424657,
                "coordX": 0,
                "coordY": 0,
                "parent": 5
            }/*Dione (Saturn Moon)*/,
            19: {
                "d": 2.21259028422 * saturnMoonMultiplier,
                "a": 0,
                "c": color(214, 214, 214),
                "s": 1,
                "n": "Iapetus",
                "y": 0.21643835616,
                "coordX": 0,
                "coordY": 0,
                "parent": 5
            }/*Iapetus (Saturn Moon)*/,
            20: {
                "d": 8.05296816 * saturnMoonMultiplier,
                "a": 0,
                "c": color(214, 214, 214),
                "s": 1,
                "n": "Phoebe",
                "y": 1.50839626301,
                "coordX": 0,
                "coordY": 0,
                "parent": 5
            }/*Phoebe (Saturn Moon)*/,
            21: {
                "d": 0.32752962506 * saturnMoonMultiplier,
                "a": 0,
                "c": color(214, 214, 214),
                "s": 1,
                "n": "Rhea",
                "y": 0.01237866301,
                "coordX": 0,
                "coordY": 0,
                "parent": 5
            }/*Rhea (Saturn Moon)*/,
            22: {
                "d": 0.18306770264 * saturnMoonMultiplier,
                "a": 0,
                "c": color(214, 214, 214),
                "s": 1,
                "n": "Tethys",
                "y": 0.00517206027,
                "coordX": 0,
                "coordY": 0,
                "parent": 5
            }/*Tethys (Saturn Moon)*/,
            23: {
                "d": 0.08806069812 * saturnMoonMultiplier,
                "a": 0,
                "c": color(214, 214, 214),
                "s": 1,
                "n": "Pandora",
                "y": 0.00172192935,
                "coordX": 0,
                "coordY": 0,
                "parent": 5
            }/*Pandora (Saturn Moon)*/,
            24: {
                "d": 0.92025604333 * saturnMoonMultiplier,
                "a": 0,
                "c": color(214, 214, 214),
                "s": 1,
                "n": "Hyperion",
                "y": 0.05753424657,
                "coordX": 0,
                "coordY": 0,
                "parent": 5
            }/*Hyperion (Saturn Moon)*/,
            25: {
                "d": 0.08660668998 * saturnMoonMultiplier,
                "a": 0,
                "c": color(214, 214, 214),
                "s": 1,
                "n": "Prometheus",
                "y": 0.00171232876,
                "coordX": 0,
                "coordY": 0,
                "parent": 5
            }/*Prometheus (Saturn Moon)*/,
            26: {
                "d": 0.08300522366 * saturnMoonMultiplier,
                "a": 0,
                "c": color(214, 214, 214),
                "s": 1,
                "n": "Pan",
                "y": 0.00159817351,
                "coordX": 0,
                "coordY": 0,
                "parent": 5
            }/*Pan (Saturn Moon)*/,
            27: {
                "d": 0.09411285166 * saturnMoonMultiplier,
                "a": 0,
                "c": color(214, 214, 214),
                "s": 1,
                "n": "Janus",
                "y": 0.00194063926,
                "coordX": 0,
                "coordY": 0,
                "parent": 5
            }/*Janus (Saturn Moon)*/,
            28: {
                "d": 11.1291274326 * saturnMoonMultiplier,
                "a": 0,
                "c": color(214, 214, 214),
                "s": 1,
                "n": "Tarqeq",
                "y": 2.45167123288,
                "coordX": 0,
                "coordY": 0,
                "parent": 5
            }/*Tarqeq (Saturn Moon)*/,
            29: {
                "d": 9.4448392 * saturnMoonMultiplier,
                "a": 0,
                "c": color(214, 214, 214),
                "s": 1,
                "n": "Paaliaq",
                "y": 1.88191780822,
                "coordX": 0,
                "coordY": 0,
                "parent": 5
            }/*Paaliaq (Saturn Moon)*/,
            30: {
                "d": 10.893255001 * saturnMoonMultiplier,
                "a": 0,
                "c": color(214, 214, 214),
                "s": 1,
                "n": "Siarnaq",
                "y": 2.45479452055,
                "coordX": 0,
                "coordY": 0,
                "parent": 5
            }/*Siarnaq (Saturn Moon)*/,
            31: {
                "d": 0.4168778039 * jupiterMoonMultiplier,
                "a": 0,
                "c": color(214, 214, 214),
                "s": 1,
                "n": "Europa",
                "y": 0.00972926301,
                "coordX": 0,
                "coordY": 0,
                "parent": 4
            }/*Europa (Jupiter Moon)*/,
            32: {
                "d": 0.6651155184 * jupiterMoonMultiplier,
                "a": 0,
                "c": color(214, 214, 214),
                "s": 1,
                "n": "Ganymede",
                "y": 0.01960151495,
                "coordX": 0,
                "coordY": 0,
                "parent": 4
            }/*Ganymede (Jupiter Moon)*/,
            33: {
                "d": 0.2620321507 * jupiterMoonMultiplier,
                "a": 0,
                "c": yellow600,
                "s": 1,
                "n": "Io",
                "y": 0.00484695283,
                "coordX": 0,
                "coordY": 0,
                "parent": 4
            }/*Io (Jupiter Moon)*/,
            34: {
                "d": 1.1698551817 * jupiterMoonMultiplier,
                "a": 0,
                "c": brown500,
                "s": 1,
                "n": "Callisto",
                "y": 0.04572333808,
                "coordX": 0,
                "coordY": 0,
                "parent": 4
            }/*Callisto (Jupiter Moon)*/,
            35: {
                "d": 7.28246812 * jupiterMoonMultiplier,
                "a": 0,
                "c": grey500,
                "s": 1,
                "n": "Lysithea",
                "y": 0.70958904109,
                "coordX": 0,
                "coordY": 0,
                "parent": 4
            }/*Lysithea (Jupiter Moon)*/,
            36: {
                "d": 0.27086183261 * uranusMoonMultiplier,
                "a": 0,
                "c": grey500,
                "s": 1,
                "n": "Titania",
                "y": 0.02385269589,
                "coordX": 0,
                "coordY": 0,
                "parent": 6
            }/*Titania (Uranus Moon)*/,
            37: {
                "d": 0.08039919369 * uranusMoonMultiplier,
                "a": 0,
                "c": grey500,
                "s": 1,
                "n": "Miranda",
                "y": 0.0038725452,
                "coordX": 0,
                "coordY": 0,
                "parent": 6
            }/*Miranda (Uranus Moon)*/,
            38: {
                "d": 0.11869428842 * uranusMoonMultiplier,
                "a": 0,
                "c": lightblue400,
                "s": 1,
                "n": "Ariel",
                "y": 0.00690410958,
                "coordX": 0,
                "coordY": 0,
                "parent": 6
            }/*Ariel (Uranus Moon)*/,
            39: {
                "d": 0.165284686 * uranusMoonMultiplier,
                "a": 0,
                "c": grey500,
                "s": 1,
                "n": "Umbriel",
                "y": 0.01135342465,
                "coordX": 0,
                "coordY": 0,
                "parent": 6
            }/*Umbriel (Uranus Moon)*/,
            40: {
                "d": 0.36258240592 * uranusMoonMultiplier,
                "a": 0,
                "c": grey500,
                "s": 1,
                "n": "Oberon",
                "y": 0.0368855726,
                "coordX": 0,
                "coordY": 0,
                "parent": 6
            }/*Oberon (Uranus Moon)*/,
            41: {
                "d": 0.220437023 * neptuneMoonMultiplier,
                "a": 0,
                "c": grey500,
                "s": 1,
                "n": "Triton",
                "y": -0.01610096986,
                "coordX": 0,
                "coordY": 0,
                "parent": 7
            }/*Triton (Neptune Moon)*/,
            42: {
                "d": 0.012173283 * plutoMoonMultiplier,
                "a": 0,
                "c": grey500,
                "s": 1,
                "n": "Charon",
                "y": 0.01749926136,
                "coordX": 0,
                "coordY": 0,
                "parent": 8
            }/*Charon (Pluto Moon)*/,
            43: {
                "d": 219.542096034,
                "a": 0,
                "c": grey500,
                "s": 0.5,
                "n": "4 Vesta",
                "y": 3.63219178082,
                "coordX": 0,
                "coordY": 0,
                "type": "Asteroid"
            }/*4 Vesta (Asteroid)*/,
            44: {
                "d": 317.2215,
                "a": 0,
                "c": grey500,
                "s": 0.5,
                "n": "2 Pallas",
                "y": 4.61745665,
                "coordX": 0,
                "coordY": 0,
                "type": "Asteroid"
            }/*2 Pallas (Asteroid)*/,
            45: {
                "d": 292.076442,
                "a": 0,
                "c": grey500,
                "s": 1,
                "n": "10 Hygiea",
                "y": 5.57342465753,
                "coordX": 0,
                "coordY": 0,
                "type": "Asteroid"
            }/*10 Hygiea (Asteroid)*/,
            46: {
                "d": 205.423038,
                "a": 0,
                "c": grey500,
                "s": 0.5,
                "n": "951 Gaspra",
                "y": 3.28767123,
                "coordX": 0,
                "coordY": 0,
                "type": "Asteroid"
            }/*951 Gaspra (Asteroid)*/,
            47: {
                "d": 246.18436,
                "a": 0,
                "c": grey500,
                "s": 0.5,
                "n": "253 Mathilde",
                "y": 4.31315068,
                "coordX": 0,
                "coordY": 0,
                "type": "Asteroid"
            }/*253 Mathilde (Asteroid)*/,
            48: {
                "d": 265.946565,
                "a": 0,
                "c": grey500,
                "s": 0.5,
                "n": "243 Ida",
                "y": 4.84286027,
                "coordX": 0,
                "coordY": 0,
                "type": "Asteroid"
            }/*243 Ida (Asteroid)*/,
            49: {
                "d": 248.257074,
                "a": 0,
                "c": grey500,
                "s": 0.5,
                "n": "3 Juno",
                "y": 4.36463,
                "coordX": 0,
                "coordY": 0,
                "type": "Asteroid"
            }/*3 Juno (Asteroid)*/,
            50: {
                "d": 117.28,
                "a": 0,
                "c": red700,
                "s": 0.05,
                "n": "Roadster",
                "y": 1.5646067416,
                "coordX": 0,
                "coordY": 0,
                "type": "Asteroid"
            }/*Tesla Roadster (Artificial Satellite)*/
        };
        var planetInfo = {
            0: { name: "Mercury", type: "Rocky Planet", mass: "3.3022e+23 kg\n(0.055 Earths)", gravity: "3.7", moons: "None" },
            1: { name: "Venus", type: "Rocky Planet", mass: "4.867e+24 kg\n(0.815 Earths)", gravity: "8.87", moons: "None" },
            2: { name: "Earth", type: "Rocky Planet", mass: "5.972e+24 kg\n(1 Earth)", gravity: "9.807", moons: "1" },
            3: { name: "Mars", type: "Rocky Planet", mass: "639e+21 kg\n(0.107 Earths)", gravity: "3.711", moons: "2" },
            4: { name: "Jupiter", type: "Gas Giant", mass: "1.898e+27 kg\n(317.8 Earths)", gravity: "24.79", moons: "67" },
            5: { name: "Saturn", type: "Gas Giant", mass: "568.3e+24 kg\n(95.16 Earths)", gravity: "10.44", moons: "200" },
            6: { name: "Uranus", type: "Gas Giant", mass: "86.81e+24 kg\n(14.54 Earths)", gravity: "8.69", moons: "27" },
            7: { name: "Neptune", type: "Gas Giant", mass: "102.4e+24 kg\n(17.15 Earths)", gravity: "11.15", moons: "13" },
            8: { name: "Pluto", type: "Dwarf Planet", mass: "1.30900e+22 kg\n(0.0066 Earths)", gravity: "0.658", moons: "4" },
            9: { name: "Sun", type: "Star", mass: "1.989e+30 kg\n(1.3M Earths)", gravity: "28.02 ", moons: "8" }
        };
        var orbit = function () {
            stroke(56, 55, 56);
            noFill();
            strokeWeight(0.8);
            for (var i = 0; i < planetNumber + 1; i++) {
                if (i === 8) {
                    stroke(0, 41, 0);
                    ellipse(locationX + locPX * zoom, locationY, planet[i].d * 2.0 * zoom, planet[i].d * 2.0 * zoom * tilt);
                } else {
                    if (planet[i].parent) {
                        stroke(0, 41, 0);
                        ellipse(locationX + x[planet[i].parent], locationY + y[planet[i].parent] * tilt, planet[i].d * zoom, planet[i].d * zoom * tilt);
                    } else if (planet[i].type === "Asteroid") {
                        stroke(0, 15, 0);
                        ellipse(locationX, locationY, planet[i].d * 2.0 * zoom, planet[i].d * 2.0 * zoom * tilt);
                    } else {
                        ellipse(locationX, locationY, planet[i].d * 2.0 * zoom, planet[i].d * 2.0 * zoom * tilt);
                    }
                }
            }
        };
        var planetDist = function (planet1, planet2) {
            var dist = Math.round(Math.sqrt(Math.pow((realX[planet1] - realX[planet2]), 2) + Math.pow((realY[planet1] - realY[planet2]), 2)) * 1000000/*92955807.3*/) + " miles";
            var dist2 = dist.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            return planet[planet1].n + " to " + planet[planet2].n + ": " + dist2;
        };
        var planetDesc = function (planetID) {
            if (keyIsPressed) {
                showPlInfo = true;
            } else {
                //showPlInfo = false;
            }
            if (showPlInfo === true) {
                var x = JSwidth - 103;
                var y = JSy;
                var lx = JSwidth - 182;
                var ly = JSy - 158;
                var textOffsetY = 45;
                rectMode(CENTER);

                //fill 54 (Great Color for Material Design)
                fill(255, 255, 255);
                rect(x, y, 177, 357, 5);
                fill(25, 118, 210);
                fill(color(planet[planetID].c));
                rect(x, y - 180, 177, 120, 5);
                rect(x, y - 175, 177, 120, 0);
                textSize(20);
                fill(255, 255, 255);
                text(planetInfo[planetID].name, lx, ly + 15);
                textSize(13);
                text(planetInfo[planetID].type, lx, ly + 30);
                fill(66, 66, 66);
                //var returnText = (planetInfo[planetID].mass).split("\n");
                //for (var i = 0; i < returnText.length; i++){
                text("Mass:\n" + planetInfo[planetID].mass, lx, ly + 20 + textOffsetY);
                //}
                text("Surface Gravity:\n" + planetInfo[planetID].gravity + " m/s\xB2", lx, ly + 80 + textOffsetY);
                if (planetID === 9) {
                    text("Planets:\n" + planetInfo[planetID].moons, lx, ly + 120 + textOffsetY);
                    text("Sun to Center of Milky Way:\n 100,000 light years", lx, ly + 160 + textOffsetY);
                } else {
                    text("Planetary Satellites:\n" + planetInfo[planetID].moons, lx, ly + 120 + textOffsetY);
                    text(planetDist(planetID, 9), lx, ly + 150 + textOffsetY, 130, 50);
                    text(planetDist(planetID, 2), lx, ly + 190 + textOffsetY, 130, 50);
                    var plYr = Math.round(year() + planet[planetID].a / 360);
                    text("Year:\n" + plYr, lx, ly + 240 + textOffsetY);
                }
                rectMode(LEFT);
                textSize(12);
            }
        };
        var planetNames = function () {
            for (var i = 0; i < planetNumber + 1; i++) {
                if (dev_mode && dev_highcontrast) {
                    fill(255, 255, 255);
                } else {
                    fill(194, 194, 194);
                }
                if (i === 9) {
                    text(planet[i].n, locationX + x[i] + planet[i].s / 2, locationY + y[i] - planet[i].s / 2);
                } else {
                    if (planet[i].parent) {
                        if (zoom > 5) {
                            var pX = planet[planet[i].parent].coordX;
                            var pY = planet[planet[i].parent].coordY;
                            text(planet[i].n, locationX + (x[i] / 2.1) + pX, locationY + ((y[i] / 2.1) + pY) * tilt - 5);
                        }
                    } else if (planet[i].type === "Asteroid") {
                        if (zoom > 1) {
                            text(planet[i].n, locationX + x[i], locationY + y[i] * tilt - 5);
                        }
                    } else {
                        text(planet[i].n, locationX + x[i], locationY + y[i] * tilt - 5);
                    }
                }
            }
        };

        var uiIndicator = function (typeB, textB, zoomB) {
            this.typeB = typeB;
            this.textB = textB;
            this.zoomB = zoomB;
        };
        uiIndicator.prototype.draw = function () {
            pushMatrix();
            fill(255, 255, 255);
            var size = 30;
            switch (this.typeB) {
                case 'zoom':
                    noFill();
                    stroke(255, 255, 255);
                    strokeWeight(5);
                    ellipse(0 + JSx, 0 + JSheight - 200, size, size);
                    line(0 + JSx + (size / 2) - 4, 0 + JSheight - 204 + (size / 2), JSx + (size / 2) + 10, 0 + JSheight - 175);
                    break;
                case 'slow':
                    triangle(0 + JSx, 0 + JSheight - 200, 0 + JSx, size + JSheight - 200, JSx - size, size / 2 + JSheight - 200);
                    triangle(JSx + size, 0 + JSheight - 200, JSx + size, size + JSheight - 200, JSx, size / 2 + JSheight - 200);
                    break;
                case 'fast':
                    triangle(0 + JSx - size, 0 + JSheight - 200, 0 + JSx - size, size + JSheight - 200, JSx, size / 2 + JSheight - 200);
                    triangle(JSx, 0 + JSheight - 200, JSx, size + JSheight - 200, size + JSx, size / 2 + JSheight - 200);
                    break;
                case 'play':
                    triangle(0 + JSx - (size / 2), 0 + JSheight - 200, 0 + JSx - (size / 2), size + JSheight - 200, JSx + (size / 2), size / 2 + JSheight - 200);
                    break;
                case 'stop':
                    rect(0 + JSx - (size / 2), 0 + JSheight - 200, size, size);
                    break;
                default:
                    break;
            }
            textAlign(CENTER, CENTER);
            textSize(20);
            if (this.zoomB === "+" || this.zoomB === "-") {
                text(this.zoomB, JSx, JSheight - 203);
            }
            text(this.textB, JSx, size + 30 + JSheight - 200);
            textAlign(LEFT, BOTTOM);
            textSize(12);
            popMatrix();
        };

        var solarSys = function (mode) {
            orbit();
            if (mode === "start") {
                locationX = stx/*350*/;
                locationY = sty - 161/*161*/;
                t = (speed / 0.01);
                tilt = 0.1;
                t += 0.1;
                zoom = 1;
            }
            //Sun
            fill(235, 242, 17);
            noStroke();
            //ellipse(locPX,locationY,20,20);
            for (var i = 0; i < planetNumber + 1; i++) {
                x[i] = -1.0 * planet[i].d * zoom * cos(planet[i].a);
                y[i] = -1.0 * planet[i].d * zoom * sin(planet[i].a);
                realX[i] = -1.0 * planet[i].d * cos(planet[i].a);
                realY[i] = -1.0 * planet[i].d * sin(planet[i].a);
                planet[i].coordX = x[i];
                planet[i].coordY = y[i];
                if (dev_mode && dev_highcontrast) {
                    fill(255, 255, 255);
                } else {
                    fill(planet[i].c);
                }
                if (i === 8) {
                    pushMatrix();
                    x[i] = x[i] + locPX * zoom;
                    planet[8].coordX = x[i];
                    ellipse(locationX + x[i], locationY + y[i] * tilt, planet[i].s * 1.5 / (zoom * 2), planet[i].s * 1.5 / (zoom * 2));
                    planet[i].a += t * (1.0 / planet[i].y);
                    popMatrix();
                } else if (i === 5) {
                    noFill();
                    stroke(planet[i].c * 20);
                    var ringSize = 2;
                    strokeWeight(2);
                    //ellipse(locationX+x[i],locationY+y[i]*tilt,ringSize*2.0*zoom,ringSize*2.0*zoom*tilt);
                    strokeWeight(1.5);
                    /******************/
                    noStroke();
                    fill(planet[i].c);
                    ellipse(locationX + x[i], locationY + y[i] * tilt, planet[i].s / 1.2, planet[i].s / 1.2);
                    planet[i].a += t * (1.0 / planet[i].y);
                    if (zoom < 1) {
                        fill(255, 255, 255, 100 * zoom / 1.5);
                        ellipse(locationX + x[i], locationY + y[i] * tilt, planet[i].s * 0.8 / zoom, planet[i].s * 0.8 / zoom);
                    }
                } else if (i === 9) {
                    x[i] = 0;
                    y[i] = 0;
                    ellipse(locationX + x[i], locationY + y[i] * tilt, planet[i].s, planet[i].s);
                    fill(235, 242, 17, 150 * zoom / 2);
                    ellipse(locationX + x[i], locationY + y[i] * tilt, planet[i].s * 5 / (zoom * 2), planet[i].s * 5 / (zoom * 2));
                } else {
                    if (planet[i].parent) {
                        var pX = planet[planet[i].parent].coordX;
                        var pY = planet[planet[i].parent].coordY;
                        ellipse(locationX + (x[i] / 2.1) + pX, locationY + ((y[i] / 2.1) + pY) * tilt, planet[i].s * 1.5 / (zoom * 2), planet[i].s * 1.5 / (zoom * 2));
                        planet[i].a += t * (1.0 / planet[i].y);
                    } else {
                        ellipse(locationX + x[i], locationY + y[i] * tilt, planet[i].s / 1.2, planet[i].s / 1.2);
                        planet[i].a += t * (1.0 / planet[i].y);
                        //planet[i].a %= 360;
                        if (zoom < 1) {
                            fill(255, 255, 255, 100 * zoom / 1.5);
                            ellipse(locationX + x[i], locationY + y[i] * tilt, planet[i].s * 1.5 / (zoom * 2), planet[i].s * 1.5 / (zoom * 2));
                        }
                    }
                }
            }
            //Saturn to Sun + (Saturn to Neptune divided by 2) + Sun's Location = Pluto's orbit center
            //-890.7 + ((-890.7 + - 1787)/2) + 350
            //-890.7 + -1787 /2
            yr = year() + planet[2].a / 360;
            mo = 1 + planet[2].a / 30;
            if (keyIsPressed && mode === "solarS") {
                fill(217, 217, 217);
                var keyInt = parseInt(key.toString(), 10);
                switch (keyInt) {
                    case 0:
                        if (key.toString === '0') {
                            locationX = -x[9] + (JSx);
                            locationY = -y[9] * tilt + (JSy);
                            planetNames();
                            planetDesc(9);
                        }
                        break;
                    default:
                        locationX = -x[keyInt - 1] + (JSx);
                        locationY = -y[keyInt - 1] * tilt + (JSy);
                        planetNames();
                        planetDesc(keyInt - 1);
                }
                switch (key.toString()) {
                    case 'q':
                        planetNames();
                        break;
                    /*case (1||2||3||4||5||6||7||8||9):
                        switch(PlData){
                            case false:
                                PlData = true;
                            break;
                        }
                    break;*/
                    case '-':
                        for (var i = 0; i < planetNumber + 1; i++) {
                            if (zoom >= 0.1) {
                                planet[i].s -= 0.05;
                            }
                        }
                        if (zoom >= 0.1) {
                            zoom = zoom - 0.05;
                            planet[9].s -= 0.5;
                        }

                        // var keyInt = parseInt("3", 10);
                        // var dX = locationX-x[9];
                        // var dY = locationY-y[9];
                        // var dist = Math.sqrt(dX*dX + dY*dY);
                        // var e = new error(dist, "", "", "");
                        // e.draw();
                        // locationX = 1.0 * dist * zoom * cos(planet[2].a) + (JSx);
                        // locationY = 1.0 * dist * zoom * sin(planet[2].a) * tilt + (JSy);

                        var ui = new uiIndicator("zoom", "Zoom: " + Math.round(zoom), "-");
                        ui.draw();
                        break;
                    case '=':
                        for (var i = 0; i < planetNumber + 1; i++) {
                            planet[i].s += 0.05;
                        }
                        zoom = zoom + 0.05;
                        planet[9].s += 0.5;

                        // var keyInt = parseInt("3", 10);
                        // locationX = -x[keyInt-1]+(JSx);
                        // locationY = -y[keyInt-1]*tilt+(JSy);

                        var ui = new uiIndicator("zoom", "Zoom: " + Math.round(zoom), "+");
                        ui.draw();
                        break;
                    case ',':
                        if (speed === pcSpeed) {
                            t -= speed * 3;
                        } else {
                            t -= speed;
                        }

                        var ui = new uiIndicator("slow", "Speed: x" + Math.round(t * spdInter), "null");
                        ui.draw();
                        break;
                    case '.':
                        if (speed === pcSpeed) {
                            t += speed * 3;
                        } else {
                            t += speed;
                        }

                        var ui = new uiIndicator("fast", "Speed: x" + Math.round(t * spdInter), "null");
                        ui.draw();
                        break;
                    case '/':
                        t = speed;

                        var ui = new uiIndicator("play", "Play", "null");
                        ui.draw();
                        break;
                    case 'm':
                        t = 0;

                        var ui = new uiIndicator("stop", "Stop", "null");
                        ui.draw();
                        break;
                    case 'w':
                        tilt += 0.01;
                        if (tilt >= 1.0) {
                            tilt = 1.0;
                        }
                        break;
                    case 'a':
                        for (var i = 0; i < planetNumber + 1; i++) {
                            planet[i].a -= 1;
                        }
                        break;
                    case 's':
                        tilt -= 0.01;
                        if (tilt <= 0) {
                            tilt = 0.0;
                        }
                        break;
                    case 'd':
                        for (var i = 0; i < planetNumber + 1; i++) {
                            planet[i].a += 1;
                        }
                        break;
                }
            }
        };

        var keyHelp = function (key, desc, x, y) {
            for (var i = 0; i < key.length; i++) {
                var width = 50;
                x += width + 10;
                fill(accentColor);
                stroke(accentColor);
                ellipse(x + 25, y + 26, 50, 50);
                fill(255, 255, 255);
                textAlign(CENTER, CENTER);
                textSize(20);
                text(key[i], x + 25, y + 25);
                textSize(10);
                text(desc[i], x + 25, y + -10);
                textSize(12);
                textAlign(LEFT, LEFT);
            }
        };

        var splash = [
            "1,000,000 miles in 1 pixel!",
            "Since 2015",
            // "E",
            "\"Sounds good, I'll have some H2O TOO\"",
            "Cat-ions are PAWSitively charged",
            // "LOL",
            "In a galaxy, not far enough, there was the solar system.",
            "My favorite frequency is 50,000 Hz\nYou've probably never heard it before",
            "Comet me bro",
            "\"that???s one small step for a man,\none giant leap for mankind.\" - Neil Armstrong",
            "\"We copy you down Eagle\" - Charles Duke, Capcom",
            "\"Houston, we've had a problem\" - John Swigert",
            "\"I'm coming back in??? and it's the\nsaddest moment of my life.\" - Ed White",
            // "Me: What's your favorite genre\nScientists: Heavy Metal Salts",
            "Syst\u00E8me solaire",
            "Sistema solar",
            "G\u00FCne\u015F Sistemi",
            "Sonnensystem",
            "Sistema solare",
            // "\"Great way to visualize the Solar System\"",
            "JavaScript + JS Processing",
            // "Keyboard Compatible!",
            // "Khan Academy!",
            // "Try it!",
            "It's 100% free ... or is it?",
            "99.99% bug-free",
            "As seen on nowhere",
            // "Solar Experience ToolKit",
            // "Second Generation",
            // "I am not the fastest man alive",
            // "Browser Compatible",
            // "BitBucket Project",
            "Just another \"high-tech\" simulator! - Said nobody",
            // "Random Text!",
            "Saturn has 200 moons!",
            "1 million earths can fit in the sun!",
            "Made on Earth by Humans",
            "Life on mars?",
            "Planet nine?",
            "PHS '19",
            // "v = ??s / ??t",
            // "???F = ma",
            // "a = ??v / ??t",
            // "v = v??? + at",
            // "E = mc??",
            // "W = mg",
            // "f??? ??? ?????N",
            // "f??? = ?????N",
            // "p = mv",
            // "J = F??t",
            // "F??t = m??v",
            // "W = F??s cos ??",
            // "F??s cos ?? = ??E",
            // "K = ??mv??",
            // "t = ??t???",
            "Pi = 3.1415926535897932384626433832795028841971"];
        var rand = Math.floor((Math.random() * splash.length) + 0);

        var start = function () {
            textSize(7);
            planetNames();
            var fc = 0;
            var yOffset = 80;
            fill(0, 0, 0, 50);
            rect(JSx, JSy, JSwidth, JSheight);
            textSize(35);
            textAlign(CENTER, CENTER);
            //fill(61, 61, 61,150);
            rectMode(CENTER);
            fill(secondaryColor);
            rect(stx, sty + yOffset, 375, 230, 5);

            fill(primaryColor);
            rect(stx, sty - 50 + yOffset, 375, 230, 5);

            fill(255, 255, 255);
            text(name, stx, sty - 80 + yOffset);

            textSize(15);
            var stopw = 1;
            text(splash[rand], stx, sty + 89 + yOffset);
            var startbtn = new button(stx, sty - 0 + yOffset, 150, 40, color(255, 255, 255), primaryColor, 3, "rect", "Start");
            startbtn.draw();
            if (mouseIsPressed && startbtn.mouseIn) {
                scene = "solarS";
                locationX = JSx;
                locationY = JSy;
                t = speed;
                tilt = 0.3;
                zoom = 1.0;
            }
            if (keyIsPressed && key.toString() === 'r') {
                Program.restart();
            }
            textSize(13);
            textAlign(RIGHT);
            var copyrights = [
                "Version " + version,
                "Oct 5, 2019",
                "",
                "Fatih Balsoy \u00A9 2023"
            ];
            for (var i = 0; i < copyrights.length; i++) {
                text(copyrights[i], JSwidth - 20, (JSheight - 5) - (i * 15));
            }
            textAlign(LEFT);
        };

        var keysLocX = 0;
        //playSound(getSound("retro/coin"));
        var data = function () {
            if (keyIsPressed && key.toString() === ']') {
                keysLocX -= 2;
            } else if (keyIsPressed && key.toString() === '[') {
                keysLocX += 2;
            }
            rectMode(RIGHT);
            fill(135, 135, 135);
            var showDataY = JSheight - 200;
            //text(planetDist(5,4),20,showDataY-20);
            //stroke(227, 227, 227);
            //line(x[5]+locationX,y[5]*tilt+locationY,x[4]+locationX,y[4]*tilt+locationY);
            text("Date: " + Math.round(yr) + " (Example)", 20, showDataY + 60);
            text("Tilt: " + Math.round(tilt * 90) + "\xBA", 20, showDataY + 40);
            text("Graph: " + Math.round(locationX) + ", " + Math.round(locationY), 20, showDataY + 80);
            var moX = mouseX + locationX - JSx;
            var moY = mouseY + locationY - JSy;
            if (dev_mode === true && dev_mouse === true) {
                stroke(255, 0, 0);
                fill(255, 255, 255, 200);
                rect(mouseX, mouseY - 30, ((Math.round(moX).toString().length) * 12 + (Math.round(moY).toString().length) * 13), 30);
                fill(255, 0, 0);
                text(Math.round(moX) + ", " + Math.round(moY), mouseX + 10, mouseY - 10);
                text("Mouse", mouseX + 10, mouseY + 20);
                stroke(255, 0, 0);
                line(mouseX, 0, mouseX, JSheight);
                line(0, mouseY, JSwidth, mouseY);
                noFill();
                ellipse(mouseX, mouseY, 10, 10);
            }
            if (dev_mode === true && dev_graph === true) {
                var sunX, sunY;
                var textX, textY;
                var textBoxWidth = ((Math.round(locationX).toString().length) * 12 + (Math.round(locationY).toString().length) * 13);
                if (locationX <= JSwidth && locationX >= 0) {
                    sunX = locationX;
                    textX = locationX;
                } else if (locationX >= JSwidth) {
                    sunX = JSwidth;
                    textX = JSwidth - textBoxWidth;
                } else if (locationX <= 0) {
                    textX = 0;
                }
                if (locationY <= JSheight && locationY >= 0) {
                    sunY = locationY;
                    textY = locationY;
                } else if (locationY >= JSheight) {
                    sunY = JSheight;
                    textY = JSheight - 130;
                } else if (locationY <= 0) {
                    textY = 30;
                }

                stroke(255, 0, 0);
                fill(255, 255, 255, 200);
                rect(textX, textY - 30, textBoxWidth, 30);
                fill(255, 0, 0);
                text(Math.round(locationX) + ", " + Math.round(locationY), textX + 10, textY - 10);
                text("Center of system", textX + 10, textY + 20);
                stroke(255, 0, 0);
                line(sunX, 0, sunX, JSheight);
                line(0, sunY, JSwidth, sunY);
                noFill();
                ellipse(sunX, sunY, 10, 10);
            }
            keyHelp([
                "W",
                "S",
                "C",
                // "R",
                "Q",
                "M",
                "[",
                "]",
                "<",
                ">",
                "/",
                "+",
                "-",
                "0-9"
            ], [
                "Tilt Up",
                "Tilt Down",
                "Center",
                // "Restart",
                "Names",
                "Stop",
                "Help Left",
                "Help Right",
                "Slow",
                "Fast",
                "Normal Speed",
                "Zoom In",
                "Zoom Out",
                "Planets"
            ], -33 + keysLocX, JSheight - 71);
            textAlign(CENTER, CENTER);
            text("Use arrow keys to move around", 230, JSheight - 98);
            text("Use numbers to locate planets (Ex: 1 is Mercury)", 500, JSheight - 98);
            textSize(30);
            text(name, JSx, 20);
            textSize(12);
            textAlign(LEFT, LEFT);
            // if(keyCode){
            //     switch(key.toString()){
            //         case 'q':
            //             orbit();
            //         break;
            //     }
            // }
            if (keyIsPressed) {
                switch (keyCode) {
                    case UP:
                        locationY = locationY + 10;
                        break;
                    case DOWN:
                        locationY = locationY - 10;
                        break;
                    case RIGHT:
                        locationX = locationX - 10;
                        //locPX = locPX - 10;
                        break;
                    case LEFT:
                        locationX = locationX + 10;
                        //locPX = locPX + 10;
                        break;
                }
                switch (key.toString()) {
                    case 'c':
                        locationX = JSx;
                        locationY = JSy;
                        break;
                    case 'r':
                        // scene = "start";
                        // scenePr();
                        var keyR = new error("Error", "The 'R' key would crash the program for now, if you're on Mac do Command+R or if you're on Windows fo Ctrl-R", "JSProcessing doesn't have Program.restart()", "004");
                        keyR.draw();
                        Program.restart();
                        break;
                }
            }
            mouseDragged = function () {
                locationX = mouseX;
                locationY = mouseY;
            };
            textSize(12);
        };

        var starsBack = function () {
            for (var i = 0; i < 100; i++) {
                fill(255, 255, 255);
                //point(10*i*zoom/2+locationX,10*i*zoom/2*(tilt)+locationY);
                pushMatrix();
                /*var scattered = (Math.random()*i)+1;
                point(i+scattered,scattered+i);*/
                popMatrix();
            }
        };

        var scenePr = function () {
            switch (scene) {
                case "solarS":
                    starsBack();
                    solarSys("solarS");
                    data();
                    break;
                case "start":
                    solarSys("start");
                    start();
                    break;
            }
        };

        draw = function () {
            if (dev_mode && dev_highcontrast) {
                background(184, 184, 184);
            } else {
                background(0, 0, 0);
            }
            scenePr();
        };


    }
    if (typeof draw !== 'undefined') processing.draw = draw;
});
