/** 
 * 
 * 
 *  HandscrollViewer class that extends the generic OpenSeadragon class.
 * 
 *  HandscrollViewer defines a standard viewer for East Asian scroll painting images.
 *
 *
 *  Requires /openseadragon-bin-2.2.1/openseadragon.js
 * 
 *  Requires siteDZImages array of DZI image objects available for the current website.
 * 
 *  Requires siteAnnotations array of annotation objects available for the current website's images.
 * 
 * 
 *  Author: Charles Crable, charlescrable@gmail.com
 * 
 *  Copyright © 2018 Charles Crable 
 * 
 */

/**
 * 
 *  Required externally defined OpenSeadragon object referenced by this HandscrollViewer class.
 * 
 *  Window.OpenSeadragon is automatically created when openseadragon.js is included in a website.
 * 
 */
var OpenSeadragon: any;     // references instantiated OpenSeadragon object

/**
 * 
 *  Required externally defined object referenced by this HandscrollViewer class.
 * 
 *  Window.siteDziImages must reference an array of DZI Image objects (see README.md) available to a website.
 *
 */
var siteDziImages: any;     // references array of DZI image objects available for the current website

/**
 * 
 *  Required externally defined object referenced by this HandscrollViewer class.
 * 
 *  Window.siteAnnotations must reference an array of annotation objects (see README.md) associated with a website's handsroll images.
 * 
 */
var siteAnnotations: any;   // references array of annotation objects available for the current website's images

/**
 *  Enumeration of horizontal auto scroll directions, either Left or Right
 */
enum Direction {
    Left = 1,
    Right = 2,
}

/**
 *  
 *  HandscrollViewer class represents an image viewer, extending the generic OpenSeadragon viewer class.
 * 
 *  HandscrollViewer is designed specifically for viewing East Asian handscoll painting images.
 * 
 *  Extended features include:
 *  
 *  * Standardized user interface including custom buttons and navigation control

 *  * Optional annotations can be added and controlled for specific images

 *  * Initial display and Home start at right edge of the image (per handscroll tradition)

 *  * Horizontal auto scroll with custom scroll speed control

 *  * Image and annotation information are specified in separate metadata for ease of updating

 *  * Standard OpenSeadragon functionality (zoom in and out, image drag, full screen mode, etc.) are fully available
 * 
 */
class HandscrollViewer 
{
    //  Properties of the HandscrollViewer class that extends OpenSeadragon

    /** OpenSeadragon viewer object instantiated for the current image, set in the constructor */
    private viewer: any = null; 

    /** Scroll id of the current image, set in the constructor from passed parameter */
    public  currentScrollId: string = "";

    /** Index of the current image in the siteDziImages array, set in the constuctor based on passedScrollId parameter */   
    public  currentImageIndex: number = 0;               
    
     /** Relative path to custom button images, set to a value appropriate for your website */      
    public  prefixScrollUrl = "./buttonImages/";            // for github demonstration website
    // public  prefixScrollUrl = "/themes/contrib/d8_scrolls_nexus/assets/js/scrollsview-1.0/buttonImages/";   // for scrolls.uchicago.edu site
    
    /** Current auto horizontal scroll direction  */
    public autoHorizontalScrollDirection: number = Direction.Left;

    /** Is auto scroll paused? flag */
    public isAutoScrollPaused: boolean = true;
    
    /** Previous time of last auto scroll movement update */
    private prevTime: number = null;
    
    /** Are control buttons and navigation area hidden? flag */
    public areControlsHidden: boolean = false;
  
    /** Test annotation div overlay exists? flag */
    private testDivOverlayExists: boolean = false;

    /** Hide annotation OpenSeadragon.Button object */ 
    private hideAnnotationsOpenSeadragonButton: any = null;

    /** Show annotation OpenSeadragon.Button object */
    private showAnnotationsOpenSeadragonButton: any = null;

    /** Start auto scroll right OpenSeadragon.Button object */
    private autoScrollRightOpenSeadragonButton: any = null;

    /** Stop auto scroll right OpenSeadragon.Button object */
    private stopAutoScrollRightOpenSeadragonButton: any = null;

    /** Start auto scroll left OpenSeadragon.Button object */
    private autoScrollLeftOpenSeadragonButton: any = null;

    /** Stop auto scroll left OpenSeadragon.Button object */
    private stopAutoScrollLeftOpenSeadragonButton: any = null;

    /** Auto scroll speed setting
     * 
     *  Number between 1.0 and 10.0 inclusive, with 1.0 the slowest and 10.0 the fastest auto scroll.
     * 
     *  Default setting is 2.0.
     * 
     */
    private autoScrollSpeedSetting: number = 2.0;  

    /** Hide viewer controls HTML buttom element */
    private hideControlsElement: any = null;

    /** Hide viewer controls OpenSeadragon.Control object */
    private hideControlsOpenSeadragonControl: any = null;

    /** Show viewer controls HTML buttom element */
    private showControlsElement: any = null;

    /** Show viewer controls OpenSeadragon.Control object */
    private showControlsOpenSeadragonControl: any = null;

    /** Are annotations loaded for current image? flag */
    public areAnnotationsLoaded: boolean = false; 

    /** Are annotations visible? flag */
    public areAnnotationsVisible: boolean = true;

