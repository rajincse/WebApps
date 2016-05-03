/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var Color =function (red, green, blue)
{
    this.red = red;
    this.green = green;
    this.blue = blue;
    
    
}
Color.DEFAULT_COLOR_SCHEME=[new Color(255,255,255), new Color(0,255,0), new Color(255,255,0), new Color(255,0,0)];
Color.prototype.getColorString = function()
{
    var redString='00'+this.red.toString(16);
    redString =redString.substr(redString.length-2,2);
    var greenString='00'+this.green.toString(16);
    greenString =greenString.substr(greenString.length-2,2);
    var blueString='00'+this.blue.toString(16);
    blueString =blueString.substr(blueString.length-2,2);
    return '#'+redString+greenString+blueString;
};
Color.getColorFromType = function(obj)
{
    var c=new Color(250,150,250);
    if(obj.type === 1)
    {
        c = new Color(250,200,200);
    }
    else if(obj.type === 2)
    {
        c = new Color(200,250,200);
    }
    else if(obj.type === 3)
    {
        c = new Color(200,200,250);
    }
    else if(obj.type === 4)
    {
        c = new Color(250,250,150);
    }
    
    return c;
};

Color.getColorFromRange = function(range, p)
{
    if (p > 0 && p < 0.3)
            p = 1*p;
    else if ( p > 0.35 && p < 0.6)
            p = 1*p;
    else p = 1*p;

    var c1={};
    var c2={};
    var intervalSize = 1./(range.length-1);
    //find the two colors
    for (var i=0; i<range.length; i++){
            if (p >= i* intervalSize && p<=(i+1)*intervalSize){
                    c1 = range[i];
                    c2 = range[i+1];
                    p = (p - i*intervalSize) / intervalSize;
                    break;
            }
    }

    var c = new Color(c1.red + (p*(c2.red-c1.red)),
                        c1.green + (p*(c2.green-c1.green)),  
                        c1.blue + (p*(c2.blue-c1.blue)));
    return c;
};