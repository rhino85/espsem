window.onload = function() {

		var canvas = document.getElementById('canvas');
			canvas.width  = window.innerWidth*0.70;
			canvas.height = window.innerHeight*0.80;
			paper.setup(canvas);
			paper.view.translate(paper.view.center);
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
				cliVisible = true;
				for (var i = 0; i < cliques.length; i++) {
					cliques[i].cliVisible = false;
					cliques[i].pointt.visible = false;
				}
			}else{
				cliVisible = false;
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
				this.normalColor = new paper.Color(0, 0.65, 0);
				this.snapColor = new paper.Color(0, 0.55, 0);
				this.selectedColor = new paper.Color(0, 0.4, 0);


				this.index = i;
           		this.mot = asyn;
           		this.coords = coords[i + cliques.length];  //
           		this.cliques = []; 
           		this.clicked=false;
           		this.linkVisible = false;
           		
           		this.point = new paper.Point(0,0);

           		this.circle = new paper.Path.Circle(this.point, 4);
           		this.circle.fillColor = this.normalColor;
           		
				this.text = new paper.PointText(new paper.Point(this.point.x, this.point.y - 50/paper.view.zoom));
           		this.text.visible = false;
				this.text.justification = 'center';
				this.text.fillColor = this.normalColor;
				this.text.fontSize = 15;
				this.text.content = this.mot;
				
				let b = new paper.Rectangle(this.text.bounds);;
				b.width = b.width*1.1;
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
				}

				this.select = function(){
					this.span.css("font-weight","Bold");
					this.circle.fillColor = this.selectedColor;
					this.text.fillColor = this.selectedColor;
					this.rectangle.strokeColor=this.selectedColor;
					
				}.bind(this);

				this.unselect = function(event){
					this.span.css("font-weight","Normal");
					$("#clilist").html("");
				}.bind(this);

				/*this.linkWithCliques = function(thickness){
					for (var i = 0; i < this.cliques.length; i++) {
						//this.cliques[i].show();
						//this.cliques[i].linkWithWords(thickness/2)
						let a = new paper.Path.Line(this.point, this.cliques[i].point);
						if(this.cliques[i].cliVisible){
							this.cliques[i].pointt.visible = true;
						}
						a.strokeColor = 'black';
						a.strokeWidth = thickness/paper.view.zoom;
						this.paths.push(a);
					}
					this.linkVisible = true;
				}.bind(this);
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
								this.enveloppe.strokeWidth = 3;
							}else{
								this.enveloppe.strokeWidth = 1;
							}
						}
					}else{
						if(this.enveloppe != undefined){
							this.enveloppe.strokeWidth = 3;
						}
					}
					
					
				}.bind(this);

				this.circle.onMouseLeave = function(event){
					if(this.enveloppe != undefined){
						this.enveloppe.strokeWidth = 1;
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
					console.log(showAreas);
					if(showAreas){


					if (this.cliques.length == 1){
						this.enveloppe = new paper.Path.Circle(this.point, 7);
					} else if(this.cliques.length == 2) {

						
							//2 points
							//on prends le centre
							let center = new paper.Point((this.cliques[0].point.x + this.cliques[1].point.x) / 2, (this.cliques[0].point.y + this.cliques[1].point.y) / 2);
							//on dessine un rectangle de longueur correspondant
							let length = Math.sqrt(Math.pow(this.cliques[0].point.x - this.cliques[1].point.x, 2) + Math.pow(this.cliques[0].point.y - this.cliques[1].point.y, 2));
							length = length + 10;
							//console.log(length);
							//var bobobob= new paper.Path.Circle(center, 3);
							//bobobob.fillColor = "pink";
							var rect = new paper.Rectangle(0, 0, length, 10);
							//on positionne le rectangle : 
							rect.center = center;
							rect = new paper.Path.Rectangle(rect, 5);

							//on le fait pivoter
							//calcul de l'angle...
							/*var chien1= new paper.Path.Circle(this.cliques[0].point, 3);
							chien1.fillColor = "blue";
							var chien2= new paper.Path.Circle(this.cliques[1].point, 3);
							chien2.fillColor = "blue";*/
							let angle =  Math.atan((this.cliques[0].point.y - this.cliques[1].point.y) / (this.cliques[0].point.x - this.cliques[1].point.x));
							//angle = - center.getAngle(this.cliques[0].point);
							angle = angle * 180 / 3.14;
							console.log(angle);
							rect.rotate(angle);
							this.enveloppe = rect;

							//




						
					} else {
						var convexHull = new ConvexHullGrahamScan();
						for (var i = 0; i < this.cliques.length; i++) {
							convexHull.addPoint(this.cliques[i].point.x, this.cliques[i].point.y);
						}
						var enveloppePoints = convexHull.getHull();
						console.log(enveloppePoints);
						if(this.enveloppe != undefined){
							this.enveloppe.remove();
						}
						this.enveloppe = new paper.Path(enveloppePoints);
						this.enveloppe.closed = true;
						this.enveloppe.smooth({ type: 'catmull-rom' });
					}
					
					this.enveloppe.strokeColor = "red";
					this.enveloppe.strokeWidth = 1;
					this.enveloppe.onMouseEnter = function(){
						this.enveloppe.strokeWidth = 3;
						if(!this.clicked){
							this.show();
						}
					}.bind(this);
					this.enveloppe.onMouseLeave = function(){
						this.enveloppe.strokeWidth = 1;
						if(!this.clicked){
							this.hide();
						}
					}.bind(this);
				}
					
				}.bind(this);

				

				this.label.onMouseEnter = function(){
					if(this.enveloppe != undefined){
						this.enveloppe.strokeWidth = 3;
					}
					this.showCliquesHtml();
				}.bind(this);

				this.label.onMouseLeave = function(event){
					if(this.enveloppe != undefined){
						this.enveloppe.strokeWidth = 1;
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
							this.enveloppe.strokeWidth = 3;
						}
						this.circle.scale(1.5);
					}else{
						this.enveloppe.strokeWidth = 3;
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
					}
				}else{
					this.enveloppe.strokeWidth = 1;
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
				this.gray = new paper.Color(0.5);
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
				this.text.fillColor = this.gray;
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
				b.width = b.width*1.1;
				this.rectangle = new paper.Path.Rectangle(b);
				this.rectangle.strokeColor = this.gray;
				this.rectangle.visible = false;

				let a = new paper.Point(this.text.bounds.bottom, this.text.bounds.left);
           		this.linkPointText = new paper.Path.Line(this.point, a);
           		this.linkPointText.strokeColor = this.snapColor;
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
           		this.pointt = new paper.CompoundPath({children : [c, d]});
           		this.pointt.strokeWidth = 1;
           		this.pointt.strokeColor = "black";
           		this.pointt.visible = false;
           		this.paths = [];



           		this.show = function() {
           			this.pointt.scale(1.5);
           			this.pointt.strokeWidth = 2;
           			this.text.position = new paper.Point(this.point.x, this.point.y - 30);
					this.text.fillColor = this.gray;
					this.rectangle.strokeColor = this.gray;
					this.rectangle.position = this.text.position;
					
					this.linkPointText.firstSegment.point = this.point;
					this.linkPointText.lastSegment.point = new paper.Point(this.text.bounds.left, this.text.bounds.bottom);
    				this.linkPointText.strokeColor = this.gray;
					this.linkPointText.strokeWidth = 1;
					this.text.visible = true;
					this.rectangle.visible = true;
					this.linkPointText.visible = true;
           		}.bind(this);

           		this.hide = function() {
           			this.pointt.scale(0.666);
           			this.pointt.strokeWidth = 1;
           			this.labelVisible = false;
					this.linkPointText.visible = false;
					
					this.linkPointText.strokeColor = this.gray;
					this.text.visible = false;
					this.rectangle.visible = false;
           		}.bind(this);

           		this.select = function(){
           			this.text.fillColor = "black";
           			this.linkPointText.strokeColor = "black";
           			this.rectangle.strokeColor = "black";
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

           		this.pointt.onMouseEnter = function(event){
           			if(!this.clicked){
           				this.show();
           				this.showWords(true);
						//this.linkWithWords(0.5);
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
							//this.linkWithWords(0.1);
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
			background = new paper.Path.Rectangle(paper.view.bounds);
			background.fillColor = "White";

		background.onMouseDown = function(event) {
			console.log("quoi");
			switch($('#Tool').val()) {
    		case "zoomIn":
        		paper.view.center = event.point;
				for (var i = 0; i < syns.length; i++) {
    				let x2 = syns[i].point.x*1.4;
    				let y2 = syns[i].point.y*1.4;
    				syns[i].setCoordinates(x2, y2);
    			}
    			for (var i = 0; i < cliques.length; i++) {
    				let x2 = cliques[i].point.x*1.4;
    				let y2 = cliques[i].point.y*1.4;
    				cliques[i].setCoordinates(x2, y2);
    			}
        	break;
    		case "zoomOut":
    		console.log("tac");
        		paper.view.center = event.point;
    			for (var i = 0; i < syns.length; i++) {
    				let x2 = syns[i].point.x*0.7;
    				let y2 = syns[i].point.y*0.7 ;
    				syns[i].setCoordinates(x2, y2);
    			}
    			for (var i = 0; i < cliques.length; i++) {
    				let x2 = cliques[i].point.x*0.7;
    				let y2 = cliques[i].point.y*0.7;
    				cliques[i].setCoordinates(x2, y2);
    			}
    		break;
       		case "Move":
        		paper.view.center = event.point;
       		break;
    		default:
        		//code block
			}
			background.position = paper.view.center;
			updateView();
    	}
			
			data = JSON.parse(data);
			console.log(data);
			
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
    