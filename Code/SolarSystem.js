/*   ____        _              ____            _                 
*   / ___|  ___ | | __ _ _ __  / ___| _   _ ___| |_ ___ _ __ ___  
*   \___ \ / _ \| |/ _` | '__| \___ \| | | / __| __/ _ \ '_ ` _ \ 
*    ___) | (_) | | (_| | |     ___) | |_| \__ \ ||  __/ | | | | |
*   |____/ \___/|_|\__,_|_|    |____/ \__, |___/\__\___|_| |_| |_|
*                                     |___/		            
*   Codename: Solar-2.0dev482015
*   FullSize: ?width=700&height=700
*   3D View is here!
*   Realistic orbits, sizes, revolutions!
*   Planet Description
*   
*   Scale 1 mile : 1,000,000 miles
*   Still needs some bug fixing
*   Font: Segoe UI
*   Short URL: http://goo.gl/zPbGpE
*   URL Clicks: http://goo.gl/#analytics/goo.gl/zPbGpE/all_time
*   I never copied this program: https://www.khanacademy.org/computer-programming/scale-solar-system/991918981

*   Report Bugs Here:
*   https://bitbucket.org/fatih_balsoy/solar-system-js/issues?status=new&status=open

~~~~~~~~~~README~~~~~~~~~~~~~~~
/*Solar System
    Keys
        'W' Yaw Up
        'S' Yaw Down
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
This is a scale model of our solar system at a scale of 10,000 miles
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
        The Solar Experience Tool is currently in beta, which is not          stable. The only stabilized feature is the info inside it. To         open one, you'll need to use numbers according to the order of         the planets (See Above in Info). The following is featured in         the Tool-box:
        
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

var scene = "start";
var JSheight = 700;
var JSwidth = 700;
var JSx = JSwidth/2;
var JSy = JSheight/2;
var locationX = JSwidth/2;
var locationY = JSheight/2;
var locPX = 952;
var t = 0.05;
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

////////ErrorWindow///////
var error = function(title, errors, explanation, number){
    this.title = title;
    this.errors = errors;
    this.exp = explanation;
    this.num = number;
};
error.prototype.draw = function() {
    rectMode(LEFT);
    textAlign(LEFT,LEFT);
    var bx = 165;
    var by = 491;
    noStroke();
    fill(0, 0, 0, 150);
    rect(0,0,700,700);
    fill(255, 255, 255);
    fill(255,255,255);
    rect(bx,by,358,221,7); 
    textSize(28);
    fill(168, 168, 168);
    text(this.title, bx+25, by+25, 302, 30);
    textSize(20);
    text(this.errors, bx+25, by+68, 301, 88);
    textSize(15);
    text("Error "+this.num+": "+this.exp,bx+25,by+160,304,36);
};

////////Buttons//////////
var button = function(xB, yB, width, height, fllb, radius, shape, text) {
    this.xB = xB;
    this.yB = yB;
    this.width = width;
    this.height = height;
    this.fllb = fllb;
    this.radius = radius;
    this.shape = shape;
    this.text = text;
}; 
//This draws the buttons//
button.prototype.draw = function() {
    noStroke();
    fill(this.fllb);
    if (this.shape === "ellipse"){
        ellipse(this.xB, this.yB, this.width, this.height);
    } else if (this.shape === "rect") {
        rect(this.xB, this.yB, this.width, this.height, this.radius);
        textAlign(LEFT,LEFT);
        fill(255, 255, 255);
        textSize(20);
        text(this.text, this.xB-20, this.yB-7, this.width, this.height);
    } else {
        var btnError = new error("Error", "Function values are entered wrong or can't find that value", "There is no such element as \""+ this.shape +"\" that was entered in the \'button\' function", "003");
        btnError.draw();
    }
    fill(255, 255, 255);
    //rect(this.xB, this.yB, this.width, this.height/2, 5);
};
//This is when the mouse is in the button//
button.prototype.mouseIn = function() {
    if (this.shape === "rect"){
        return mouseX >= this.xB && mouseY >= this.yB && mouseX <= this.xB + this.width && mouseY <= this.yB + this.height;
    } else if (this.shape === "ellipse"){
        return mouseX >= this.xB-20 && mouseY >= this.yB-20 && mouseX <= this.xB-20 + this.width && mouseY <= this.yB-20 + this.height;
    }
}; 

//Needs origins
var planet = {
    0:{"d":35.98,"a":0,"c":color(163,101,0),"s":2,"n":"Mercury","y":0.24}, 
    1:{"d":67.24,"a":0,"c":color(199,113,0),"s":2.5,"n":"Venus","y":0.62}, 
    2:{"d":92.96,"a":0,"c":color(73, 70, 252),"s":3,"n":"Earth","y":1.0},
    3:{"d":141.6,"a":0,"c":color(235, 12, 12),"s":2,"n":"Mars","y":1.88},
    4:{"d":483.8,"a":0,"c":color(163, 101, 0),"s":6,"n":"Jupiter","y":11.9},
    5:{"d":890.7,"a":0,"c":color(248, 252, 3),"s":5,"n":"Saturn","y":29.7},
    6:{"d":1787.0,"a":0,"c":color(0, 143, 191),"s":5,"n":"Uranus","y":84.3},
    7:{"d":2798.0,"a":0,"c":color(8, 0, 161),"s":5,"n":"Neptune","y":164.8},
    8:{"d":3524.4,"a":0,"c":color(158, 158, 158),"s":1,"n":"Pluto","y":248.0},
    9:{"d":0,"a":0,"c":color(235, 242, 17),"s":12,"n":"Sun","y":0},
    10:{"d":257,"a":0,"c":color(214, 214, 214),"s":1,"n":"Ceres","y":0.374751}
};
var planetInfo = {
    0:{name:"Mercury",type:"Rocky Planet",mass:"3.3022e+23 kg\n(0.055 Earths)",gravity:"3.7 m/s²",moons:"None"},
    1:{name:"Venus",type:"Rocky Planet",mass:"4.867e+24 kg\n(0.815 Earths)",gravity:"8.87 m/s²",moons:"None"},
    2:{name:"Earth",type:"Rocky Planet",mass:"5.972e+24 kg\n(1 Earth)",gravity:"9.807 m/s²",moons:"1"},
    3:{name:"Mars",type:"Rocky Planet",mass:"639e+21 kg\n(0.107 Earths)",gravity:"3.711 m/s²",moons:"2"},
    4:{name:"Jupiter",type:"Gas Giant",mass:"1.898e+27 kg\n(317.8 Earths)",gravity:"24.79 m/s²",moons:"67"},
    5:{name:"Saturn",type:"Gas Giant",mass:"568.3e+24 kg\n(95.16 Earths)",gravity:"10.44 m/s²",moons:"200"},
    6:{name:"Uranus",type:"Gas Giant",mass:"86.81e+24 kg\n(14.54 Earths)",gravity:"8.69 m/s²",moons:"27"},
    7:{name:"Neptune",type:"Gas Giant",mass:"102.4e+24 kg\n(17.15 Earths)",gravity:"11.15 m/s²",moons:"13"},
    8:{name:"Pluto",type:"Dwarf Planet",mass:"1.30900e+22 kg\n(0.0066 Earths)",gravity:"0.658 m/s²",moons:"4"},
    9:{name:"Sun",type:"Star",mass:"1.989e+30 kg\n(1.3M Earths)",gravity:"28.02 m/s²",moons:"8"}
};

var orbit = function(){
    stroke(56, 55, 56);
    noFill();
    strokeWeight(0.8);
    for(var i=0; i<11; i++) {
        if(i === 8) {
            stroke(0, 41, 0);
            ellipse(locationX+locPX*zoom,locationY,planet[i].d*2.0*zoom,planet[i].d*2.0*zoom*tilt);
        } else {
            ellipse(locationX,locationY,planet[i].d*2.0*zoom,planet[i].d*2.0*zoom*tilt);
        }
    }
};

var planetDist = function(planet1, planet2){
    var dist = Math.round(Math.sqrt(Math.pow((realX[planet1]-realX[planet2]),2)+Math.pow((realY[planet1]-realY[planet2]),2))*1000000/*92955807.3*/)+" miles";
    return planet[planet1].n+" to "+planet[planet2].n+": "+dist;
};

