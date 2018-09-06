# HandscrollViewer-OpenSeadragon-Extension

The HandscrollViewer-OpenSeadragon-Extension project implements a high level API specifically for viewing Asian handscrolls. The API is implemented in a javascript class __HandscrollViewer__ that extends the OpenSeadragon image viewer class.  See <http://openseadragon.github.io/>.

Asian handscrolls are very wide paintings normally viewed from the right edge to left edge as the scroll is unrolled. The major use case for the HandscrollViewer class is pedagogical, and as such special features such as annotations and auto scroll display are included.

<https://scrolls.uchicago.edu> is a popular public website that uses the HandscrollViewer class to display high resolution Asian scroll images.

A __simple demonstration website__ referenced in the following documentation is located at `demo/HandscrollViewerDemo1.html` in this project. Clone or download the project to your local computer.  Open `HandscrollViewerDemo1.html` in your browser. 




# Features of the HandscrollViewer

* Standardized user interface including custom buttons and navigation control

* Optional annotations can be added and controlled for specific images

* Initial display and Home start at right edge of the image (per handscroll tradition)

* Horizontal auto scroll with custom scroll speed control

* Image and annotation information specified in separate metadata for ease of updating

* Standard OpenSeadragon functionality (zoom in and out, image drag, etc.) are fully available


### Demo website

A __simple demonstration website__ referenced in the following documentation is located at `demo/HandscrollViewerDemo1.html` in this project. Clone or download the project to your local computer.  Open `HandscrollViewerDemo1.html` in your browser. 

![top of demo site image](./readme-images/top-of-demo-site-image.png)
<sup><sup>screenshot of a scroll view at the top of the demo site page<sup><sup>


Control buttons and navigation control are in the upper left corner of the view window. When the mouse moves off the view, the controls fade out of view.

__Custom control buttons__ added beyond standard OpenSeadragon buttons include the following:

![hide controls button](./readme-images/hide-controls-button-image.png) This button hides all the control buttons and navigation control image even if the mouse is over the scroll image. This feature is especially useful when viewing in full screen mode.

![home button](./readme-images/home-button-image.png) The home button functionality has be changed reset the current view to the right edge of the scroll image, rather than the center of the image. The right edge of the scroll image is the traditional starting view position.

![hide annontations button](./readme-images/hide-annotations-button-image.png) ![show annotations button](./readme-images/show-annotations-button-image.png) The annotation display can be toggled on and off.

![auto right left button](./readme-images/auto-scroll-right-button-image.png) Auto scroll the scroll image view to the right.  

![auto scroll left button](./readme-images/auto-scroll-left-button-image.png) Auto scroll the scroll image view to the left.

__Custom navigation control image__ operates as in normal OpenSeadragon viewer. The hight of the navigation control image is fix at readable value with its width varying based on the aspect ration of the scroll image. This eliminates the problem of the navigation control image being so thin it is unusable.