    /**
     *  
     *  Standard OpenSeadragon options object literal with default settings for this HandscrollViewer object.
     * 
     *  handscrollViewerOptions is passed as a parameter to the OpenSeadragon class constructor.
     * 
     */
    private handscrollViewerOptions =                                     
    {
        /** Reset by HandscrollViewer constructor based on passed passedSeadragonDivId parameter */
        id: "openseadragon1", 
    
        /** Default location of standard OpenSeadragon images */
        prefixUrl: "./openseadragon-bin-2.2.1/images/",
    
        navigationControlAnchor: OpenSeadragon.ControlAnchor.TOP_LEFT,
        showNavigator: true,
        navigatorPosition: 'ABSOLUTE',      // set to absolute position to the right of the control button in upper left corner
        navigatorTop: "3px",                // navigation control position and default size
        navigatorLeft: "320px", 
        navigatorHeight: "30px",   
        navigatorWidth: "500px",            // width of navigation contorl will be reset in constructor based on the aspect ratio of current image
        
        controlsFadeDelay: 0,               // no delay for controls fade when mouse moves off image window
        controlsFadeLength: 1000,           // controls fade out time 1 second
        
        homeFillsViewer: true,              // initial view and home view fits image to viewer
        minZoomImageRatio: 0.9,             // makes image fill 90% of viewport minimally
        visibilityRatio: 0.9,
        constrainDuringPan: false,
        
        tileSources:
        {
            Image: 
            {
                xmlns:    "http://schemas.microsoft.com/deepzoom/2008",
                Url:       siteDziImages[this.currentImageIndex].Url,       // reset by HandscrollViewer based on passedScrollId paramenter
                Format:    "jpeg",                                          // note: DZI images created with VIPS utility needs jpeg not jpg
                Overlap:   "1",                                             // standard value for DZI images created with VIPS utility
                TileSize:  "254",                                           // standard value for DZI images created with VIPS utility
                Size: 
                {
                    Height: siteDziImages[this.currentImageIndex].Height,   // reset in HandscrollViewer based on passedScrollId paramenter
                    Width:  siteDziImages[this.currentImageIndex].Width,    // reset in HandscrollViewer based on passedScrollId parameter
                }
            },
            overlays: [  ]         
        }
    };