var planetDesc = function(planetID){
    if(keyIsPressed){
        showPlInfo = true;   
    } else {
        //showPlInfo = false;
    }
    if (showPlInfo === true){
        var x = JSwidth-103;
        var y = JSy;
        var lx = JSwidth-182;
        var ly = JSheight-500;
        rectMode(CENTER);
        //fill 54 (Great Color for Material Design)
        fill(54, 54, 54,100);
        rect(JSwidth-103,JSy,177,357,5);
        fill(255, 255, 255);
        textSize(20);
        text(planetInfo[planetID].name, lx,ly);
        textSize(13);
        text(planetInfo[planetID].type, lx,ly+20);
        //var returnText = (planetInfo[planetID].mass).split("\n");
        //for (var i = 0; i < returnText.length; i++){
            text("Mass:\n"+planetInfo[planetID].mass, lx,ly+50);
        //}
        text("Surface Gravity:\n"+planetInfo[planetID].gravity, lx, ly+110);
        if (planetID === 9){
            text("Planets:\n"+planetInfo[planetID].moons,lx,ly+160);
            text("Sun to Center of Milky Way:\n 100,000 light years",lx,ly+200);
        } else {
            text("Planetary Satellites:\n"+planetInfo[planetID].moons,lx,ly+160);
            text(planetDist(planetID,9),lx,ly+200,130,50);
            text(planetDist(planetID,2),lx,ly+240,130,50);
            var plYr = Math.round(year() + planet[planetID].a/360);
            text("Year:\n"+plYr,lx,ly+292);
        }
        rectMode(LEFT);
        textSize(12);
    }
};

