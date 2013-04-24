define(['esri/map',
        'esri/arcgis/utils',
        "esri/dijit/AttributeInspector-all",
        'esri/layers/FeatureLayer',
        "esri/tasks/query",
        'dojo/dom',"dojo/dom-style",
        "esri/main",
        "dojo/_base/array","dojo/query","dojo/window",
        "dojo/_base/lang",
        "dojo/parser","dojo/_base/lang",'dojo/on',"dojo/dom-construct",
        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane","dijit/layout/TabContainer",
        "dojo/domReady!"],
function(Map,esriUtils,attrInspect,FeatureLayer,esriQuery,dom,domStyle,esri,array,query,win,lang,parser,lang,on, domConstruct){
    

    var sections = null, queriedFeatureIDs = [], queriedFeatureSet =[],applicationQueryLayer = null,   
 
    startup = function() {
        parser.parse();
        esri.config.defaults.geometryService = new esri.tasks.GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
        sections = dojo.query("section");
        initMap();        
    },
    initMap = function(){
        /*create the map from AGOL id*/
        var mapDeferred = esriUtils.createMap("b35391d4076c4e77b56e59368191103f", "map", {
            mapOptions: {
                slider: false,
                nav:false,
                fadeOnZoom:true           
            }
        });                   
        mapDeferred.then(lang.hitch(this, function(response) {
            /*Basic map functionality*/
            this.clickHandler = response.clickEventHandle;
            this.clickListener = response.clickEventListener;
            this.map = response.map;   
            this.opLayers = response.itemInfo.itemData.operationalLayers;   
            /*preserve some execution context for "this" */                        
            lang.hitch(this, mapUI());            
        }));                
    },
    mapUI = function(){

        lang.hitch(this, disableMapOperations());
        lang.hitch(this,scrollEvents());
        applicationQueryLayer = this.opLayers[2].layerObject;
        /*var selectionSymbol = new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([255,255,0,0.5]));
        applicationQueryLayer.setSelectionSymbol(selectionSymbol);    */    

        this.map.setLevel(3);/*helps the map start off looking good*/
    },
    createQuery = function(id){
        if(id === 'cover'){return}        
        var idx = array.indexOf(queriedFeatureIDs, id);
        if (idx === -1){
            queriedFeatureIDs.push(id);/*push this into the array and query for the first time*/
            var queryParams = new esriQuery();
            queryParams.where = "Region = '" + id + "'";
            applicationQueryLayer.queryFeatures(queryParams,lang.hitch(this,queryCallback));
        }
        else{
            /*skip callback*/
            console.log("Skip callback");
            
            processFeatures(id);            
        }       
        
    },
    processFeatures = function(region){
        /*Array of objects containing the feature info*/
        /*Using some to break out of array if item is found. Further reducing that fact I may have duplicates.*/
        array.some(queriedFeatureSet, function(item,index){                       
            if(item.idx === region){
                var pt = esri.geometry.xyToLngLat(item.POINT_X, item.POINT_Y);
                zoomToFeatures(pt,item.ZoomLevel);
            }
        });        
    },
    zoomToFeatures = function(pt,zoomFactor){
        console.log(pt);
        console.log(zoomFactor);
        this.map.centerAndZoom(pt,zoomFactor);
    }
    queryCallback = function(fset){
        /*I should only be in this function one time per feature.*/
        /*I am interested in the features POINT_X, POINT_Y, and ZoomLevel. */
        var fsetObj = {};
        fsetObj.idx = fset.features[0].attributes.Region;
        fsetObj.POINT_X = fset.features[0].attributes.POINT_X;
        fsetObj.POINT_Y = fset.features[0].attributes.POINT_Y;
        fsetObj.ZoomLevel = fset.features[0].attributes.ZoomLevel;
        queriedFeatureSet.push(fsetObj);
        processFeatures(fsetObj.idx);
    },
    disableMapOperations = function(){
        this.map.disablePan();
        this.map.disableScrollWheelZoom();
        this.map.disableMapNavigation();
    },
    setActive = function(index){
        array.forEach(sections,function(s){
            s.className = s.className.replace(' active', '');
        });
        sections[index].className += ' active';
        document.body.className = 'section-' + index;               
        createQuery(sections[index].id);
        return true;
    },
    scrollEvents = function(){
        /*All of this logic came from the original sample. I just used dojo and not underscore*/
        /*This function calls set active*/
        /*var self = this;   */         
        on(window, "scroll", function(event){
            if (window.pageYOffset === undefined) {
                var y = document.documentElement.scrollTop;
                var h = document.documentElement.clientHeight;
              } else {
                var y = window.pageYOffset;
                var h = window.innerHeight;
              }
              // If scrolled to the very top of the page set the first section active.
              if (y === 0) return setActive(0);

              // Otherwise, conditionally determine the extent to which page must be
              // scrolled for each section. The first section that matches the current
              // scroll position wins and exits the loop early.
              var memo = 0;
              var buffer = (h * 0.27);
              var active = array.some(sections,function(el, index) {
                memo += el.offsetHeight;
                return y < (memo-buffer) ? setActive(index) : false;
              });

              // If no section was set active the user has scrolled past the last section.
              // Set the last section active.
              if (!active) setActive(sections.length - 1);

        });


    }
    return {
        init: function() {
            // proceed directly with startup
            startup();
        }
    };
});