    /**
     * 
     *  Constuctor for HandscrollViewer class. 
     * 
     *  HandscrollViewer class represents an image viewer, extending the generic OpenSeadragon viewer class.
     *  HandScrollViewer is designed specifically for viewing East Asian handscoll painting images.
     * 
     *  Takes 2 parameters and returns a HandscrollViewer object.
     *    
     *  Parameter __passedScrollId__ is the id of the DZI image object in the siteDziImages array to display.
     * 
     *  Parameter __passedOpenSeadragonDivId__ is the id of the HTML div tag in the current page where the interactive image viewer will be displayed.
     * 
     */
    constructor( passedScrollId: string, passedOpenSeadragonDivId: string) 
    {
        //  get index into siteDziImages array of the current DZI image object based on the passed scroll id
        this.currentScrollId = passedScrollId;      
        var imageArrayIndex = null;
        for (var i = 0; i < siteDziImages.length; i++)
        {
            if (siteDziImages[i].Id === passedScrollId)
            {
                imageArrayIndex = i;
                break;
                     
            }
        }
        //  save the image object index in siteDziImages
        this.currentImageIndex = imageArrayIndex;

        //  set the current DZI image folder url, and current image height and width in pixels
        this.handscrollViewerOptions.tileSources.Image.Url = siteDziImages[this.currentImageIndex].Url;
        this.handscrollViewerOptions.tileSources.Image.Size.Height = siteDziImages[this.currentImageIndex].Height;
        this.handscrollViewerOptions.tileSources.Image.Size.Width = siteDziImages[this.currentImageIndex].Width;
        
        //  save the passed seadragon div id 
        this.handscrollViewerOptions.id = passedOpenSeadragonDivId;
        
        //  create OpenSeadragon viewer object based on current scroll viewer options and save
        this.viewer = OpenSeadragon(this.handscrollViewerOptions);
        
        //  add OpenSeadragon event handler to this viewer for 'canvas-click' event
        //
        //  automatic behavior is to zoom in and center image at click point
        //
        //  NOTE: special case for 'canvas-click' while pressing the alt and control keys simultaneously
        //  alerts user with click point coordinates and displays test annotation at click location
        //  used only when adding annotation during website development
        this.viewer.addHandler('canvas-click', function(event) 
        {
            if (event.quick == true)
            {
                if (event.originalEvent.ctrlKey && event.originalEvent.altKey) 
                {
                    //  special case for click with ctrl and alt keys simultaneously pressed
                    //  display test annotation at click location and alert user with click point coordinates
                    //  used only during development for defining annotation and their locations
                    this.displayTestAnnotationLocation(event.position)                  
                }
                else 
                {
                    //  normal click behavior; zoom in and center at click location     
                    let viewportPoint = this.viewer.viewport.pointFromPixel(event.position);
                    
                    //  do not permit a viewportPoint y coordinate that is negative
                    if (viewportPoint.y < 0.0)
                    {
                        viewportPoint.y = 0.0;
                    }                                  
                    this.viewer.viewport.panTo(viewportPoint, false);
                    this.viewer.viewport.applyConstraints(false);
                }
            }
        }.bind(this));
        
        // Add OpenSeadragon event handler startup and 'home' button behavior
        //
        // After default behavior of scrolling to the center of the scroll image
        // then scroll to the right edge of the scroll image
        // finally add annotations if defined
        //
        // delay to allow default behavior to finish is set to 800 ms
        this.viewer.addHandler('home', function() 
        {           
            this.isAutoScrollPaused = true;         // stop auto scroll
            
            //  display left and right auto scroll buttons, hide auto scroll stop buttons
            this.stopAutoScrollLeftOpenSeadragonButton.element.style.display = "none";
            this.stopAutoScrollRightOpenSeadragonButton.element.style.display = "none";
            this.autoScrollLeftOpenSeadragonButton.element.style.display = "";
            this.autoScrollRightOpenSeadragonButton.element.style.display = "";
            
            //  wait 800 ms for default home behavior to finish 
            //  then do animated scroll to the right edge of the scroll image
            setTimeout(this.gotoRightEdge.bind(this), 800);
           
            //  wait 1500 ms then add annotations if needed
            setTimeout(this.addAllAnnotations.bind(this), 1500);            
        }.bind(this));
        
        //  start possible animation for auto horizontal scroll left or right
        //  callback method initiated with javascript requestAnimationFrame method
        //  frameAutoHorizontalScroll(timestamp) will be called immediately prior to a new frame being displayed
        requestAnimationFrame(this.frameAutoHorizontalScroll.bind(this));
    
        //  wait 800 ms for default home behavior to finish then move to right edge of image
        setTimeout(this.gotoRightEdge.bind(this), 800);

        //  add default and custom buttons, and navigation control to the upper left corner of view display 
        
        //  add shim div to the right of default OpenSeadragon buttons
        let shim1Element = this.buildShimDivElement();
        this.viewer.addControl(shim1Element, {anchor: OpenSeadragon.ControlAnchor.TOP_LEFT});
        
        //  add hide annotations toggle button
         this.hideAnnotationsOpenSeadragonButton = new OpenSeadragon.Button({
                                    srcRest: this.prefixScrollUrl + "annotationhide_rest.png",
                                    srcGroup: this.prefixScrollUrl + "annotationhide_grouphover.png",
                                    srcHover: this.prefixScrollUrl + "annotationhide_hover.png",
                                    srcDown: this.prefixScrollUrl + "annotationhide_pressed.png",
                                    tooltip: "Hide annotations",
                                    onRelease: this.hideAnnotationsToggle.bind(this),
        });
        this.viewer.addControl(this.hideAnnotationsOpenSeadragonButton.element, {anchor: OpenSeadragon.ControlAnchor.TOP_LEFT});
    
        //  add show annotations toggle button (display hide annotation button initially)
        this.showAnnotationsOpenSeadragonButton = new OpenSeadragon.Button({
                                    srcRest: this.prefixScrollUrl + "annotationshow_rest.png",
                                    srcGroup: this.prefixScrollUrl + "annotationshow_grouphover.png",
                                    srcHover: this.prefixScrollUrl + "annotationshow_hover.png",
                                    srcDown: this.prefixScrollUrl + "annotationshow_pressed.png",
                                    tooltip: "Show annotations",
                                    onRelease: this.hideAnnotationsToggle.bind(this),
        });        
        this.viewer.addControl(this.showAnnotationsOpenSeadragonButton.element, {anchor: OpenSeadragon.ControlAnchor.TOP_LEFT});
        this.showAnnotationsOpenSeadragonButton.element.style.display = "none";
        
        //  add shim div to right of show/hide annnotations button
        let shim2Element = this.buildShimDivElement();
        this.viewer.addControl(shim2Element, {anchor: OpenSeadragon.ControlAnchor.TOP_LEFT});
        
        //  add auto scroll right button
        this.autoScrollRightOpenSeadragonButton = new OpenSeadragon.Button({
                                    srcRest: this.prefixScrollUrl + "playright_rest.png",
                                    srcGroup: this.prefixScrollUrl + "playright_grouphover.png",
                                    srcHover: this.prefixScrollUrl + "playright_hover.png",
                                    srcDown: this.prefixScrollUrl + "playright_pressed.png",
                                    tooltip: "Auto scroll right",
                                    onRelease: this.autoScrollRightToggle.bind(this),
        });
        this.viewer.addControl(this.autoScrollRightOpenSeadragonButton.element, {anchor: OpenSeadragon.ControlAnchor.TOP_LEFT});
        
        //  add stop autoscroll right toggle button (display auto scroll right button initially)
        this.stopAutoScrollRightOpenSeadragonButton = new OpenSeadragon.Button({
                                    srcRest: this.prefixScrollUrl + "stop_rest.png",
                                    srcGroup: this.prefixScrollUrl + "stop_grouphover.png",
                                    srcHover: this.prefixScrollUrl + "stop_hover.png",
                                    srcDown: this.prefixScrollUrl + "stop_pressed.png",
                                    tooltip: "Stop autoscroll",
                                    onRelease: this.autoScrollRightStop.bind(this),
        });       
        this.viewer.addControl(this.stopAutoScrollRightOpenSeadragonButton.element, {anchor: OpenSeadragon.ControlAnchor.TOP_LEFT});
        this.stopAutoScrollRightOpenSeadragonButton.element.style.display = "none";
                           
        //  add auto scroll left toggle button
        this.autoScrollLeftOpenSeadragonButton = new OpenSeadragon.Button({
                                    srcRest: this.prefixScrollUrl + "playleft_rest.png",
                                    srcGroup: this.prefixScrollUrl + "playleft_grouphover.png",
                                    srcHover: this.prefixScrollUrl + "playleft_hover.png",
                                    srcDown: this.prefixScrollUrl + "playleft_pressed.png",
                                    tooltip: "Auto scroll left",
                                    onRelease: this.autoScrollLeftToggle.bind(this),
        });
        this.viewer.addControl(this.autoScrollLeftOpenSeadragonButton.element, {anchor: OpenSeadragon.ControlAnchor.TOP_LEFT});
        
        //  add stop autoscroll left toggle button (display auto scroll left button initially)
        this.stopAutoScrollLeftOpenSeadragonButton = new OpenSeadragon.Button({
                                    srcRest: this.prefixScrollUrl + "stop_rest.png",
                                    srcGroup: this.prefixScrollUrl + "stop_grouphover.png",
                                    srcHover: this.prefixScrollUrl + "stop_hover.png",
                                    srcDown: this.prefixScrollUrl + "stop_pressed.png",
                                    tooltip: "Stop autoscroll",
                                    onRelease: this.autoScrollLeftStop.bind(this),
        });       
        this.viewer.addControl(this.stopAutoScrollLeftOpenSeadragonButton.element, {anchor: OpenSeadragon.ControlAnchor.TOP_LEFT});
        this.stopAutoScrollLeftOpenSeadragonButton.element.style.display = "none";
        
        //  insert shim div at start of viewer control elements on the far left
        let shim0Element = this.buildShimDivElement();
        let shim0Control = new OpenSeadragon.Control(shim0Element, {autoFade:true, anchor:OpenSeadragon.ControlAnchor.TOP_RIGHT }, this.viewer.controls.topleft);
        
        //  insert hide controls div button at start of viewer control elements
        this.hideControlsElement = this.buildHideControlsDiv();
        this.hideControlsElement.addEventListener("click", this.hideControlsToggle.bind(this));
        this.hideControlsElement.title = "Hide controls";
        this.hideControlsOpenSeadragonControl = new OpenSeadragon.Control(this.hideControlsElement, {autoFade:false, anchor:OpenSeadragon.ControlAnchor.TOP_RIGHT }, this.viewer.controls.topleft);
        
        // insert show controls div at start of viewer control elements (display hide controls div button initially)
        this.showControlsElement = this.buildShowControlsDiv();
        this.showControlsElement.addEventListener("click", this.hideControlsToggle.bind(this));
        this.showControlsElement.title = "Show controls";
        this.showControlsOpenSeadragonControl = new OpenSeadragon.Control(this.showControlsElement, {autoFade:false, anchor:OpenSeadragon.ControlAnchor.TOP_RIGHT }, this.viewer.controls.topleft);
        this.showControlsOpenSeadragonControl.element.style.display = "none";
        
        //  adjust width of navigator control based on current image aspect ratio
        //  navigator position and height are defined in handscrollViewerOptions property above
        this.viewer.navigatorWidth = Math.floor(30.0 * (+siteDziImages[this.currentImageIndex].Width / +siteDziImages[this.currentImageIndex].Height))   + "px";    
        this.viewer.navigator.element.style.width = this.viewer.navigatorWidth;
        
        //  set focus to current image viewer window
        (<HTMLElement>document.getElementById(this.handscrollViewerOptions.id).querySelector('.openseadragon-canvas')).focus();   
    }