var solarSys = function(mode){
    orbit();
    
    if(mode==="start"){
        locationX = stx/*350*/;
        locationY = sty+161/*161*/;
        t = 2;
        tilt = 0;
        zoom = 1;
    }
    //Sun
    fill(235, 242, 17);
    
    noStroke();
    //ellipse(locPX,locationY,20,20);
    
    for(var i=0; i<11; i++) {
        x[i] = -1.0*planet[i].d * zoom * cos(planet[i].a);    
        y[i] = -1.0*planet[i].d * zoom * sin(planet[i].a);
        realX[i] = -1.0*planet[i].d * cos(planet[i].a);
        realY[i] = -1.0*planet[i].d * sin(planet[i].a);
        fill(planet[i].c);
        if (i === 8){
            pushMatrix();
            x[i] = x[i] + locPX*zoom; 
            ellipse(locationX+x[i], locationY+y[i]*tilt, planet[i].s, planet[i].s);
            planet[i].a += t*(1.0/planet[i].y);
            popMatrix();
        } else if (i === 5){
        noFill();
        stroke(planet[i].c);
        var ringSize = 2;
        strokeWeight(2);
        ellipse(locationX+x[i],locationY+y[i]*tilt,ringSize*2.0*zoom,ringSize*2.0*zoom*tilt);
        strokeWeight(1.5);
        /******************/
        noStroke();
        fill(planet[i].c);
            ellipse(locationX+x[i], locationY+y[i]*tilt, planet[i].s, planet[i].s);
        planet[i].a += t*(1.0/planet[i].y);
            if (zoom<1){
            fill(255,255,255,100*zoom);
            ellipse(locationX+x[i], locationY+y[i]*tilt, planet[i].s*1.5/zoom, planet[i].s*1.5/zoom);
            }
        } else if (i === 9){
            x[i] = 0;
            y[i] = 0;
            ellipse(locationX+x[i], locationY+y[i]*tilt, planet[i].s, planet[i].s);
            fill(235, 242, 17,150*zoom);
            ellipse(locationX+x[i], locationY+y[i]*tilt, planet[i].s*1.5/(zoom*2), planet[i].s*1.5/(zoom*2));
        } else {
            fill(planet[i].c);
        ellipse(locationX+x[i], locationY+y[i]*tilt, planet[i].s, planet[i].s);
        planet[i].a += t*(1.0/planet[i].y);
        //planet[i].a %= 360;
        if (zoom<1){
            fill(255,255,255,100*zoom);
            ellipse(locationX+x[i], locationY+y[i]*tilt, planet[i].s*1.5/(zoom*2), planet[i].s*1.5/(zoom*2));
        }
        }
    }
    //Saturn to Sun + (Saturn to Neptune divided by 2) + Sun's Location = Pluto's orbit center
    //-890.7 + ((-890.7 + - 1787)/2) + 350
    
    //-890.7 + -1787 /2

    yr = year() + planet[2].a/360;
    mo = 1 + planet[2].a/30;
    
    var planetNames = function(){
         for(var i=0; i<11; i++) {
                    if (i===9){
                        text(planet[i].n, locationX+x[i]+planet[i].s/2,locationY+y[i]-planet[i].s/2);
                    } else{
                        text(planet[i].n, locationX+x[i],locationY+y[i]*tilt-5);                  
                    }
                }
    };
    
    if (keyIsPressed&&mode==="solarS"){
        fill(217, 217, 217);
        switch(key.toString()){
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
                for(var i=0; i<11; i++) {
                    if (zoom >= 0.1){
                        planet[i].s -= 0.05;
                    }
                }
                if (zoom >= 0.1){
                    zoom = zoom - 0.05;
                    planet[9].s -= 0.5;
                }
            break;
            case '=': 
                for(var i=0; i<11; i++) {
                    planet[i].s += 0.05;
                }
                zoom = zoom + 0.05;
                planet[9].s += 0.5;
            break;
            case ',': 
                //if (t >= 0.05){
                    t -= 0.05;
                //}
            break;
            case '.': 
                t += 0.05;
            break;
            case '/':
                t = 0.05;
            break;
            case 'm':
                t = 0;
            break;
            case 'w':
                tilt += 0.01;
                if(tilt >= 1.0) {
                    tilt = 1.0;
                }
            break;
            case 'a':
                for(var i=0; i<9; i++) {
                    planet[i].a -= 1;
                }
            break;
            case 's':
                tilt -= 0.01;
                if(tilt <= 0) {
                    tilt = 0.0;
                }
            break;
            case 'd':
                for(var i=0; i<9; i++) {
                    planet[i].a += 1;
                }
            break;
            case '1':
                locationX = -x[0]+(JSx);
                locationY = -y[0]*tilt+(JSy);
                planetNames();
                planetDesc(0);
            break;
            case '2':
                locationX = -x[1]+(JSx);
                locationY = -y[1]*tilt+(JSy);
                planetNames();
                planetDesc(1);
            break;
            case '3':
                locationX = -x[2]+(JSx);
                locationY = -y[2]*tilt+(JSy);
                planetNames();
                planetDesc(2);
            break;
            case '4':
                locationX = -x[3]+(JSx);
                locationY = -y[3]*tilt+(JSy);
                planetNames();
                planetDesc(3);
            break;
            case '5':
                locationX = -x[4]+(JSx);
                locationY = -y[4]*tilt+(JSy);
                planetNames();
                planetDesc(4);
            break;
            case '6':
                locationX = -x[5]+(JSx);
                locationY = -y[5]*tilt+(JSy);
                planetNames();
                planetDesc(5);
            break;
            case '7':
                locationX = -x[6]+(JSx);
                locationY = -y[6]*tilt+(JSy);
                planetNames();
                planetDesc(6);
            break;
            case '8':
                locationX = -x[7]+(JSx);
                locationY = -y[7]*tilt+(JSy);
                planetNames();
                planetDesc(7);
            break;
             case '9':
                locationX = -x[8]+(JSx);
                locationY = -y[8]*tilt+(JSy);
                planetNames();
                planetDesc(8);
            break;
            case '0':
                locationX = -x[9]+(JSx);
                locationY = -y[9]*tilt+(JSy);
                planetNames();
                planetDesc(9);
            break;
        }
    }
    
};

