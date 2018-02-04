window.onload = function() {

		var canvas = document.getElementById('canvas');
			canvas.width  = window.innerWidth*0.70;
			canvas.height = window.innerHeight*0.80;
			paper.setup(canvas);
			paper.view.translate(paper.view.center);
			//paper.view.rotate(180);
		var background = new paper.Path.Rectangle(paper.view.bounds);
			background.fillColor = "White";
		var cliques, syns, coords;
		var extremevalues = [0, 0, 0, 0, 0, 0];
		var cliVisible = false;
		var allLinkVisible = false;
		var allAreasVisible = false;
		var showAreas = false;
		var axe1 = document.getElementById('axe1');
		var axe2 = document.getElementById('axe2');


		// For Chrome
		window.addEventListener('mousewheel', mouseWheelEvent);

		// For Firefox
		window.addEventListener('DOMMouseScroll', mouseWheelEvent);

function mouseWheelEvent(e) {
    var delta = e.wheelDelta ? e.wheelDelta : -e.detail;
    console.log(e);
    var point = new paper.Point(e.offsetX, e.offsetY);
    	point = paper.view.viewToProject(point);
		if(delta > 0){
			console.log("in");
			for (var i = 0; i < syns.length; i++) {
    				let x2 = (syns[i].point.x -point.x)*1.2 ;
    				let y2 = (syns[i].point.y-point.y)*1.2;
    				syns[i].setCoordinates(x2, y2);
    			}
    			for (var i = 0; i < cliques.length; i++) {
    				let x2 = (cliques[i].point.x-point.x)*1.2;
    				let y2 = (cliques[i].point.y-point.y)*1.2;
    				cliques[i].setCoordinates(x2, y2);
    			}
		}else{
			console.log("out");
			for (var i = 0; i < syns.length; i++) {
    				let x2 = (syns[i].point.x-point.x)*0.9;
    				let y2 = (syns[i].point.y-point.y)*0.9 ;
    				syns[i].setCoordinates(x2, y2);
    			}
    			for (var i = 0; i < cliques.length; i++) {
    				let x2 = (cliques[i].point.x -point.x)*0.9;
    				let y2 = (cliques[i].point.y -point.y)*0.9;
    				cliques[i].setCoordinates(x2, y2);
    			}
		}
		background.position = paper.view.center;
		background.bounds = paper.view.bounds;
		updateView();
}
		
		
		
		


    	//fonction a appeler après un changement du graphe pour redessiner si besoin les enveloppes, les liens, etc..
		function updateView() {
			if(allAreasVisible){
				for (var i = 0; i < syns.length; i++) {
					if(!syns[i].clicked){
						syns[i].enveloppeCli();
					}
				}
			}
			else{
				for (var i = 0; i < syns.length; i++) {
					if(syns[i].clicked){
						syns[i].enveloppeCli();
					}
				}
			}
			if(allLinkVisible){
				for (var i = 0; i < cliques.length; i++) {
					cliques[i].unLinkWithWords();
					if(!cliques[i].clicked){
						cliques[i].linkWithWords(0.1);
					}
					else{
						cliques[i].linkWithWords(1);
					}
				}
			}
			else{
				for (var i = 0; i < cliques.length; i++) {
					cliques[i].unLinkWithWords();
					if(cliques[i].clicked){
						cliques[i].linkWithWords(1);
					}
				}
			}
		}

		
		
    	
		

		$('#axe1').change(function(){
			updateAxis();
		});
		$('#axe2').change(function(){
			updateAxis();
		});

		function updateAxis(){
			var x = $('#axe1').val();
			var y = $('#axe2').val();
			for (var i = 0; i < cliques.length; i++) {
				cliques[i].setAxis(x, y);
			}
			for (var i = 0; i < syns.length; i++) {
				syns[i].setAxis(x, y);
			}
			updateView();
		}

		
		$('#showcli').change(function(){
			if(!$('#showcli').is(":checked"))
			{

				cliVisible = false;
				for (var i = 0; i < cliques.length; i++) {
					cliques[i].cliVisible = false;
					cliques[i].pointt.visible = false;
				}
			}else{
				cliVisible = true;
				for (var i = 0; i < cliques.length; i++) {
					cliques[i].cliVisible = true;
					cliques[i].pointt.visible = true;
				}
			}
		})

		$('#showAreas').change(function(){
			
			if($('#showAreas').is(":checked"))
			{	showAreas = true;
				for (var i = 0; i < syns.length; i++) {
					if(syns[i].clicked)
					{
						syns[i].enveloppeCli();
					}
				}
			}else{
				if($('#showallAreas').is(":checked")){
					$('#showallAreas').prop('checked', false);
					allAreasVisible = false;
				}
				showAreas = false;
				for (var i = 0; i < syns.length; i++) {
					if(syns[i].enveloppe != undefined){
						syns[i].enveloppe.remove();
					}
				}
			}
		})

		$('#showalllink').change(function(){
			if($('#showalllink').is(":checked"))
			{	
				allLinkVisible = true;
				for (var i = 0; i < cliques.length; i++) {
					if(!cliques[i].clicked){
						cliques[i].linkWithWords(0.1);
					}
				}
			}else{
				allLinkVisible = false;
				for (var i = 0; i < cliques.length; i++) {
					if(!cliques[i].clicked){
						cliques[i].unLinkWithWords();
					}
					
				}
			}
		})
		$('#showallAreas').change(function(){
			if(!$('#showAreas').is(":checked")){
				$('#showAreas').prop('checked', true);
				showAreas = true;
			}
					if($('#showallAreas').is(":checked"))
					{
						allAreasVisible = true;
						for (var i = 0; i < syns.length; i++) {
							syns[i].enveloppeCli();
						}
					}else{
						allAreasVisible = false;
						for (var i = 0; i < syns.length; i++) {
							if(!syns[i].clicked){
								syns[i].enveloppe.remove();
							}
							
						}
					}
				})

		
		$(document).keypress(function(e) {

			if(e.which == 13) {
				window.history.pushState("", "", '/'+$("#word").val());
				$.ajax({
       		url : 'data/'+$("#word").val(),
       		type : 'GET',
       		dataType : 'text',
       		success : espsem,
			error : function(resultat, statut, erreur){
       		console.log("can't get data from serveur");
       		}
		});
			}
		});

		$.ajax({
       		url : 'data/'+$("#word").val(),
       		type : 'GET',
       		dataType : 'text',
       		success : espsem,
			error : function(resultat, statut, erreur){
       		console.log("can't get data from serveur");
       		}
		});

		

		function Syn(asyn, i){

				//degradé de vert en fonction des états d'un mot
				this.normalColor = new paper.Color(0.8, 0, 0.8, 0.55);
				//this.snapColor = new paper.Color(0, 0.6, 0, 0.7);
				this.snapColor = new paper.Color(0.8, 0, 0.8, 0.55);
				this.selectedColor = new paper.Color(0, 0.6, 0, 0.7);

				//couleur des enveloppes
				this.enveloppeColor1 = new paper.Color(1, 0, 0, 0.6);
				this.enveloppeColor2 = new paper.Color(1, 0, 0, 1);


				this.index = i;
           		this.mot = asyn;
           		this.coords = coords[i + cliques.length];  //
           		this.cliques = []; 
           		this.clicked=false;
           		this.linkVisible = false;
           		
           		this.point = new paper.Point(0,0);

           		this.circle = new paper.Path.Circle(this.point, 2.5);
           		this.circle.fillColor = this.normalColor;
           		
				this.text = new paper.PointText(new paper.Point(this.point.x, this.point.y - 30));
           		this.text.visible = false;
				this.text.justification = 'center';
				this.text.fillColor = this.selectedColor;
				this.text.fontSize = 17;
				this.text.content = this.mot;
				
				let b = new paper.Rectangle(this.text.bounds);;
				b.width = b.width*1.3;
				b.height = b.height*1.2; 
				this.rectangle = new paper.Path.Rectangle(b);
				this.rectangle.strokeColor = this.snapColor;
				this.rectangle.visible = false;

				let a = new paper.Point(this.text.bounds.bottom, this.text.bounds.left)
           		this.linkPointText = new paper.Path.Line(this.circle.position, a);
           		this.linkPointText.strokeColor = this.snapColor;
				this.linkPointText.visible = false;
				
           		this.label = new paper.Group([this.text, this.rectangle]);
				
				this.paths = [];
				this.enveloppe;
				
				this.html = $("<div class='syn' id='" + this.index + "'></div>").appendTo("#synlist");
           		this.span = $("<span id='" + this.index + "'>" + this.mot + "</span>").appendTo(this.html);
           		

           		this.show = function(){
					
					this.text.position = new paper.Point(this.point.x, this.point.y - 30);
					this.text.fillColor = this.snapColor;
					this.rectangle.strokeColor = this.snapColor;
					this.circle.fillColor = this.snapColor;
					
					this.rectangle.position = this.text.position;
					
					this.linkPointText.firstSegment.point = this.circle.position;
					this.linkPointText.lastSegment.point = new paper.Point(this.text.bounds.left, this.text.bounds.bottom);
    				this.linkPointText.strokeColor = this.snapColor;
					this.linkPointText.strokeWidth = 1;
					this.labelVisible = true;
					this.text.visible = true;
					this.rectangle.visible = true;
					this.linkPointText.visible = true;
				}.bind(this);

				this.showCliquesHtml = function(){

					$("#clilist").html("");
					$("#clispan").html("");
					$("#clispan").append(this.mot);
					for (var i = 0; i < this.cliques.length; i++) {
						var html = "<div class='clique' id="+this.cliques[i].index+">";
						for (var j = 0; j < this.cliques[i].mots.length; j++) {
							html = html + this.cliques[i].mots[j].mot + ', ';
						}
						html = html + "</div>";
						$("#clilist").append(html);
					}
				}.bind(this);

				this.hide = function(){
					this.labelVisible = false;
					this.linkPointText.visible = false;
					this.text.fillColor = this.snapColor;
					this.circle.fillColor = this.normalColor;
					this.linkPointText.strokeColor = this.snapColor;
					this.text.visible = false;
					this.rectangle.visible = false;
					this.showCliques(false);
				}

				this.select = function(){
					this.span.css("font-weight","Bold");
					this.circle.fillColor = this.selectedColor;
					this.text.fillColor = this.selectedColor;
					this.rectangle.strokeColor=this.selectedColor;
					this.linkPointText.strokeColor = this.selectedColor;
					
				}.bind(this);

				this.unselect = function(event){
					this.span.css("font-weight","Normal");
					$("#clilist").html("");
				}.bind(this);

				this.showCliques = function(yes){
					if(yes){
						for (var i = 0; i < this.cliques.length; i++) {
						this.cliques[i].pointt.fillColor = this.enveloppeColor1;
						this.cliques[i].rectangle.strokeColor = this.enveloppeColor1;
						this.cliques[i].text.strokeColor = this.enveloppeColor1;
						this.cliques[i].text.fillColor = this.enveloppeColor1;
						this.cliques[i].linkPointText.strokeColor = this.enveloppeColor1;
					}
				}else{
					for (var i = 0; i < this.cliques.length; i++) {
						this.cliques[i].pointt.fillColor = this.cliques[i].lightblue;
						this.cliques[i].rectangle.strokeColor = this.cliques[i].lightblue;
						this.cliques[i].text.strokeColor = this.cliques[i].lightblue;
						this.cliques[i].text.fillColor = this.cliques[i].lightblue;
						this.cliques[i].linkPointText.strokeColor = this.cliques[i].lightblue;
					}
				}
					
				}.bind(this);
				/*
				this.unLinkWithCliques = function(){
					this.linkVisible = false;
					for (var i = 0; i < this.paths.length; i++) {
						this.paths[i].remove();
					}
					for (var i = 0; i < this.cliques.length; i++) {
						this.cliques[i].pointt.visible = this.cliques[i].cliVisible;
					}
				}

				this.linkWithWords = function(thickness){
					for (var i = 0; i < this.cliques.length; i++) {
						this.cliques[i].linkWithWords(thickness);
					}
				}

				this.unLinkWithWords = function(thickness){
					for (var i = 0; i < this.cliques.length; i++) {
						this.cliques[i].unLinkWithWords();
					}
				}*/

				this.circle.onMouseEnter = function(){
					this.showCliquesHtml();
					if(!this.clicked){
						this.show();
						if(!allAreasVisible){
							this.enveloppeCli();
						}
						this.circle.scale(1.5);
						if(this.enveloppe != undefined){
							if(allAreasVisible){
								this.enveloppe.strokeWidth = 2;
								this.enveloppe.strokeColor = this.enveloppeColor2;
							}else{
								this.enveloppe.strokeWidth = 1;
								this.enveloppe.strokeColor = this.enveloppeColor1;
							}
						}
					}else{
						if(this.enveloppe != undefined){
							this.enveloppe.strokeWidth = 2;
							this.enveloppe.strokeColor = this.enveloppeColor2;
						}
					}
					
					
				}.bind(this);

				this.circle.onMouseLeave = function(event){
					if(this.enveloppe != undefined){
						this.enveloppe.strokeWidth = 1;
						this.enveloppe.strokeColor = this.enveloppeColor1;
					}
					if(!this.clicked){
						this.circle.scale(0.666);
						this.hide();
						if(!allAreasVisible){
							if(this.enveloppe != undefined){
								this.enveloppe.remove();
							}
						}else{
							console.log("bah");
							this.enveloppe.strokeWidth = 1;
							this.enveloppe.strokeColor = this.enveloppeColor1;
						}
					}else{
						if(this.enveloppe != undefined){
							if(allAreasVisible){
								
							}
						}
				}
				}.bind(this);

				this.circle.onClick = function(event){
					if(this.clicked){
						this.clicked=false;
						this.unselect();
						if(!allAreasVisible){
							if(this.enveloppe!=undefined){
								this.enveloppe.remove();
							}
							
						}
					}
					else{
						this.clicked = true;
						this.select();
						//this.enveloppeCli();
					}
				}.bind(this);


				this.enveloppeCli = function(){
					this.showCliques(true);
					console.log(showAreas);
					if(showAreas){
						if(this.enveloppe != undefined){
							this.enveloppe.remove();
						}

					if (this.cliques.length == 1){
						this.enveloppe = new paper.Path.Circle(this.point, 9);
					} else if (this.cliques.length == 2) {

							let center = new paper.Point((this.cliques[0].point.x + this.cliques[1].point.x) / 2, (this.cliques[0].point.y + this.cliques[1].point.y) / 2);
							let length = Math.sqrt(Math.pow(this.cliques[0].point.x - this.cliques[1].point.x, 2) + Math.pow(this.cliques[0].point.y - this.cliques[1].point.y, 2));
							length = length + 10;
							var rect = new paper.Rectangle(0, 0, length, 14);
							//on positionne le rectangle : 
							rect.center = center;
							rect = new paper.Path.Rectangle(rect, 7);
							let angle =  Math.atan((this.cliques[0].point.y - this.cliques[1].point.y) / (this.cliques[0].point.x - this.cliques[1].point.x));

							angle = angle * 180 / 3.14;
							rect.rotate(angle);
							this.enveloppe = rect;
					} else {
						var convexHull = new ConvexHullGrahamScan();
						for (var i = 0; i < this.cliques.length; i++) {
							convexHull.addPoint(this.cliques[i].point.x, this.cliques[i].point.y);
						}
						var enveloppePoints = convexHull.getHull();
						
						this.enveloppe = new paper.Path(enveloppePoints);
						this.enveloppe.closed = true;
						this.enveloppe.smooth({ type: 'catmull-rom' });
					}
					
					this.enveloppe.strokeColor = this.enveloppeColor1;
					this.enveloppe.strokeWidth = 1;
					this.enveloppe.onMouseEnter = function(){
						this.enveloppe.strokeWidth = 2;
						this.enveloppe.strokeColor = this.enveloppeColor2;
						if(!this.clicked){
							this.show();
						}
					}.bind(this);
					this.enveloppe.onMouseLeave = function(){
						this.enveloppe.strokeWidth = 1;
						this.enveloppe.strokeColor = this.enveloppeColor1;
						if(!this.clicked){
							this.hide();
						}
					}.bind(this);
				}
					
				}.bind(this);

				

				this.label.onMouseEnter = function(){
					if(this.enveloppe != undefined){
						this.enveloppe.strokeWidth = 2;
						this.enveloppe.strokeColor = this.enveloppeColor2;
					}
					this.showCliquesHtml();
				}.bind(this);

				this.label.onMouseLeave = function(event){
					if(this.enveloppe != undefined){
						this.enveloppe.strokeWidth = 1;
						this.enveloppe.strokeColor = this.enveloppeColor1;
					}
					if(!showallAreas){
						this.enveloppe.remove();
					}
					
				}.bind(this);
				
				this.label.onClick = function(event){
					if(event.delta.x == 0 && event.delta.y == 0){
						if(this.clicked){
							this.clicked=false;
							this.hide();
							this.unselect();
							this.circle.scale(0.666);
							if(!allAreasVisible){
								this.enveloppe.remove();
							}
							
						}
					}
				}.bind(this);

				this.label.onMouseDrag = function(event) {
           			this.label.position.x += event.delta.x;
    				this.label.position.y += event.delta.y;
					this.updateLabel();
					
				}.bind(this);

				this.updateLabel= function(){
					this.linkPointText.firstSegment.point = this.circle.position;
					let a = new paper.Point(this.text.bounds.left, this.text.bounds.bottom);
					//this.text.rectangle.position = this.text.position;
					this.linkPointText.lastSegment.point = a;
    				this.linkPointText.strokeColor = this.selectedColor;
					this.linkPointText.strokeWidth = 1;
				}

				this.span.click(function(){
					if(this.clicked){
						this.clicked=false;
						this.unselect();
						if(!allAreasVisible){
							if(this.enveloppe!=undefined){
								this.enveloppe.remove();
							}
							
						}
					}
					else{
						this.clicked = true;
						this.select();
						//this.enveloppeCli();
					}						
				}.bind(this));

				this.span.mouseenter(function(){
					if(!this.clicked){
						this.show();
						this.showCliquesHtml();
						//this.linkWithCliques(0.5);
						if(!allAreasVisible){
							this.enveloppeCli();
						}else{
							this.enveloppe.strokeWidth = 2;
							this.enveloppe.strokeColor = this.enveloppeColor2;
						}
						this.circle.scale(1.5);
					}else{
						this.enveloppe.strokeWidth = 2;
						this.enveloppe.strokeColor = this.enveloppeColor2;
					}			
				}.bind(this));

				this.span.mouseleave(function(){
					if(!this.clicked){
					this.circle.scale(0.666);
					this.hide();
					if(!allAreasVisible){
						if(this.enveloppe!=undefined){
								this.enveloppe.remove();
							}
					}else{
						this.enveloppe.strokeWidth = 1;
						this.enveloppe.strokeColor = this.enveloppeColor1;
					}
				}else{
					this.enveloppe.strokeWidth = 1;
					this.enveloppe.strokeColor = this.enveloppeColor1;
				}		
				}.bind(this));

				
				

				this.setAxis = function(x, y){
						x = 0.4*this.coords[x]*paper.view.bounds.width/extremevalues[x];
						y = 0.4*this.coords[y]*paper.view.bounds.height/extremevalues[y];
						this.setCoordinates(x, y);
				}.bind(this);

				this.setCoordinates = function(x, y){

					this.point.x = x;
					this.point.y = y;
					
					this.circle.position = this.point;
					this.text.position = new paper.Point(this.point.x, this.point.y - 30);
					this.hide();
					this.unselect();
					this.updateLabel();
					if(this.enveloppe != undefined){
						this.enveloppe.remove();
					}
					if(this.clicked){
						this.show();
						this.select();
					}
					

				}.bind(this);

				

				
		}



		function Cli(clique, i){
				this.lightblue = new paper.Color(0, 0, 1, 0.5);
				this.hardblue = new paper.Color(0, 0, 1, 1);
				this.index = i;
				this.mots = clique;
				for (var i = 0; i < this.mots.length; i++) {
					for (var j = 0; j < syns.length; j++) {
						if(this.mots[i] == syns[j].mot){
							this.mots[i]= syns[j];
						}
					}
				}
				this.clicked = false;
				this.coords = coords[this.index];
           		this.point = new paper.Point(0,0);
           		this.cliVisible = false;

           		this.text = new paper.PointText(new paper.Point(this.point.x, this.point.y));
           		this.text.visible = false;
				this.text.justification = 'center';
				this.text.fillColor = this.lightblue;
				this.text.fontSize = 15;
				this.labelText = "";
				for (var i = 0; i < this.mots.length; i++) {
					if(i == 0){
						this.labelText = this.mots[i].mot;
					}else{
						this.labelText = this.labelText + " " +this.mots[i].mot;
					}
					
				}
				this.text.content = this.labelText;

				let b = new paper.Rectangle(this.text.bounds);
				b.width = b.width*1.2;
				b.height = b.height*1.1;
				this.rectangle = new paper.Path.Rectangle(b);
				this.rectangle.strokeColor = this.lightblue;
				this.rectangle.visible = false;

				let a = new paper.Point(this.text.bounds.bottom, this.text.bounds.left);
           		this.linkPointText = new paper.Path.Line(this.point, a);
           		this.linkPointText.strokeColor = this.lightblue;
				this.linkPointText.visible = false;

				this.label = new paper.Group([this.text, this.rectangle]); 

           		let c = new paper.Path.Line({
    				from: [-5, 0],
    				to: [5, 0],
  				});
           		let d = new paper.Path.Line({
    				from: [0, -5],
    				to: [0, 5],
  				});
           		//this.pointt = new paper.CompoundPath({children : [c, d]});
           		//this.pointt.strokeWidth = 1;
           		//this.pointt.strokeColor = "black";
           		this.pointt = new paper.Path.Circle(this.point, 1 + 0.5*Math.pow(this.mots.length, 1.3));
           		this.pointt.fillColor = this.lightblue;
           		this.pointt.visible = false;
           		this.paths = [];



           		this.show = function() {
           			this.pointt.scale(1.5);
           			this.pointt.fillColor = this.hardblue;
           			//this.pointt.strokeWidth = 2;
           			this.text.position = new paper.Point(this.point.x, this.point.y - 30);
					this.text.fillColor = this.lightblue;
					this.rectangle.strokeColor = this.lightblue;
					this.rectangle.position = this.text.position;
					
					this.linkPointText.firstSegment.point = this.point;
					this.linkPointText.lastSegment.point = new paper.Point(this.text.bounds.left, this.text.bounds.bottom);
    				this.linkPointText.strokeColor = this.lightblue;
					this.linkPointText.strokeWidth = 1;
					this.text.visible = true;
					this.rectangle.visible = true;
					this.linkPointText.visible = true;
           		}.bind(this);

           		this.hide = function() {
           			this.pointt.scale(0.666);
           			this.pointt.fillColor = this.lightblue;
           			//this.pointt.strokeWidth = 1;
           			this.labelVisible = false;
					this.linkPointText.visible = false;
					
					this.linkPointText.strokeColor = this.lightblue;
					this.text.visible = false;
					this.rectangle.visible = false;
           		}.bind(this);

           		this.select = function(){
           			this.text.fillColor = this.hardblue;
           			this.linkPointText.strokeColor = this.hardblue;
           			this.rectangle.strokeColor = this.hardblue;
           		}

           		

           		this.updateLabel= function(){
					this.linkPointText.firstSegment.point = this.point;
					let a = new paper.Point(this.text.bounds.left, this.text.bounds.bottom);
					this.linkPointText.lastSegment.point = a;
    				this.linkPointText.strokeWidth = 1;
				}

				this.showWords= function(yes){
					for (var i = 0; i < this.mots.length; i++) {
						if(!this.mots[i].clicked){
							if(yes){
								this.mots[i].show();
							}
							else{
								this.mots[i].hide();
							}
						}
					}
				}.bind(this);

           		

           		this.linkWithWords = function(thickness){
           			for (var i = 0; i < this.mots.length; i++) {
           				let a = new paper.Path.Line(this.point, this.mots[i].point);
						a.strokeColor = 'black';
						a.strokeWidth = thickness;
						this.paths.push(a);
           			}
           		}.bind(this);

           		this.unLinkWithWords = function(){
           			for (var i = 0; i < this.paths.length; i++) {
						this.paths[i].remove();
					}
           		}.bind(this);

           		this.label.onMouseDrag = function(event) {
           			this.label.position.x += event.delta.x;
    				this.label.position.y += event.delta.y;
					this.updateLabel();
					
				}.bind(this);

				this.label.onClick = function(event) {
					if(event.delta.x == 0 && event.delta.y == 0){
						this.clicked = false;
						this.hide();
						this.text.visible = false;
						this.unLinkWithWords();
						if(allLinkVisible){
							//this.linkWithWords(0.1);
						}
					}
           		}.bind(this);

           		this.label.onMouseEnter = function(event) {
					this.showWords(true);
           		}.bind(this);

           		this.label.onMouseLeave = function(event) {
					this.showWords(false);
           		}.bind(this);

           		this.pointt.onMouseEnter = function(event){
           			//this.showWords(true);
           			if(!this.clicked){
           				this.show();
           				this.linkWithWords(0.5);
           			}
				}.bind(this);
				this.pointt.onClick = function(event){
					if(this.clicked){
						this.clicked = false;
						this.unLinkWithWords();
						//this.linkWithWords(0.5);
					}else{
						//this.linkWithWords(1);
						this.clicked = true;
						this.select();
					}
				}.bind(this);
				this.pointt.onMouseLeave = function(event){
					this.showWords(false);
					if(!this.clicked){
						this.hide();
						this.text.visible = false;
						this.unLinkWithWords();
						if(allLinkVisible){
							this.linkWithWords(0.1);
						}
					}
				}.bind(this);
				
				this.setAxis = function(x, y){
					this.setCoordinates(0.4*this.coords[x]*paper.view.bounds.width/extremevalues[x], 0.4*this.coords[y]*paper.view.bounds.height/extremevalues[y])

				}.bind(this);

				this.setCoordinates= function(x, y){

					this.point.x = x;
					this.point.y = y;
					this.updateLabel();
					this.pointt.position = this.point;
					console.log("cliVisible : " + cliVisible);
					if(cliVisible){
						this.pointt.visible = true;
					}
					
				}

		}

		function clearpage(){
			
		}

		function espsem(data, statut){
			//netoyer la page avant d'ajouter les nouvelles données
			syns = null;
			cliques = null;
			coords=null;
			paper.project.clear();
			$("#clilist").html("");
			$("#clispan").html("");
			$("#synlist").html("");
			$('#axe1').val(0);
			$('#axe2').val(1);
			$('#Tool').val(0);

			$('#showAreas').prop('checked', false);
			$('#showalllink').prop('checked', false);
			$('#showallAreas').prop('checked', false);
			$('#showcli').prop('checked', false);
			cliVisible = false;
			allLinkVisible = false;
			allAreasVisible = false;
			showAreas = false;
			extremevalues = [0, 0, 0, 0, 0, 0];




			background = new paper.Path.Rectangle(paper.view.bounds);
			background.fillColor = "white";


			background.onClick = function(event) {
				if(event.delta.x == 0 && event.delta.y == 0){
					switch($('#Tool').val()) {
	    		case "zoomIn":
					for (var i = 0; i < syns.length; i++) {
	    				let x2 = (syns[i].point.x - event.point.x)*1.4 ;
	    				let y2 = (syns[i].point.y - event.point.y)*1.4;
	    				syns[i].setCoordinates(x2, y2);
	    			}
	    			for (var i = 0; i < cliques.length; i++) {
	    				let x2 = (cliques[i].point.x - event.point.x)*1.4;
	    				let y2 = (cliques[i].point.y - event.point.y)*1.4;
	    				cliques[i].setCoordinates(x2, y2);
	    			}
	        	break;
	    		case "zoomOut":
	    			for (var i = 0; i < syns.length; i++) {
	    				let x2 = (syns[i].point.x - event.point.x)*0.7;
	    				let y2 = (syns[i].point.y - event.point.y)*0.7 ;
	    				syns[i].setCoordinates(x2, y2);
	    			}
	    			for (var i = 0; i < cliques.length; i++) {
	    				let x2 = (cliques[i].point.x - event.point.x)*0.7;
	    				let y2 = (cliques[i].point.y - event.point.y)*0.7;
	    				cliques[i].setCoordinates(x2, y2);
	    			}
	    		break;
	       		case "Move":
	       		break;
	    		default:
	        		//code block
				}

				background.position = paper.view.center;
				background.bounds = paper.view.bounds;
				updateView();
				}
				
	    	}
	    	background.onMouseDrag = function(event) {
	    		
	    		for (var i = 0; i < syns.length; i++) {
	    				let x2 = syns[i].point.x + event.delta.x;
	    				let y2 = syns[i].point.y + event.delta.y ;
	    				syns[i].setCoordinates(x2, y2);
	    			}
	    			for (var i = 0; i < cliques.length; i++) {
	    				let x2 = cliques[i].point.x + event.delta.x;
	    				let y2 = cliques[i].point.y + event.delta.y;
	    				cliques[i].setCoordinates(x2, y2);
	    			}
	    		background.position = paper.view.center;
				background.bounds = paper.view.bounds;
				updateView();
			}
			
			data = JSON.parse(data);
			document.title = data.mot;
			
			cliques = data.cliques;
			syns = data.synonymes;
			coords = data.coords;
			getExtremsCoords();
			
			//initialise les objets Syn
			for (var i = 0; i < syns.length; i++) {
						syns[i] = new Syn(syns[i], i);
			}
			//initialise les objets Cli
			for (var i = 0; i < cliques.length; i++) {
						cliques[i] = new Cli(cliques[i], i);
			}
			
			//lie les object Syn aux objets Cli
			for (var i = 0; i < syns.length; i++) {
				for (var j = 0; j < cliques.length; j++) {
           			for (var k = 0; k < cliques[j].mots.length; k++) {
           				if (cliques[j].mots[k]==syns[i]){
           					syns[i].cliques.push(cliques[j]);
           				}
           			}
           		}
           		if(syns[i].cliques.length < 40){
           			syns[i].circle.scale(1 + 0.15*Math.pow(syns[i].cliques.length, 1.1));
           		}else{
           			syns[i].circle.scale(1 + 0.15*Math.pow(40, 1.1));
           		}
           		
			}
			
			for (var i = 0; i < syns.length; i++) {
				syns[i].setAxis(0,1);
			}
			for (var i = 0; i < cliques.length; i++) {
				cliques[i].setAxis(0,1);
			}

			
		}


		function getExtremsCoords(){
			extremevalues = [0, 0, 0, 0, 0, 0];
			for (var i = 0; i < 6; i++) {
				for (var j = 0; j < coords.length; j++) {
					if (Math.abs(coords[j][i])>extremevalues[i]){
						extremevalues[i] = Math.abs(coords[j][i]);
					}
				}
			}
		}
		
		
	}
    