    /**
     * 
     *  Public getter method for autoScrollSpeedSetting property.
     * 
     */
    public getAutoScrollSpeedSetting(): number
    {
        return this.autoScrollSpeedSetting;
    }


    /**
     * 
     *  Public setter method for the autoScrollSpeedSetting property.
     * 
     *  newSpeedSetting parameter is clamped between 1.0 and 10.0.
     * 
     */
    public setAutoScrollSpeedSetting(newSpeedSetting: number)
    {
        if ( newSpeedSetting < 1.0 )
        {
            newSpeedSetting = 1.0;
        }
        else if (newSpeedSetting > 10.0 )
        {
            newSpeedSetting = 10.0;
        }

        this.autoScrollSpeedSetting = newSpeedSetting;
    }


    /**
     * 
     *  Private method that builds a 'shim' div HTML element for separating buttons.
     * 
     *  Returns HTML div 'shim' element. 
     */
    private buildShimDivElement(): HTMLElement 
    {
        let shimDiv = document.createElement("div");
        
        shimDiv.style.width = "10px";
        shimDiv.style.height = "34px";
        shimDiv.style.backgroundColor = "rgba(0,0,0,0)";
        shimDiv.style.zIndex = "100";
        
        return shimDiv;
    }

    /**
     * 
     *
     *  Private method that builds a 'hide controls' div HTML element for hiding navigation and control buttons.
     * 
     *  Returns HTML div 'hide controls' element.
     * 
     */
    private buildHideControlsDiv(): HTMLElement 
    {
        let hideControlsDiv = document.createElement("div");
        
        hideControlsDiv.id = "hidecontroldiv";
        
        let tmpImageElement = document.createElement("img");
        tmpImageElement.setAttribute("src", this.prefixScrollUrl + "ctrlhide_rest.png")
        hideControlsDiv.appendChild(tmpImageElement);
        
        hideControlsDiv.style.width = "35px";
        hideControlsDiv.style.height = "36px";
        hideControlsDiv.style.zIndex = "100";
        
        hideControlsDiv.style.opacity = "1.0";
        
        return hideControlsDiv;
    }

    /**
     * 
     * 
     *  Private method that builds a 'show controls' div HTML element for showing navigation and control buttons.
     * 
     *  Returns HTML div 'show controls' element.
     * 
     */
    private buildShowControlsDiv(): HTMLElement 
    {
        let showControlsDiv = document.createElement("div");
        
        showControlsDiv.id = "showcontroldiv";
        
        let tmpImageElement = document.createElement("img");
        tmpImageElement.setAttribute("src", this.prefixScrollUrl + "ctrlshow_rest.png")
        showControlsDiv.appendChild(tmpImageElement);

        showControlsDiv.style.width = "35px";
        showControlsDiv.style.height = "36px";
        showControlsDiv.style.zIndex = "100";
        
        return showControlsDiv;
    }