var keyHelp = function(key, desc, x, y){
    for (var i = 0; i < key.length; i++){
        var width=50;
        x+=width+10;
        fill(0, 0, 0);
        stroke(135, 135, 135);
        rect(x, y, 50,50, 5);
        fill(135, 135, 135);
        textAlign(CENTER,CENTER);
        textSize(20);
        text(key[i], x+25,y+25);
        textSize(10);
        text(desc[i], x+25,y+-9);
        textSize(12);
        textAlign(LEFT,LEFT);
    }
};
    
    var rand = Math.floor((Math.random() * 18) + 0);
var start = function(){
    var splash = [planetDist(2,9),"10,000 miles in 1 pixel!","LOL","In a galaxy, not far enough, there was the solar system.","Solar System!","\"Great way to visualize the Solar System\"","JavaScript + JS Processing","Keyboard Compatible!","Khan Academy!","Try it!","It's 100% free","90% bug-free","Solar Experience ToolKit","Second Generation","Mobile Compatible","BitBucket Project","Version 2 x 1.05","Just another high-tech simulator!"];
    var fc = 0;
    textSize(30);
    textAlign(CENTER,CENTER);
    fill(61, 61, 61,150);
    rectMode(CENTER);
    rect(stx,sty,375,230,5);
    fill(255, 255, 255);
    text("Solar System²", stx,sty-70);
    textSize(15);
    var stopw = 1;
    text(splash[rand],stx,sty+89);
    var startbtn = new button(stx,sty-20,375,40,color(61,61,61,150),0,"rect","Start");
    startbtn.draw();
    if (mouseIsPressed && startbtn.mouseIn){
        scene = "solarS";
        locationX = JSx;
        locationY = JSy;
        t = 0.05;
        tilt = 0.3;
        zoom = 1.0;
    }
    if (keyIsPressed && key.toString() === 'r'){
        Program.restart();
    }
};

    var keysLocX = 0;
