/*main.js*/
// main JavaScript file. This is where the majic happens. 

var sections;
define(['underscore','esri/map',
	    'esri/arcgis/utils',
	    "esri/dijit/AttributeInspector-all",
	    'esri/layers/FeatureLayer',
	    "esri/tasks/query",
	    'dojo/dom',
	    "esri/main",
	    "dojo/_base/array","dojo/query","dojo/window",
	    "dojo/_base/lang",
	    "dojo/parser","dojo/_base/lang",'dojo/on',"dojo/dom-construct",
		"dijit/layout/BorderContainer",
		"dijit/layout/ContentPane","dijit/layout/TabContainer",
		"dojo/domReady!"],function(_,Map,esriUtils,attrInspect,FeatureLayer,esriQuery,dom,esri,array,query,win,lang,parser,lang,on, domConstruct){
		
		
		
		return{
			
    		startup: function(){
    			parser.parse();
    			
    			//This service is for development and testing purposes only. We recommend that you create your own geometry service for use within your applications
    			esri.config.defaults.geometryService = new esri.tasks.GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
    			sections = dojo.query("section");
    			this.initMap();
    			this.setActive(0);
    			this.scrollEvents();
    		},
    		initMap: function(){
    			var mapDeferred = esriUtils.createMap("b35391d4076c4e77b56e59368191103f", "map", {
                    mapOptions: {
                        /*add options*/
                        slider: false,
        				nav:false,
        				fadeOnZoom:true,

                    }
                });
               
                mapDeferred.then(lang.hitch(this, function(response) {
                    this.clickHandler = response.clickEventHandle;
                    this.clickListener = response.clickEventListener;
                    this.map = response.map;   
                    this.opLayers = response.itemInfo.itemData.operationalLayers;         
                    this.disableMapOperations();
                }));
    		},
    		disableMapOperations: function(){
    			this.map.disablePan();
    		},
    		setActive: function(index){
    			
    			array.forEach(sections,function(s){
				    s.className = s.className.replace(' active', '');
				});

				sections[index].className += ' active';

				document.body.className = 'section-' + index;

				/*Call map centerAndZoom*/
				return true;
    		},

    		scrollEvents: function(){
    			var self = this;			
				window.onscroll = function(event){
					if (window.pageYOffset === undefined) {
					    var y = document.documentElement.scrollTop;
					    var h = document.documentElement.clientHeight;
					  } else {
					    var y = window.pageYOffset;
					    var h = window.innerHeight;
					  }
					  // If scrolled to the very top of the page set the first section active.
					  if (y === 0) return self.setActive(0);

					  // Otherwise, conditionally determine the extent to which page must be
					  // scrolled for each section. The first section that matches the current
					  // scroll position wins and exits the loop early.
					  var memo = 0;
					  var buffer = (h * 0.3333);
					  var active = array.some(sections,function(el, index) {
					    memo += el.offsetHeight;
					    return y < (memo-buffer) ? self.setActive(index) : false;
					  });

					  // If no section was set active the user has scrolled past the last section.
					  // Set the last section active.
					  if (!active) self.setActive(sections.length - 1);

				}


    		}


	}

});