    /**
     * 
     *  Private method that alerts the user with the current click location coordinates in OpenSeadragon point units.
     *  Also, places a temporary test annotation at the click location on the scroll image being displayed.
     * 
     *  Test annotation's upper right corner is placed at the click location.
     * 
     *  Used to determine annotation locations in the required Seadragon point uits.
     * 
     *  Method is initiated when the user clicks an image while pressing the __alt__ and __control__ keys simultaneously.
     * 
     *  Used only when adding annotations during website development.
     * 
     *  Paramenter enventPosition is the location of the canvas click on the current scroll viewer HTML element.
     * 
     */
    private displayTestAnnotationLocation(eventPosition)
    {
        //  remove the current test annotation display if it exists
        if (this.testDivOverlayExists === true)
        {
            this.viewer.removeOverlay('test-div-overlay');
        
            this.testDivOverlayExists = false;
        }              

        //  get viewport coordinates of click event position       
        var viewportPoint1 = this.viewer.viewport.viewerElementToViewportCoordinates(eventPosition);
                   
        //  add runtime div overlay with test annotation display      
        var divOverlayContainer = document.createElement('div');
        divOverlayContainer.setAttribute('id', 'test-div-overlay');

        var divOverlayTitle = document.createElement('div');
        divOverlayTitle.setAttribute('id', 'test-div-title');
        divOverlayTitle.setAttribute('class', 'test-div-annotation');
    
        divOverlayTitle.style.backgroundColor = 'rgba(128,0,0,0.6)';
        divOverlayTitle.style.fontSize = '11px';
        divOverlayTitle.style.color = 'white';
        divOverlayTitle.style.width = '150px';
        divOverlayTitle.style.padding = '3px';
        divOverlayTitle.style.textAlign = 'center';
        divOverlayTitle.style.borderTopLeftRadius ='8px';
        divOverlayTitle.style.borderTopRightRadius ='8px';
        divOverlayTitle.style.borderBottomLeftRadius ='8px';
        divOverlayTitle.style.borderBottomRightRadius ='8px';

        divOverlayTitle.innerHTML = '<span>Test Annotation Title</span>';

        divOverlayContainer.appendChild(divOverlayTitle);

        var divOverlayMainText = document.createElement('div');

        var divOverlayMainText = document.createElement('div');
        divOverlayMainText.style.backgroundColor = 'rgba(255,255,255,0.8)';
        divOverlayMainText.style.fontSize = '11px';
        divOverlayMainText.style.color = 'black';
        divOverlayMainText.style.width = '144px';
        divOverlayMainText.style.padding = '6px';
        divOverlayMainText.style.textAlign = 'left';

        divOverlayMainText.style.borderBottomLeftRadius ='8px';
        divOverlayMainText.style.borderBottomRightRadius ='8px';

        divOverlayMainText.innerHTML = '<span>Test Annotation main text main text main text main text main text main text main text main text main text main text main text main text main text main text main text</span>';

        divOverlayMainText.style.display = 'none';

        divOverlayContainer.appendChild(divOverlayMainText);

        divOverlayTitle.onclick = function() 
        {
            if (divOverlayMainText.style.display === "none")
            {
                divOverlayMainText.style.display = "block";
                divOverlayTitle.style.borderBottomLeftRadius ='0px';
                divOverlayTitle.style.borderBottomRightRadius ='0px';
            } else
            {
                divOverlayMainText.style.display = "none";
                divOverlayTitle.style.borderBottomLeftRadius ='8px';
                divOverlayTitle.style.borderBottomRightRadius ='8px';
            }
        };

        //  add the test annotation div as an OpenSeadragon overlay
        //  with the upper right corner of the annotation at the click location
        this.viewer.addOverlay ({
            element: divOverlayContainer,
            location: viewportPoint1,
            placement: OpenSeadragon.Placement.TOP_RIGHT
        });
        this.testDivOverlayExists = true;

        //  display alert browser dialog box with OpenSeadragron viewport point coordinates
        alert("Annotation Position Coordinates  X: " +  viewportPoint1.x.toFixed(6) + ", Y: " + viewportPoint1.y.toFixed(6));                    
    }

    /**
     * 
     *  Public method that displays the next scroll (after the currently displayed scroll defined in siteDziImages array).
     * 
     *  Wrap to the beginning of siteDziImage array if currently at the end of the array.
     * 
     *  Current image is removed and the new image is displayed in the current viewer display.
     * 
     */
    public displayNextScroll() 
    {
        this.currentImageIndex++;
        if (this.currentImageIndex >= siteDziImages.length)
        {
            this.currentImageIndex = 0;
        }
 
        this.currentScrollId = siteDziImages[this.currentImageIndex].Id;

        this.handscrollViewerOptions.tileSources.Image.Url = siteDziImages[this.currentImageIndex].Url;
        this.handscrollViewerOptions.tileSources.Image.Size.Height = siteDziImages[this.currentImageIndex].Height;
        this.handscrollViewerOptions.tileSources.Image.Size.Width = siteDziImages[this.currentImageIndex].Width;

        //  set navigator width based on current image aspect ratio
        this.viewer.navigatorWidth = Math.floor(30.0 * (+siteDziImages[this.currentImageIndex].Width / +siteDziImages[this.currentImageIndex].Height))   + "px";
 
        //  show button and navigation controls if hidden before opening a new image  
        if (this.areControlsHidden === true)
        {
            this.hideControlsToggle();
        }

        //  flag that annotations are not loaded
        this.areAnnotationsLoaded = false;

        //  display hide annotations button, hide show annotations button
        this.hideAnnotationsOpenSeadragonButton.element.style.display = "";
        this.showAnnotationsOpenSeadragonButton.element.style.display = "none";
 
        //  open the new image    
        this.viewer.open(this.handscrollViewerOptions.tileSources);
   
        this.viewer.navigator.element.style.width = this.viewer.navigatorWidth;

        //  set focus to current viewer window
        (<HTMLElement>document.getElementById(this.handscrollViewerOptions.id).querySelector('.openseadragon-canvas')).focus();
    }

