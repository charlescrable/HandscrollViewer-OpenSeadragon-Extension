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

The `DZIImages` directory contains the DZI image folders of the scroll images available to the current website.

The `buttonImages` directory contains the custom button images needed by HandscrollViewer.  __Note: the location of the custom button images is specified in the HandscrollViewer public property `prefixScrollUrl`.__


### Including Files and Folders Needed by HandscrollViewer

Below is example code from the demonstration website that javascript and data files for HandscrollViewer:

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

The two comparison viewer DIVs at the bottom of the demonstration page is shown below:

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



### `siteDziImages` DZI Images Metadata Objects Array



### `siteAnnotations` Annotations Metadata Objets Array



### DZI Image Notes


