//playSound(getSound("retro/coin"));
var data = function(){
    if (keyIsPressed && key.toString() === ']'){
        keysLocX -= 2;   
    } else if (keyIsPressed && key.toString() === '['){
        keysLocX += 2;
    }
    rectMode(RIGHT);
    fill(135, 135, 135);
    var showDataY = JSheight-200;
    //text(planetDist(5,4),20,showDataY-20);
    //stroke(227, 227, 227);
    //line(x[5]+locationX,y[5]*tilt+locationY,x[4]+locationX,y[4]*tilt+locationY);
    text("Date: "+Math.round(yr)+" (Example)",20,showDataY+60);     
    text("Zoom: "+Math.round(zoom),20,showDataY+20);
    text("Speed: x"+Math.round(t),20,showDataY+40);
    text("Tilt: "+Math.round(tilt*90)+"°",20,showDataY);
    text("Graph: "+Math.round(locationX) +", "+Math.round(locationY),20,showDataY+80);
    var moX = mouseX + locationX -350;
    var moY = mouseY + locationY -350;
    text("Mouse: "+Math.round(moX) +", "+ Math.round(moY),20,showDataY+100);
    keyHelp([
        "W",
        "S",
        "C",
        "R",
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
        ],[
        "Yaw Up",
        "Yaw Down",
        "Center",
        "Restart",
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
        ],-33+keysLocX,JSheight-71);
        textAlign(CENTER,CENTER);
    text("Use arrow keys to move around", 230,JSheight-98);
    text("Use numbers to locate planets (Ex: 1 is Mercury)",500,JSheight-98);
    textSize(30);
    text("Solar System²", JSx,20);
    textSize(12);
    textAlign(LEFT,LEFT);
    /*if(keyCode){
        switch(key.toString()){
            case 'q':
                orbit();
            break;
        }
    }*/
    if(keyIsPressed){
        switch(keyCode){
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
        switch(key.toString()){
            case 'c':
                locationX = 350;
                locationY = 350;
            break;
            case 'r':
                Program.restart();
            break;
            
        }
    }
    mouseDragged = function(){
        locationX = mouseX;
        locationY = mouseY;
    };
    textSize(12);
};

var starsBack = function(){
    for (var i = 0; i<100; i++){
        fill(255, 255, 255);
        //point(10*i*zoom/2+locationX,10*i*zoom/2*(tilt)+locationY);
        pushMatrix();
        /*var scattered = (Math.random()*i)+1;
        point(i+scattered,scattered+i);*/
        popMatrix();
    }
};

var scenePr = function(){
    switch(scene){
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

draw = function() {
    background(0, 0, 0);
    scenePr();
};