    /**
     *  
     *  Public method that displays the previous scroll (before the currently displayed scroll defined in siteDziImages array).
     * 
     *  Wrap to the end of siteDziImage array if currently at the beginning of array.
     * 
     *  Current image is removed and the new image is displayed in the current view canvas.
     * 
     */
    public displayPrevScroll() 
    {
        this.currentImageIndex--;
        if (this.currentImageIndex < 0)
        {
            this.currentImageIndex = siteDziImages.length - 1;
        }

        this.currentScrollId = siteDziImages[this.currentImageIndex].Id;

        this.handscrollViewerOptions.tileSources.Image.Url = siteDziImages[this.currentImageIndex].Url;
        this.handscrollViewerOptions.tileSources.Image.Size.Height = siteDziImages[this.currentImageIndex].Height;
        this.handscrollViewerOptions.tileSources.Image.Size.Width = siteDziImages[this.currentImageIndex].Width;
        
        //  set navigator width based on current image aspect ratio
        this.viewer.navigatorWidth = Math.floor(30.0 * (+siteDziImages[this.currentImageIndex].Width / +siteDziImages[this.currentImageIndex].Height))   + "px";
 
        //  show button and navigation controls if hidden before opening a new image 
        if (this.areControlsHidden === true)
        {
            this.hideControlsToggle();
        }

        //  flag that annotations are not loaded
        this.areAnnotationsLoaded = false;

        //  display hide annotations button, hide show annotations button
        this.hideAnnotationsOpenSeadragonButton.element.style.display = "";
        this.showAnnotationsOpenSeadragonButton.element.style.display = "none";        

        //  open the new image
        this.viewer.open(this.handscrollViewerOptions.tileSources);

        this.viewer.navigator.element.style.width = this.viewer.navigatorWidth;

        //  set focus to current viewer window
        (<HTMLElement>document.getElementById(this.handscrollViewerOptions.id).querySelector('.openseadragon-canvas')).focus();
    }

    /**
     * 
     *  Public method that displays the scroll image referenced by the passed scroll id (located in the siteDziImages array).
     * 
     *  Current image is removed and the new image is displayed in current view canvas.
     * 
     *  Returns false if no scroll image is found. Returns true if scroll image is found.
     *  
     *  Parameter __passedScrollIdString__ is an id of a scroll object in the siteDziImages array
     *
     */
    public displayScrollWithId(passedScrollIdString: string): boolean
    {
        let imageArrayIndex = NaN;
        for (var i = 0; i < siteDziImages.length; i++)
        {
            if (siteDziImages[i].Id === passedScrollIdString)
            {
                imageArrayIndex = i;
                break;
            }
        }

        if (isNaN(imageArrayIndex))
        {
            return false;
        }
        else
        {
            this.currentImageIndex = imageArrayIndex;

            this.currentScrollId = siteDziImages[this.currentImageIndex].Id;

            this.handscrollViewerOptions.tileSources.Image.Url = siteDziImages[this.currentImageIndex].Url;
            this.handscrollViewerOptions.tileSources.Image.Size.Height = siteDziImages[this.currentImageIndex].Height;
            this.handscrollViewerOptions.tileSources.Image.Size.Width = siteDziImages[this.currentImageIndex].Width;
        
            this.viewer.navigatorWidth = Math.floor(30.0 * (+siteDziImages[this.currentImageIndex].Width / +siteDziImages[this.currentImageIndex].Height))   + "px";
 
            // show navigation controls if hidden before opening a new image
            if (this.areControlsHidden === true)
            {
                this.hideControlsToggle();
            }

            //  flag that annotations are not loaded
            this.areAnnotationsLoaded = false;

            //  display hide annotations button, hide show annotations button
            this.hideAnnotationsOpenSeadragonButton.element.style.display = "";
            this.showAnnotationsOpenSeadragonButton.element.style.display = "none";        

            this.viewer.open(this.handscrollViewerOptions.tileSources);
        
            //  adjust the width of the navigation control based on current image aspect ratio
            this.viewer.navigator.element.style.width = this.viewer.navigatorWidth;

            //  show annotations if needed for the current image
            setTimeout(this.showAnnotations.bind(this), 800);

            //  set focus to current viewer window
            (<HTMLElement>document.getElementById(this.handscrollViewerOptions.id).querySelector('.openseadragon-canvas')).focus();

            return true;
        }
    }

    /**
     * 
     *  Private method called before every browser window frame is repainted on the screen to perform auto horizontal scroll animation if needed.
     *
     *  This callback method initiated with javascript __requestAnimationFrame__ method.
     * 
     */
    private frameAutoHorizontalScroll(timestamp) 
    {
        if (this.prevTime === null)
        {
            this.prevTime = timestamp;
        }

        //  call this frameAutoHorizontalScroll method on the next frame display
        requestAnimationFrame(this.frameAutoHorizontalScroll.bind(this));

        //  do nothing is auto horizontal scroll is paused
        if (this.isAutoScrollPaused === true)
        {
            return;
        }

        let centerPoint = this.viewer.viewport.getCenter(false);    
        let deltaTime = timestamp - this.prevTime;
        this.prevTime = timestamp;
 
        //  set scroll speed based on auto scroll speed setting property
        var autoScollSpeedFactor = 0.000001 * this.autoScrollSpeedSetting;  
 
        if ((centerPoint.x < 1.0) && (this.autoHorizontalScrollDirection === Direction.Left))
        {
            centerPoint.x += deltaTime * autoScollSpeedFactor;
            this.viewer.viewport.panBy(new OpenSeadragon.Point(deltaTime * autoScollSpeedFactor, 0.0));
        }
        else if ((centerPoint.x > 0.0) && (this.autoHorizontalScrollDirection === Direction.Right))
        {
            centerPoint.x -= deltaTime * autoScollSpeedFactor;
            this.viewer.viewport.panBy(new OpenSeadragon.Point(-(deltaTime * autoScollSpeedFactor), 0.0));
        }
        else
        {
            this.isAutoScrollPaused = true;

            if (this.areControlsHidden === false) 
            {
                if (this.autoHorizontalScrollDirection === Direction.Left) {
                    this.autoScrollRightOpenSeadragonButton.element.style.display = "";
                    this.stopAutoScrollRightOpenSeadragonButton.element.style.display = "none";
                }
                else if (this.autoHorizontalScrollDirection === Direction.Right) {
                    this.autoScrollLeftOpenSeadragonButton.element.style.display = "";
                    this.stopAutoScrollLeftOpenSeadragonButton.element.style.display = "none";
                }
            }

            this.prevTime = null;
            this.viewer.viewport.applyConstraints(false);
        }
    }

