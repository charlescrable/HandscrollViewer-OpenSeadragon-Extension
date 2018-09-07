# HandscrollViewer-OpenSeadragon-Extension

The HandscrollViewer-OpenSeadragon-Extension project implements a high level API specifically for viewing Asian handscrolls. The API is implemented in a javascript class __HandscrollViewer__ that extends the OpenSeadragon image viewer class.  See <http://openseadragon.github.io/>.

Asian handscrolls are very wide paintings normally viewed from the right edge to left edge as the scroll is unrolled. The major use case for the HandscrollViewer class is pedagogical, and as such special features such as annotations and auto scroll display are included.

<https://scrolls.uchicago.edu> is a popular public website that uses the HandscrollViewer class to display high resolution Asian scroll images.

A __simple demonstration website__ referenced in the following documentation is located at `demo/HandscrollViewerDemo1.html` in this project. Clone or download the project to your local computer.  Open `HandscrollViewerDemo1.html` in your browser. 




# Features of the HandscrollViewer

* Standardized user interface including custom buttons and navigation control

* Optional annotations can be added and controlled for specific images

* Initial display and Home start at the right edge of the image (per handscroll tradition)

* Horizontal auto scroll with custom scroll speed control

* Annotation creation aides are included

* Image and annotation information are specified in separate metadata for ease of updating

* Standard OpenSeadragon functionality (zoom in and out, image drag, full screen mode, etc.) are fully available



### Demo website

A __simple demonstration website__ referenced in the following documentation is located at `demo/HandscrollViewerDemo1.html` in this project's folder'. Clone or download the project to your local computer.  Open `HandscrollViewerDemo1.html` in your browser. 

![top of demo site image](./readme-images/top-of-demo-site-image.png)
<sup><sup>Screenshot of a scroll view at the top of the demo site page<sup><sup>


Control buttons and the navigation control are in the upper left corner of the view window. When the mouse moves off the view, the controls fade out of view.

__Custom Control Buttons__ added in addition to standard OpenSeadragon buttons include the following:

![hide controls button](./readme-images/hide-controls-button-image.png) This button hides all the control buttons and the navigation control image even if the mouse is over the scroll image. This feature is especially useful when viewing in full screen mode.

![home button](./readme-images/home-button-image.png) The home button resets the current view to the right edge of the scroll image. Traditionally handscroll viewing starts at the right edge. In standard OpenSeagragon the home button resets the view to the horizontal center of the image.

![hide annontations button](./readme-images/hide-annotations-button-image.png) ![show annotations button](./readme-images/show-annotations-button-image.png) The annotation display can be toggled on and off.

![auto right left button](./readme-images/auto-scroll-right-button-image.png) Auto scroll the scroll image view to the right.  

![auto scroll left button](./readme-images/auto-scroll-left-button-image.png) Auto scroll the scroll image view to the left.

Note: auto scrolling is useful in teaching or presentation situations.

The __Custom Navigation Control Image__ operates as in a standard OpenSeadragon viewer. What differs here is the height of the navigation control image is fix at a readable height, and the width varies based on the aspect ratio of the scroll image. This eliminates the problem of the navigation control image being so thin it is unusable.

Annotations are implemented as a title area that when clicked toggles display the full text of the annotation.




# HTML Implementation of HandscrollViewer Windows

Refer to the files in the `demo/`directory of this project. 

The following files should be viewed in a text or program editor:

```
HandscrollViewerDemo1.html

HandscrollViewerDemo1DziImages.js

HandscrollViewerDemo1Annotations.js
```

`HandscrollViewerDemo1.html` is the HTML file demonstration web page which contains three HandscrollViewer Windows.
`HandscrollViewerDemo1DziImages.js` defines the array of image metadata objects which define the scroll images available to the current website. 
`HandscrollViewerDemo1Annotations.js` defines the array of annotation metadata objects which define the annotations available to the images in the current website.


The website implementation also depends on the following directories:

```
openseadragon-bin-2.2.1

DZIImages

buttonImages
```

The `openseadragon-bin-2.2.1` directory contains OpenSeadragon javascript code and data needed by HandscrollViewer.  __Note: this version of OpenSeadragon is the only version tested with HandscrollViewer.__

The `DZIImages` directory contains the DZI image folders of the scroll images available in the demonstation website.

The `buttonImages` directory contains the custom button images needed by HandscrollViewer.  __Note: the location of the custom button images is specified in the HandscrollViewer public property `prefixScrollUrl`.__



### Including Files and Folders Needed by HandscrollViewer

Below is the HTML code from the demonstration website that includes the javascript and data files for HandscrollViewer:

```

<!-- include openseadragon js library -->
<script src="./openseadragon-bin-2.2.1/openseadragon.js"></script>

<!-- include handscrollviewer1 js library AFTER openseadragon js library  -->
<script src="./handscrollviewer1.js"></script>

<!-- include js array of DZI image objects for this website  -->
<script src="./HandscrollViewerDemo1DziImages.js"></script>

<!-- include js array of annotation objects for this website  -->
<script src="./HandscrollViewerDemo1Annotations.js"></script>

```



### Defining DIV areas for HandscrollViewer Windows

Three DIV areas for HandscrollViewer windows are defined in the demonstration website page. Each viewer DIV has a unique `id`.

The single viewer DIV at the top of the page is shown below:

```

<!-- handscrollviewer-1-div scroll viewer div -->
<div id="handscrollviewer-1-div">
</div>

```

The two comparison viewer DIVs at the bottom of the demonstration page are shown below:

```

<!-- handscrollviewer-2-div scroll viewer div -->
<div id="handscrollviewer-2-div">
</div>

<!-- vertical separator div -->
<div id="vertical-separator-div">
</div>

<!-- handscrollviewer-3-div scroll viewer div -->
<div id="handscrollviewer-3-div">
</div>

```



### Instantiating the HandscrollViewer Windows

The three HandscrollViewer windows in the demonstration page are instantiated as shown below:


```

<script>
var demoHandscrollViewer1;
var demoHandscrollViewer2;
var demoHandscrollViewer3;

window.onload = function() {

// instantiate the three scroll viewers in the test website,
// last viewer instantiated gets focus

demoHandscrollViewer2 = new HandscrollViewer("7137966", "handscrollviewer-2-div");

demoHandscrollViewer3 = new HandscrollViewer("10000104", "handscrollviewer-3-div");

demoHandscrollViewer1 = new HandscrollViewer("728363", "handscrollviewer-1-div");

// set auto scroll speed to fastest (1.0 slowest, 10.0 fastest, default 2.0) for top viewer
demoHandscrollViewer1.setAutoScrollSpeedSetting(10.0);

.
.
.

```

Three variables are created to reference the three HandsrollViewer objects that will be created.

On the `window.onload` event the three HandscrollViewer windows are created using the HandscrollViewer class constuctor method.

The constructor method takes two parameters: the __scroll image id__ string and the __viewer DIV id__ string.

The __scroll image id__ identifies a DZI image metadata object in the `siteDziImages` array defined in the included HandscrollViewerDemo1DziImages.js file. 

The __viewer DIV id__ indentifies the viewer DIV area in the current page where the viewer should be located.


Note: the `setAutoScrollSpeedSetting(10.0)` method called in the demonstration website resets the auto scroll speed.  The auto scroll speed can be set to any number value between 1 and 10.  1 is the slowest and 10 is the fastest.  The default speed is 2.

Note: the last HandscrollViewer instantiated receives focus.



### DZI Images Metadata Objects Array `siteDziImages`

The HanscrollViewer class requires that an array of DZI image metadata object literals exist referenced by a variable named `siteDziImages`.  Each DZI image metadata object literal defines the necessary information about each scroll image that can be displayed in the current website.

In the demonstration website the `siteDziImages` array is defined in the HandscrollViewerDemo1DziImages.js file.  The beginning of the array is shown below:

```
var siteDziImages =    [
//  siteDziImages array of DZI image objects for HandscrollViewerTest1.html site
{
// Views of Huqiu 虎丘圖卷
Id: "728363",                       // scroll id string
Url: "./DZIImages/728363_files/",   // scroll DZI image folder url
Height: "2724",                     // scroll height in pixels
Width: "37098",                     // scroll width in pixels
},
{
// Illustrated Scroll of the Nocturnal Procession of One Hundred Goblins 百鬼夜行絵巻
Id: "7137966",
Url: "./DZIImages/7137966_files/",
Height: "2816",
Width: "63978",
},

.
.
.

```

Each DZI image object contains four properties as describe below:

* `Id` a unique string the identifies the DZI image of a scroll.  Used by HandscrollViewer to specify a unique scroll image to display.

* `Url` a url string the specifies the location of the scroll's DZI image directory. The url can be a relative or or absolute address. 

* `Height` the height in number of pixels of the scroll image. Must be correct for the image to be displayed properly.

* `Width` the width in number of pixels of the scroll image. Must be correct for the image to be displayed properly.



### Annotations Metadata Objets Array `siteAnnotations`

The HanscrollViewer class requires that an array of annotation metadata object literals exist referenced by a variable named `siteAnnotation`. Each annotation metadata object literal defines the necessary information to display an annotation for given. Each scroll image, identified by a scroll image id, that has annotations will have an array of annotation objects. 

The scroll image id in the `siteAnnotations` array should match the scroll image id in the `siteDziImages` array.

If a scroll image does not have any annotations an entry the `siteAnnotations` array DOES NOT have to exits.  If none of the scroll images in the website have annotations, then `siteAnnotations` can refer to an emply array.

In the demonstration website the `siteAnnotations` array is defined in the HandscrollViewerDemo1Annotations.js file.  The beginning of the array is shown below:

```
var siteAnnotations =   [
{
// Landscape (after Huang Gongwang) 臨大痴山水 annotations

Id: "728345",               // scroll id string
imageAnnotations:           // imageAnnotations array of annotation objects
[
{
x: 0.939098,            // x and y OpenSeadragon viewport coordinates
y: 0.004251,            // of the upper right corner of annotation display
title: "Frontpiece",
text: "At the beginning of the handscroll, a title sheet prefaces the painting. The large characters 'hen gu 恨古' can be translated as 'longing for the past.' The first seal that appears on the far right of the scroll is 'ji tang 霽堂.'"
},
{
x: 0.919804,
y: 0.025577,
title: "Calligrapher Signature",
text: "The smaller characters at the end of the title sheet are the signature of the calligrapher Zhou Eryan 周而衍. The signature is written in a very cursive style, but the name can be deciphered through the calligraphers seal on the right. The bottom seal reads donghui 東會."
},

.
.
.

```

Each scroll image above with annotations has an `Id` property followed by an array named `imageAnnotations` of annotation object literals.

An annotation object defines a single annotation located on a scroll image.  Each annotation object contains for properties as described below:

* `x` x coordinate in OpenSeadragon viewport coordinates of the upper right hand corner of the annotation.

* `y` x coordinate in OpenSeadragon viewport coordinates of the upper right hand corner of the annotation.

* `title` title text of the annotation.

* `text` body text of the annotation.



### Annotation Creation Aide



### DZI Image Notes


































