# How to draw a hex grid on HTML Canvas

In this article we are going to learn how to get a perfect hexagon grid using JavaScript to draw on a HTML canvas. We first need to know a bit of trigonometry to solve this problem as it is necessary for all the calculations for the coordinate points composing a regular polygon.

## Table of Contents
1. [The Basics](#the-basics)
2. [First Step: An Hexagon](#first-step-an-hexagon)
3. [Second Step: The Row](#second-step-the-row)
4. [Third Step: The Grid](#third-step-the-grid)


## The Basics

First of all, we introduce a regular hexagon that is composed of six equal sides.

<div style="text-align:center"><img src="https://eperezcosano.github.io/f6c3552346a2bee79f9d4f616143a811/hex.svg" alt="hexagon" width="150"/></div>

Any regular polygon can be inscribed within a circumference of radius **r**

<div style="text-align:center"><img src="https://eperezcosano.github.io/fb798448f4bb72e11b6f701141e6cf44/circumference.svg" alt="circumference" width="250"/></div>

So each of its vertex intersects with the circumference. Starting that the center of the circumference is the point of origin _(0,0)_ we can easily calculate the most-right and most-left vertex are _(**r**,&nbsp;0)_ and _(-**r**,0)_ respectively, however, what are the positions of the rest of the points? Here is where trigonometry comes into play.

Given any equilateral triangle, the following trigonometric functions applies:

<div style="text-align:center"><img src="https://eperezcosano.github.io/e1a78d00b463587772f7a422cd9cc181/trigo.svg" alt="trigonometry" width="250"/></div>

It is very useful to know any side of the triangle if you know one of its other sides and the angle it forms. For this case, the angle formed by each vertex with the horizontal axis is equal by dividing the circumference by the number of sides (360º&nbsp;/&nbsp;6&nbsp;=&nbsp;**60º**) and we also know that the hypotenuse is equal to the radius of the circumference **r**. From the first equation we can say that a&nbsp;=&nbsp;c&nbsp;*&nbsp;sinα and b&nbsp;=&nbsp;c&nbsp;*cosα. In resume, putting altogether the second vertex coordinates are _(**rcos60º**,**rsin60º**)_.

![](https://eperezcosano.github.io/e54179cfce3b7e01ada66b0ee7d3beb4/trigo2.svg)

Then the rest comes as a multiple of 60º as 120º, 180º, 240º, 300º and 360º which is equal to 0º again. Notice that the most-right and most-left vertex coincide what we have expected due to sin0º = 0, cos0º = 1, cos180º = -1 and sin0º = 0. These are the resulting vertex:

![](https://eperezcosano.github.io/8124cf09214dbaf0e8a7b3bacaab141b/trigo3.svg)

## First Step: An Hexagon

As this point we can start a new project to put in practice all we have seen. In a **index.html** file we set the minimum required fields for an HTML canvas:

```html
<!DOCTYPE HTML>
<html lang="en">
  <head>
  	<meta charset="UTF-8">
  	<title>HexGrid</title>
  </head>
  <body>
    <canvas id="canvas" width="800" height="500"/>
    <script src="main.js"></script>
  </body>
</html>
```
And a **main.js** file:
```javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function init() {}
init();
```
As far as we know, we are going to set up the angle and the size of the hexagon as constants. Notice the angles are needed to be expressed in radians (360º&nbsp;=&nbsp;2π&nbsp;rad)
```javascript
const a = 2 * Math.PI / 6;
const r = 50;
```
In order to draw a regular hexagon we define a function named _drawHexagon(x,y)_ being _x_ and _y_ the center point. We are going to use a path that allows to set the coordinates before drawing them and when finished we use _stroke()_ to draw only the border line. It is possible doing a _for loop_ to draw a line between each vertex so the result is as follows:
```javascript
function drawHexagon(x, y) {
  ctx.beginPath();
  for (var i = 0; i < 6; i++) {
    ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
  }
  ctx.closePath();
  ctx.stroke();
}
```
Before testing it, notice that the point _(0,0)_ in our canvas starts on the upper left corner, so in order to fit the drawing we need a minimum offset of **r**.
![](https://eperezcosano.github.io/e43e70506381d06f0d758f5d1ed8fd03/borders.svg)

### Result
https://codepen.io/eperezcosano/pen/eYJXzXK

## Second Step: The Row

Perfect! The next step is to draw a raw of hexagons, like that:

![](https://eperezcosano.github.io/7edc8cca90ccd1442481751622ce7a78/row.svg)

Essentially is important to know where is the next center going to be located to fit perfectly one to each other. First, notice how much horizontally is placed the purple arrow. It is a distance of the radius **r** plus a segment we already know as **rcos60º**. And same as vertically, a segment of **rsin60º** downwards. The procedure is always adding the same amount horizontally and alternating vertically.

The code that allows to draw the four hexagons showed before is:

```javascript
// 1st
x = r;
y = r;
drawHexagon(x, y);

// 2nd
x = x + r + r * Math.cos(a);
y = y + r * Math.sin(a);
drawHexagon(x, y);

// 3rd
x = x + r + r * Math.cos(a);
y = y - r * Math.sin(a);
drawHexagon(x, y);

// 4th
x = x + r + r * Math.cos(a);
y = y + r * Math.sin(a);
drawHexagon(x, y);
```

### Result
https://codepen.io/eperezcosano/pen/xxZBEwN

We need to find the pattern that will allow to made this scalable.
On one hand, _x_ could be written as a increment of:
```javascript
x = x + r + r * Math.cos(a);
```
That shortened is expressed as:
```javascript
  x += r * (1 + Math.cos(a));
```
On the other hand, _y_ is altering by adding or subtracting either is an even or an odd position:
```javascript
y = y + r * Math.sin(a); // Even position
y = y - r * Math.sin(a); // Odd position
```
How it could be written for a general case?
Let's assign a new variable _j_ that increases just as it does the position we are in. If we use this mathematical trick, we can do like an if-statement for alternating either is an even or an odd number:
```
(-1) ** j = -1 when j is odd
(-1) ** j = 1 when j is even
```
That is exactly what we are looking for! Let's wrap in altogether, and _y_ is expressed for every iteration as:
```javascript
j++;
y = y + (-1) ** j * r * Math.sin(a);
```
That shortened is expressed as:
```javascript
y += (-1) ** j++ * r * Math.sin(a);
```
Finally we arrived at the solution how to draw many hexagons in a row as we want. We define a function named _drawGrid(width,height)_ that prints what we just explained up to this point:
```javascript
function drawGrid(width, height) {
  let y = r;
  for (let x = r, j = 0; x + r * (1 + Math.cos(a)) < width; x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)) {
    drawHexagon(x, y);
  }
}
```
Notice we want that the next hexagon we are going to draw fits inside the canvas. Let's test it out.

### Result
https://codepen.io/eperezcosano/pen/XWXGKwP

## Third Step: The Grid

That is it! We are just one step away from success. All we need is to repeat the same procedure but in the row below repeatedly. But, how much lower it is from the original row? Let's find it out:

![](https://eperezcosano.github.io/c92173d5dbbc6b8061598818d253339e/column.svg)

This would be a final scheme of our grid, showing the first four centers of each row to get a good view what is going on. From the center _(0,0)_ we can see that the blue arrow takes a distance of twice the length of the hexagon height that sums up to **2rsin60º**. The rest is going to be the same taking into account this offset. We modify our function to draw many lines as the last hexagon fits in the canvas height.

```javascript
function drawGrid(width, height) {
  for (let y = r; y + r * Math.sin(a) < height; y += r * Math.sin(a)) {
    for (let x = r, j = 0; x + r * (1 + Math.cos(a)) < width; x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)) {
      drawHexagon(x, y);
    }
  }
}
```
Let's put altogether and try it out!

### Result
https://codepen.io/eperezcosano/pen/vYLPXYO
