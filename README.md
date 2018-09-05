# HandscrollViewer-OpenSeadragon-Extension

The HandscrollViewer-OpenSeadragon-Extension project implements a high level API specifically for viewing Asian handscrolls. The API is implemented in a javascript class [HandscrollViewer](./scr/handscrollviewer1.ts) that extends the OpenSeadragon image viewer class.  See <http://openseadragon.github.io/>.

Asian handscrolls are very wide paintings normally viewer from right edge to left as the scroll is unrolled. The major use case for the HandscrollViewer class is pedagogical, and as such special features such as annotations and auto scroll display are included.

<https://scrolls.uchicago.edu> is an example of public website that uses the HandscrollViewer class to display high resolution Asian scroll images.


# Features of the HandscrollViewer

* Standardized user interface including custom buttons and navigation control

* Optional annotations can be added and controlled to specific images

* Initial display and Home start at right edge of the image (per handscroll tradition)

* Horizontal auto scroll with custom scroll speed control

* Image and annotation information specified in separate metadata for ease of updating

* Standard OpenSeadragon functionality (zoom in and out, image drag, etc.) are fully implemented