    /**
     * 
     *  Public method that toggles the display of annotations.
     * 
     */
    public hideAnnotationsToggle() 
    {
        this.areAnnotationsVisible = !this.areAnnotationsVisible;
 
        for (let i = 0; i < this.viewer.currentOverlays.length; i++)
        {
            if (this.areAnnotationsVisible === false)
            {
                (this.viewer.currentOverlays[i].element).style.display = "none";

                this.hideAnnotationsOpenSeadragonButton.element.style.display = "none";
                this.showAnnotationsOpenSeadragonButton.element.style.display = "";
            }
            else if (this.areAnnotationsVisible === true)
            {
                (this.viewer.currentOverlays[i].element).style.display = "block";
                this.hideAnnotationsOpenSeadragonButton.element.style.display = "";
                this.showAnnotationsOpenSeadragonButton.element.style.display = "none";

            }
        }
    }

    /**
     * 
     *  Private method that displays annotations that have been hidden.
     * 
     */
    public showAnnotations() 
    {
        this.areAnnotationsVisible = true;
   
        for (let i = 0; i < this.viewer.currentOverlays.length; i++)
        {
            (this.viewer.currentOverlays[i].element).style.display = "block";
        }

        this.hideAnnotationsOpenSeadragonButton.element.title = "Hide annotations";
    }

    /**
     * 
     *  Public method that moves the display to the right edge of the scroll image.
     *  
     */
    public gotoRightEdge() 
    {
        let centerPoint = this.viewer.viewport.getCenter(false);
        centerPoint.x = 1.0;
        this.viewer.viewport.panTo(centerPoint, false);
        this.viewer.viewport.applyConstraints(false);
    }

    /**
     * 
     *  Public method that toggles auto horizontal scroll left.
     * 
     *  Either start auto horizontal scroll left, or pause auto scroll.
     * 
     */
    public autoScrollLeftToggle() 
    {
        if (this.autoHorizontalScrollDirection === Direction.Right)
        {
            this.isAutoScrollPaused = !this.isAutoScrollPaused;
        }
        else if (this.autoHorizontalScrollDirection === Direction.Left)
        {
            if (this.isAutoScrollPaused === true)
            {
                this.isAutoScrollPaused = false;
            }

            this.autoScrollRightOpenSeadragonButton.element.style.display = "";
            this.stopAutoScrollRightOpenSeadragonButton.element.style.display = "none";

            this.autoHorizontalScrollDirection = Direction.Right;
        }
 
        if (this.isAutoScrollPaused === false)
        {
            this.prevTime = null;

            this.stopAutoScrollLeftOpenSeadragonButton.element.style.display = "";
            this.autoScrollLeftOpenSeadragonButton.element.style.display = "none";
        }
    }

    /**
     * 
     *  Public method that stops auto horizontal scroll left.
     * 
     */
   public autoScrollLeftStop() 
   {
        this.isAutoScrollPaused = true;

        this.autoScrollLeftOpenSeadragonButton.element.style.display = "";
        this.stopAutoScrollLeftOpenSeadragonButton.element.style.display = "none";
    }

    /**
     * 
     *  Public method that toggles auto horizontal scroll right.
     * 
     *  Either start auto horizontal scroll right, or pause auto scroll.
     * 
     */
    public autoScrollRightToggle() 
    {
        if (this.autoHorizontalScrollDirection === Direction.Left)
        {
            this.isAutoScrollPaused = !this.isAutoScrollPaused;
        }
        else if (this.autoHorizontalScrollDirection === Direction.Right)
        {
            if (this.isAutoScrollPaused === true)
            {
                this.isAutoScrollPaused = false;
            }

            this.autoScrollLeftOpenSeadragonButton.element.style.display = "";
            this.stopAutoScrollLeftOpenSeadragonButton.element.style.display = "none";

            this.autoHorizontalScrollDirection = Direction.Left;
        }
        if (this.isAutoScrollPaused === false)
        {
            this.prevTime = null;

            this.stopAutoScrollRightOpenSeadragonButton.element.style.display = "";
            this.autoScrollRightOpenSeadragonButton.element.style.display = "none";
        }        
    }

    /**
     * 
     *  Public method that stops auto horizontal scroll right.
     * 
     */
    public autoScrollRightStop() 
    {
        this.isAutoScrollPaused = true;

        this.autoScrollRightOpenSeadragonButton.element.style.display = "";
        this.stopAutoScrollRightOpenSeadragonButton.element.style.display = "none";
    }

    /**
     * 
     *  Public method that toggles (show or hide) display of control buttons and navigation control.
     * 
     */
    public hideControlsToggle () 
    {
        if (this.areControlsHidden === false)
        {
            for (let i = 0; i <this.viewer.controls.length; i++)
            {
                this.viewer.controls[i].autoFade = false;
                this.viewer.controls[i].element.style.display = "none";
                
            }
            this.areControlsHidden = true;
            this.hideControlsOpenSeadragonControl.element.style.display = "none";
            this.showControlsOpenSeadragonControl.element.style.display = "";
        }
        else if (this.areControlsHidden === true)
        {
            for (let i = 0; i <this.viewer.controls.length; i++)
            {
                this.viewer.controls[i].autoFade = true;
                this.viewer.controls[i].element.style.display = "inline-block";
            }

            if (this.areAnnotationsVisible === true)
            {
                this.showAnnotationsOpenSeadragonButton.element.style.display = "none";
            }
            else
            {
                this.hideAnnotationsOpenSeadragonButton.element.style.display = "none";
            }
            
            if (this.autoHorizontalScrollDirection === Direction.Left)
            {
                if (this.isAutoScrollPaused === true)
                {
                    this.stopAutoScrollLeftOpenSeadragonButton.element.style.display = "none";
                    this.stopAutoScrollRightOpenSeadragonButton.element.style.display = "none";
                 }
                else
                {
                   this.autoScrollRightOpenSeadragonButton.element.style.display = "none";
                }

                this.stopAutoScrollLeftOpenSeadragonButton.element.style.display = "none";
            }

            if (this.autoHorizontalScrollDirection === Direction.Right)
            {
                if (this.isAutoScrollPaused === true)
                {
                    this.stopAutoScrollLeftOpenSeadragonButton.element.style.display = "none";
                    this.stopAutoScrollRightOpenSeadragonButton.element.style.display = "none";
                }
                else
                {
                    this.autoScrollLeftOpenSeadragonButton.element.style.display = "none";
                }

                this.stopAutoScrollRightOpenSeadragonButton.element.style.display = "none";                
            }

            this.areControlsHidden = false;
            this.showControlsOpenSeadragonControl.element.style.display = "none";
            this.hideControlsOpenSeadragonControl.element.style.display = "";
        }
    }

