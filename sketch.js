// Options for map
const options = {
  lat: 40.73447,
  lng: -74.00232,
  zoom: 12,
  style: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
}
let font;
let data;
const mappa = new Mappa('Leaflet');
let myMap;
let canvas;
let m =0;
let colors=["#5DAC81","#FFC408AA","#FC9F4DAA","#E83015AA"];
let safetylevel=['safe','low','fair','high'];
let c= "#ffffff";
let tripcoordsX,tripcoordsY,coords,date,img,scale;
let volume=0;
function preload(){
  data=loadJSON('files/sanitizing.json');
  font = loadFont("font/VT323-Regular.ttf");
  img= loadImage('assets/sanitizer.png');
}
function setup() {
  canvas = createCanvas(640, 580);
//textSize(10);
  noStroke();
  stroke(255);
  fill(255);
  textFont(font,20);
//  textAlign(CENTER);
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
  // index =0;
  scale=1;

  setInterval(switchData,3000);
  //ellipseMode(CENTER);

}

function draw() {
//  drawRoute();
  // scale=map(volume,0,15,0.1,2);

  //console.log(scale);
  fill(255);
  noStroke();
  textSize(20);
  text("How Much Sanitizer Did I Use in the Past Seven Days?",50,500);
//  index =volume;
  for(let i =0;i<volume;i++){
    image(img,50+25*i,400,25,50);
    text("x"+volume+" times",50,480);

  }
  let index =0;

  while(index<safetylevel.length){
    push();
    translate(530,500);
    textSize(15);
    text('Safetylevel',0,-20);
    fill(colors[index]);
    text(safetylevel[index],0,index*15);
    ellipse(30,index*15,10,10);
    pop();
    index+=1;
  }
//  clear();



}
function switchData(){
  // print(m);
  clear();
  //

  volume=0;
  for(let i =0;i<data[m].Route.length;i++){

    tripcoordsX=data[m].Route[i].lat;
    tripcoordsY= data[m].Route[i].long;
    // console.log("Date: "+data[m].Date," x: "+tripcoordsX," y: "+tripcoordsY);
    const pos=myMap.latLngToPixel(tripcoordsX,tripcoordsY);
/*if used =0 save , green  1 yellow 2 orange 3 red*/
    // colors =
    let level = data[m].Route[i].sanitizer_used;
    volume=getSum(volume,level);

    switch (level) {
      case 0:
        c =colors[0];
        break;
      case 1:
        c = colors[1];
        break;
      case 2:
        c =colors[2];
        break;
      case 3:
        c =colors[3];
        break;
      default:

    }
    let r = data[m].Route[i].sanitizer_used*5+10;
    let locations = data[m].Route[i].loc;
  //  console.log(c);

    fill(c);
    noStroke();
    ellipse(pos.x,pos.y,r);
    textSize(10);
    text(locations,pos.x-20,pos.y+20);
  }
  noStroke();
  // stroke(255);
  //fill(255);
  textSize(20);
  date = data[m].Date;

  text("Date: "+date,500,100);
  for(let i =0;i<data[m].Route.length;i++){
      textSize(15);
      text('Route:',50,80);
      fill(c);
      text(i+1+". "+data[m].Route[i].loc,50,100+15*i);
  }
  drawRoute();
  if(m>5){
    m=0;
  }else{
    m+=1;
  }
  console.log(volume);

//  console.log("m:"+m,data[m].Route.length);
}

function drawRoute(){
  let routeNum=0;

  noFill();
  beginShape();
  while(routeNum<data[m].Route.length){
    let xpos=data[m].Route[routeNum].lat;
    let ypos= data[m].Route[routeNum].long;
    // console.log("Date: "+data[m].Date," x: "+tripcoordsX," y: "+tripcoordsY);
    const drawPos=myMap.latLngToPixel(xpos,ypos);
    console.log(drawPos);
    stroke(c);

    vertex(drawPos.x,drawPos.y);
    routeNum+=1;

  }
  endShape();

}
function getSum(total,num){
  return total+num;
}