    /**
     * 
     *  Public method that adds fully defined annotation overlay divs for all the annotations of the current image (if any).
     * 
     *  The scroll id of the current image is used to find the image's annotation information in the siteAnnotations object array.
     * 
     */
    public addAllAnnotations ()
    {
        //  if annotations are already added then do nothing
        if (this.areAnnotationsLoaded === true)
        {
            return;
        }

        //  check for annotations for the current image in the siteAnnotations array                  
        var annotationsIndex = null;               
        for (var i = 0; i < siteAnnotations.length; i++)
        {
            if (siteAnnotations[i].Id === this.currentScrollId)
            {
                annotationsIndex = i;
                break;
            }
        };

        if (annotationsIndex != null)
        {
            // annotations exist for current image being displayed
            // create annotation overlays for each annotation of the current image
            var currentImageAnnotations = siteAnnotations[annotationsIndex].imageAnnotations;
                    
            for (var i = 0; i < currentImageAnnotations.length; i++ )
            {
                var viewportPoint = new OpenSeadragon.Point(currentImageAnnotations[i].x, currentImageAnnotations[i].y);  
                this.addOneAnnotation(viewportPoint, currentImageAnnotations[i].title, currentImageAnnotations[i].text);
            }
        }
                  
        this.areAnnotationsLoaded = true;  // remember that annotations for current image are loaded
    }


    /**
     * 
     *  Public method that adds a single annotation OpenSeadragon overlay div at the passed OpenSeadragon viewPoint with passed title and text.
     * 
     *  The passed viewPoint is the location of the upper right corner of the annotation display.
     */
    public addOneAnnotation (viewPoint, title: string, text: string)
    {
        // build annotation overlay div (container div for annotation title and text div)            
        var divOverlayContainer = document.createElement('div');
        divOverlayContainer.setAttribute('id', 'div-annotation-overlay');
                      
        var divAnnotationTitle = document.createElement('div');
        divAnnotationTitle.setAttribute('id', 'div-annotation-title');
    
        //  CHANGE TO ALTER ANNOTATION TITLE STYLE
        divAnnotationTitle.style.backgroundColor = 'rgba(128,0,0,0.6)';
        divAnnotationTitle.style.fontSize = '11px';
        divAnnotationTitle.style.color = 'white';
        divAnnotationTitle.style.width = '200px';
        divAnnotationTitle.style.padding = '3px';
        divAnnotationTitle.style.textAlign = 'center';
        divAnnotationTitle.style.borderTopLeftRadius ='8px';
        divAnnotationTitle.style.borderTopRightRadius ='8px';
        divAnnotationTitle.style.borderBottomLeftRadius ='8px';
        divAnnotationTitle.style.borderBottomRightRadius ='8px';                  

        divAnnotationTitle.innerHTML = '<span class="div-annotation-title">'+ title +'</span>';
                     
        var divAnnotationText = document.createElement('div');
        divAnnotationText.setAttribute('id', 'div-annotation-text');
 
        //  CHANGE TO ALTER ANNOTATION TEXT STYLE
        divAnnotationText.style.backgroundColor = 'rgba(0,0,0,0.2)';
        divAnnotationText.style.fontSize = '11px';
        divAnnotationText.style.color = 'white';
        divAnnotationText.style.width = '194px';
        divAnnotationText.style.padding = '6px';
        divAnnotationText.style.textAlign = 'left';                   
        divAnnotationText.style.borderBottomLeftRadius ='8px';
        divAnnotationText.style.borderBottomRightRadius ='8px';                   
        divAnnotationText.style.lineHeight = 'normal';

        divAnnotationText.innerHTML = '<span>'+ text +'</span>';                 
        divAnnotationText.style.display = 'none';   // initially hidden

        divOverlayContainer.appendChild(divAnnotationTitle);
        divOverlayContainer.appendChild(divAnnotationText);
          
        //  annotation title click toggles display of annotation text below title      
        divAnnotationTitle.addEventListener("click",function() {
            if (divAnnotationText.style.display === "none")
            {
                divAnnotationText.style.display = "block";
                divAnnotationTitle.style.borderBottomLeftRadius ='0px';
                divAnnotationTitle.style.borderBottomRightRadius ='0px';
            } else
            {
                divAnnotationText.style.display = "none";
                divAnnotationTitle.style.borderBottomLeftRadius ='8px';
                divAnnotationTitle.style.borderBottomRightRadius ='8px';
            }
        });

        //  add the annotation to the image viewer display at the passed OpenSeadragon Point
        //  top right corner of the overlay will be at the passed Point coordinate           
        this.viewer.addOverlay ({
            element: divOverlayContainer,
            location: viewPoint,
            placement: OpenSeadragon.Placement.TOP_RIGHT
        });
    }
}
