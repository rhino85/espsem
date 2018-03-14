/*jshint esversion: 6 */


window.onload = function() {

		//configuration du canvas
		var canvas = document.getElementById('canvas');
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			paper.setup(canvas);
			paper.view.translate(paper.view.center);
		var background = new paper.Path.Rectangle(paper.view.bounds);
			background.fillColor = "White";

		//variables contenant le dessin des axes
		var axe1Line = new paper.Path.Line();
		var axe2Line = new paper.Path.Line();
		
		//variables contenant le dessin des fleches au bout des axes
		var arrow1 = new paper.Path();
		var arrow2 = new paper.Path();

		//les deux étiquete des axe X et Y
		var axe1Label, axe2Label;

		//les menus déroulant contenant les numéros d'axe
		var axe1 = document.getElementById('axe1');
		var axe2 = document.getElementById('axe2');

		//3 tableaux : 
		//cliques contiendra les objets Cli
		//syns contiendra les objets Syn
		//coords contiendra la liste de coordonnée
		var cliques, syns, coords;        

		//tableau contenant les valeurs extremes pour chaqu'un des 6 axes, utilise pour dessiner les points à la bonne échelle                                 
		var extremevalues = [0, 0, 0, 0, 0, 0];


		var cliVisible = false;									//booleen correspondant à la checkbox "Montrer les cliques"
		var allLinkVisible = false;								//booleen correspondant à la checkbox "Montrer les liens"
		var allAreasVisible = false;							//booleen correspondant à la checkbox "Montrer toutes les enveloppes"
		var showAreas = false;									//booleen correspondant à la checkbox "Montrer les enveloppes"


		
		var motvedettediv = $('#motvedette');
		motvedettediv.mouseenter(function(){							//evenements correspondant au passage sur la div "motvedette"
			$('#motvedette > p').css("color", "hsla(0,0%,0%, 1)");					//modification dynamique du css avec jquery
			$('#motvedette > #word').css("border-color", "hsla(0,0%,0%, 0.2)");		//modification dynamique du css avec jquery
		});
		motvedettediv.mouseleave(function(){							//evenements correspondant au passage sur la div "motvedette"
			$( this ).css("border-color", "hsla(0,0%,0%, 0)");						//modification dynamique du css avec jquery
			$('#motvedette > p').css("color", "hsla(0,0%,0%, 0.2)");				//modification dynamique du css avec jquery
			$('#motvedette > #word').css("border-color", "hsla(0,0%,0%, 0)");		//modification dynamique du css avec jquery
		});

		
		$('#axe1').mouseenter(function(){								//evenement : la souris entre dans la div "axe1"
			$( this ).css("border-color", "hsla(0,0%,0%, 0.2)");
		});
		$('#axe1').mouseleave(function(){								//evenement : la souris sors de la div "axe1"
			$( this ).css("border-color", "hsla(0,0%,0%, 0)");
		});
		$('#axe2').mouseenter(function(){								//evenement : la souris entre dans la div "axe2"
			$( this ).css("border-color", "hsla(0,0%,0%, 0.2)");
		});
		$('#axe2').mouseleave(function(){								//evenement : la souris sors de la div "axe1"
			$( this ).css("border-color", "hsla(0,0%,0%, 0)");
		});

		$("#zoomIn").mouseenter(function(){								//similaire bouton zoom
			$( this ).css("border-color", "hsla(0,0%,0%, 0.3)");
		});

		$("#zoomIn").mouseleave(function(){								//similaire bouton zoom
			$( this ).css("border-color", "hsla(0,0%,0%, 0)");
		});

		$("#zoomOut").mouseenter(function(){							//etc
			$( this ).css("border-color", "hsla(0,0%,0%, 0.3)");
		});

		$("#zoomOut").mouseleave(function(){							//etc
			$( this ).css("border-color", "hsla(0,0%,0%, 0)");
		});

		$("#resetView").mouseenter(function(){
			$( this ).css("border-color", "hsla(0,0%,0%, 0.3)");
		});

		$("#resetView").mouseleave(function(){
			$( this ).css("border-color", "hsla(0,0%,0%, 0)");
		});

		$('#axe1').change(function(){									//quand l'utilisateur utilise la liste de selection d'axe
			updateAxis();
		});
		$('#axe2').change(function(){									//quand l'utilisateur utilise la liste de selection d'axe
			updateAxis();
		});

		$('#centerview').click(function(){
			updateAxis();
		});

		$('#listebutton').click(function(){								//evenement clique sur bouton "liste"
			if($("#lists").css("visibility") == "hidden"){				//si la div "lists" est cachée
				$('#listebutton').html("<< listes");
				$("#sidemenu").css("visibility", "visible");				//la div "lists" devient visible
				motvedettediv.css("left", "27%");							//on décale la div de recherche de mot
				$('#listebutton').css("left", "27%");						//on décale le bouton "listes"


			}else{														//comportement inverse si la div "lists" est déjà visible
				$("#sidemenu").css("visibility", "hidden");
				$('#listebutton').html("listes");
				motvedettediv.css("left", "2%");
				$('#listebutton').css("left", "2%");

			}
			
		});

		$('#helpbutton').click(function(){								//evenement clique sur bouton help
			if($("#help").css("visibility") == "hidden"){
				$("#help").css("visibility", "visible");
			}else{
				$("#help").css("visibility", "hidden");
			}
			
		});

		$('#optionbutton').click(function(){							//evenement clique sur bouton option
			if($("#options").css("visibility") == "hidden"){
				$("#options").css("visibility", "visible");
			}else{
				$("#options").css("visibility", "hidden");
			}
			
		});

		$('#showcli').change(function(){								//checkbox "Montrer les cliques"
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
		});

		$('#showAreas').change(function(){							//checkbox "montrer les enveloppes"
			
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
					if(syns[i].enveloppe !== undefined){
						syns[i].enveloppe.remove();
					}
				}
			}
		});

		$('#showalllink').change(function(){						//checkbox "montrer tout les liens"
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
		});

		$('#showallAreas').change(function(){						//checkbox "montrer toutes les enveloppes"
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
		});


		canvas.addEventListener('click', function(){
			if($("#help").css("visibility") == "visible"){
				$("#help").css("visibility", "hidden");
			}
		});
		canvas.addEventListener('mousewheel', mouseWheelEvent); // For Chrome				//evenement molette souris
		canvas.addEventListener('DOMMouseScroll', mouseWheelEvent); // For Firefox			//evenement molette souris


		function mouseWheelEvent(e) {														//fonction appelée lors de l'utilisation de la molette
		    let delta = e.wheelDelta ? e.wheelDelta : -e.detail;							
			let point = new paper.Point(e.offsetX, e.offsetY);
			
			point = paper.view.viewToProject(point);
			if(delta > 0){ 																	//zoom in
				
				arrow1.position.x = (arrow1.position.x)*1.4;
				arrow2.position.y = (arrow2.position.y)*1.4;

				axe1Label.position.x = arrow1.position.x + 15;
	    		axe2Label.position.y = arrow2.position.y - 15;

	    		if((paper.view.projectToView(axe1Label.position).x + 10) < window.innerWidth - 20 && (paper.view.projectToView(axe1Label.position).x + 10) > 20){
	    			$('#axe2').css({"top": paper.view.projectToView(axe1Label.position).y + 15, "left": paper.view.projectToView(axe1Label.position).x + 10});
	    		}
	    		if((paper.view.projectToView(axe2Label.position).y - 50) < window.innerHeight -20 && (paper.view.projectToView(axe2Label.position).y - 50) > 20){
	    			$('#axe1').css({"top": paper.view.projectToView(axe2Label.position).y - 50, "left": paper.view.projectToView(axe2Label.position).x - 70});
	    		}

				axe1Line.firstSegment.point.x = (axe1Line.firstSegment.point.x)*1.4;
	    		axe1Line.firstSegment.point.y = paper.view.bounds.bottom;

	    		axe1Line.lastSegment.point.x = (axe1Line.lastSegment.point.x)*1.4;
	    		axe1Line.lastSegment.point.y = paper.view.bounds.top;
	    		
	    		axe2Line.firstSegment.point.x = paper.view.bounds.left;
	    		axe2Line.firstSegment.point.y = (axe2Line.firstSegment.point.y)*1.4;

	    		axe2Line.lastSegment.point.x = paper.view.bounds.right;
	    		axe2Line.lastSegment.point.y = (axe2Line.lastSegment.point.y)*1.4;
				for (var i = 0; i < syns.length; i++) {
    				let x2 = (syns[i].point.x)*1.4 ;
    				let y2 = (syns[i].point.y)*1.4;
    				syns[i].setCoordinates(x2, y2);
    				syns[i].label.position.x = syns[i].label.position.x * 1.4;
    				syns[i].label.position.y = syns[i].label.position.y * 1.4;
					syns[i].updateLabel();
    			}
    			for (var i = 0; i < cliques.length; i++) {
    				let x2 = (cliques[i].point.x)*1.4;
    				let y2 = (cliques[i].point.y)*1.4;
    				cliques[i].setCoordinates(x2, y2);
    				cliques[i].label.position.x = cliques[i].label.position.x * 1.4;
    				cliques[i].label.position.y = cliques[i].label.position.y * 1.4;
					cliques[i].updateLabel();
    			}

			}else{ 																			//zoom out meme principe que pour zoom in
				
				arrow1.position.x = (arrow1.position.x)*0.8;
				arrow2.position.y = (arrow2.position.y)*0.8;

				axe1Label.position.x = arrow1.position.x + 15;
	    		axe2Label.position.y = arrow2.position.y - 15;

	    		if((paper.view.projectToView(axe1Label.position).x + 10) < window.innerWidth - 20 && (paper.view.projectToView(axe1Label.position).x + 10) > 20){
	    			$('#axe2').css({"top": paper.view.projectToView(axe1Label.position).y + 15, "left": paper.view.projectToView(axe1Label.position).x + 10});
	    		}
	    		if((paper.view.projectToView(axe2Label.position).y - 50) < window.innerHeight -20 && (paper.view.projectToView(axe2Label.position).y - 50) > 20){
	    			$('#axe1').css({"top": paper.view.projectToView(axe2Label.position).y - 50, "left": paper.view.projectToView(axe2Label.position).x - 70});
	    		}

				axe1Line.firstSegment.point.x = (axe1Line.firstSegment.point.x)*0.8;
	    		axe1Line.firstSegment.point.y = paper.view.bounds.bottom;

	    		axe1Line.lastSegment.point.x = (axe1Line.lastSegment.point.x)*0.8;
	    		axe1Line.lastSegment.point.y = paper.view.bounds.top;
	    		
	    		axe2Line.firstSegment.point.x = paper.view.bounds.left;
	    		axe2Line.firstSegment.point.y = (axe2Line.firstSegment.point.y)*0.8;

	    		axe2Line.lastSegment.point.x = paper.view.bounds.right;
	    		axe2Line.lastSegment.point.y = (axe2Line.lastSegment.point.y)*0.8;
				for (var i = 0; i < syns.length; i++) {
    				let x2 = (syns[i].point.x)*0.8 ;
    				let y2 = (syns[i].point.y)*0.8;
    				syns[i].setCoordinates(x2, y2);
    				syns[i].label.position.x = syns[i].label.position.x * 0.8;
    				syns[i].label.position.y = syns[i].label.position.y * 0.8;
					syns[i].updateLabel();
    			}
    			for (var i = 0; i < cliques.length; i++) {
    				let x2 = (cliques[i].point.x)*0.8;
    				let y2 = (cliques[i].point.y)*0.8;
    				cliques[i].setCoordinates(x2, y2);
    				cliques[i].label.position.x = cliques[i].label.position.x * 0.8;
    				cliques[i].label.position.y = cliques[i].label.position.y * 0.8;
					cliques[i].updateLabel();
    			}
			}

			background.position = paper.view.center;
			background.bounds = paper.view.bounds;
			updateView();																	//permet de redessiner les enveloppes, et les liens
		}


		$(document).keypress(function(e) {													//evenement touche entrée pressée : nouvelle requête ajax pour le nouveau mot
			if(e.which == 13) {
				window.history.pushState("", "", '/'+$("#word").val());
				$.ajax({
       				url : 'data/'+$("#word").val(),
       				type : 'GET',
       				dataType : 'text',
       				success : espsem,														//si la requete ajax à réussi on appelle la fonction espsem
					error : function(resultat, statut, erreur){
       					console.log("can't get data from serveur");
       				}
				});
			}
		});

		$.ajax({																			//requête ajax au chargement de la page
       		url : 'data/'+$("#word").val(),
       		type : 'GET',
       		dataType : 'text',
       		success : espsem,																//si la requete ajax à réussi on appelle la fonction espsem
			error : function(resultat, statut, erreur){
       			console.log("can't get data from serveur");
       		}
		});

		



		


		
		
		//fonction a appeler après un changement du graphe (zoom, deplacement, changement d'axe) pour redessiner si besoin les enveloppes, les liens, etc..
		function updateView() {
			if(allAreasVisible){										 //si "Montrer toutes les enveloppes" est cochée, on redessine toute les enveloppes
				for (var i = 0; i < syns.length; i++) {
					syns[i].enveloppeCli();
				}
			}
			else{  														 //sinon on ne redessine que celle de mot sont cliqué
				for (var i = 0; i < syns.length; i++) {
					if(syns[i].clicked){
						syns[i].enveloppeCli();
					}
				}
			}
			if(allLinkVisible){  										//meme logique pour "Montrer tout les liens"
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

		
		//fonction pour redessiner le graphe en fonction des axes choisis, est appelée lorsque l'utilisateur change d'axe
		function updateAxis(){
			//on recentre les axes
			arrow1.position.x = 0;
	    	arrow2.position.y = 0;

	    	axe1Label.position.x = arrow1.position.x + 15;
	    	axe2Label.position.y = arrow2.position.y - 15;

	    	$('#axe1').css({"top": paper.view.projectToView(axe2Label.position).y - 50, "left": paper.view.projectToView(axe2Label.position).x - 70});
	    	$('#axe2').css({"top": paper.view.projectToView(axe1Label.position).y + 15, "left": paper.view.projectToView(axe1Label.position).x + 10});

			axe1Line.firstSegment.point.x = 0;
	    	axe1Line.firstSegment.point.y = paper.view.bounds.bottom;

	    	axe1Line.lastSegment.point.x = 0;
	    	axe1Line.lastSegment.point.y = paper.view.bounds.top;
	    		
	    	axe2Line.firstSegment.point.x = paper.view.bounds.left;
	    	axe2Line.firstSegment.point.y = 0;

	    	axe2Line.lastSegment.point.x = paper.view.bounds.right;
	    	axe2Line.lastSegment.point.y = 0;
			
			var x = parseInt($('#axe1').val());
			var y = parseInt($('#axe2').val());
			
			for (var i = 0; i < cliques.length; i++) {									//appelle la methode setAxis pour chaque objet Cli
				cliques[i].setAxis(x, y);
			}
			for (var i = 0; i < syns.length; i++) {
				syns[i].setAxis(x, y);													//appelle la methode setAxis pour chaque objet Syn
			}
			updateView();																//redessine les enveloppe est les liens
		}

		//////////////////////////////////////////////////////////////////////////////////////
		//début de la fonction pour la construction et instantiation de l'objet Syn (pour les synonymes)
		//////////////////////////////////////////////////////////////////////////////////////
		function Syn(asyn, i){

			//degradé de vert en fonction des états d'un mot
			this.normalColor = new paper.Color(0.8, 0, 0.8, 0.55);
			this.snapColor = new paper.Color(0.8, 0, 0.8, 0.55);
			this.selectedColor = new paper.Color(0, 0.6, 0, 0.7);

			//couleur des enveloppes
			this.enveloppeColor1 = new paper.Color(1, 0, 0, 0.6);
			this.enveloppeColor2 = new paper.Color(1, 0, 0, 1);

			//index du mot
			this.index = i;

			//la chaine de texte du mot
			this.mot = asyn;

			//tableau contenant les 6 coordonnées du mot
       		this.coords = coords[i + cliques.length]; 

       		//tableau contenant les references des objets Cli du mot (rempli après l'instanciation du mot)
       		this.cliques = []; 

       		//variable pour stocker l'état du mot - cliqué (vert) ou non-cliqué (magenta) -
       		this.clicked=false;

       		this.linkVisible = false;
       		
       		//la coordonnée du point sur le graphe, initialisée au centre
       		this.point = new paper.Point(0,0);

       		//définition et dessin sur le graphe du point (le cercle magenta/vert)
       		this.circle = new paper.Path.Circle(this.point, 2.5);
       		this.circle.fillColor = this.normalColor;
       		
       		//this.text correspond à l'étiquette du mot, celle qui apparait quand on clique sur un point
       		this.text = new paper.PointText(new paper.Point(this.point.x, this.point.y - 30));
       		this.text.visible = false;
       		this.text.justification = 'center';
       		this.text.fillColor = this.selectedColor;
       		this.text.fontSize = 17;
       		this.text.content = this.mot;

       		//dessin du cadre entourant l'étiquette du mot
       		let b = new paper.Rectangle(this.text.bounds);;
       		b.width = b.width*1.3;
       		b.height = b.height*1.2; 
       		this.rectangle = new paper.Path.Rectangle(b);
       		this.rectangle.strokeColor = this.normalColor;
       		this.rectangle.visible = false;

       		//defini un groupe comprenant this.text et this.rectangle (permet de modififier les deux en même temps)
       		this.label = new paper.Group([this.text, this.rectangle]);

       		//dessin du trait reliant le point (this.circle) et l'étiquette (this.text)
       		let a = new paper.Point(this.text.bounds.bottom, this.text.bounds.left);
       		this.linkPointText = new paper.Path.Line(this.circle.position, a);
       		this.linkPointText.strokeColor = this.normalColor;
       		this.linkPointText.visible = false;

       		this.paths = [];

       		//variable pour stocker l'enveloppe du mot
       		this.enveloppe = null;

       		//chargement de la liste des synonymes
       		this.html = $("<div class='syn' id='" + this.index + "'></div>").appendTo("#synlist");
       		this.span = $("<span id='" + this.index + "'>" + this.mot + "</span>").appendTo(this.html);
       		
       		//afficher l'étiquette du mot
       		this.show = function(){

				this.text.position = new paper.Point(this.point.x, this.point.y - 30);
       			this.text.fillColor = this.normalColor;
       			this.rectangle.strokeColor = this.normalColor;
       			this.rectangle.position = this.text.position;
				this.linkPointText.firstSegment.point = this.circle.position;
       			this.linkPointText.lastSegment.point = new paper.Point(this.text.bounds.left, this.text.bounds.bottom);
       			this.linkPointText.strokeColor = this.normalColor;
       			this.linkPointText.strokeWidth = 1;
       			this.labelVisible = true;
       			this.text.visible = true;
       			this.rectangle.visible = true;
       			this.linkPointText.visible = true;

			}.bind(this);

			//cache l'étiquette du mot
       		this.hide = function(){
       			this.labelVisible = false;
       			this.linkPointText.visible = false;
       			this.text.visible = false;
       			this.rectangle.visible = false;
				this.circle.fillColor = this.normalColor;
       		};

			//affiche les cliques dans la colonne clique
       	this.showCliquesHtml = function(){
				$("#clilist").html("");
       			$("#clispan").html("");
       			$("#clispan").append(this.mot);
       			for (var i = 0; i < this.cliques.length; i++) {
       				var html = "<div class='clique' id="+this.cliques[i].index+">";
       				for (var j = 0; j < this.cliques[i].mots.length; j++) {
       					html = html + this.cliques[i].mots[j].mot + ' ';
       				}
       				html = html + "</div>";
       				$("#clilist").append(html);
       			}
       		}.bind(this);


       		//methode pour le passage au vert du mot, et passage du mot en gras dans la liste des synonymes
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

       																					//gere le passage des cliques du mot en rouge ou bleu
       		this.showCliques = function(yes){
				if(yes){ 																//on passe les cliques du mot en rouge
       				for (var i = 0; i < this.cliques.length; i++) {             		//parcours du tableau de clique du mot
						this.cliques[i].isRed++;										//je gère l'état (rouge/bleu) d'une clique avec un entier que j'incrémente et décremente quand l'un des mot de la clique est séléctionné, un simple booléen ne suffit pas car son état dépend de chacun des mots qui la compose
       					this.cliques[i].pointt.fillColor = this.enveloppeColor1;
       					this.cliques[i].rectangle.strokeColor = this.enveloppeColor1;
       					this.cliques[i].text.fillColor = this.enveloppeColor1;
       					this.cliques[i].linkPointText.strokeColor = this.enveloppeColor1;
       				}
       			}else{ 																	//on verifie qu'on peut passer la clique en bleu, si c'est le cas on le passe en bleu
       				for (var i = 0; i < this.cliques.length; i++) {			
       					this.cliques[i].isRed--;
       					if(this.cliques[i].isRed===0){  									//la clique repasse en bleu quand la variable isRed est à 0 (signifie qu'aucun des mots de la clique n'est selectionné)
       						if(this.cliques[i].clicked){
       							this.cliques[i].pointt.fillColor = this.cliques[i].hardblue;
       							this.cliques[i].rectangle.strokeColor = this.cliques[i].hardblue;
       							this.cliques[i].text.fillColor = this.cliques[i].hardblue;
       							this.cliques[i].linkPointText.strokeColor = this.cliques[i].hardblue;
       						}else{
       							this.cliques[i].pointt.fillColor = this.cliques[i].lightblue;
       							this.cliques[i].rectangle.strokeColor = this.cliques[i].lightblue;
       							this.cliques[i].text.fillColor = this.cliques[i].lightblue;
       							this.cliques[i].linkPointText.strokeColor = this.cliques[i].lightblue;
       						}
       					}


       				}
       			}

       		}.bind(this);

       		//evenement ;  la fonction déclarée se déclenche quand la souris entre dans un cercle
       		this.circle.onMouseEnter = function(){

       			this.showCliquesHtml();														//affichage des cliques du mot dans la zone html
       			if(!this.clicked){
       				this.showCliques(true);													//passage des cliques du mot en rouge
       				this.show();															//affichage de l'etiquette
       				if(!allAreasVisible){
       					this.enveloppeCli();												//afichage de l'enveloppe
       				}
       				this.circle.scale(1.5);													//grossissement du point
       				if(this.enveloppe !== undefined){										//reaction de l'enveloppe
       					if(allAreasVisible){
       						this.enveloppe.strokeWidth = 2;
       						this.enveloppe.strokeColor = this.enveloppeColor2;
       					}else{
       						this.enveloppe.strokeWidth = 1;
       						this.enveloppe.strokeColor = this.enveloppeColor1;
       					}
       				}
       			}else{
       				if(this.enveloppe !== undefined){
       					this.enveloppe.strokeWidth = 2;
       					this.enveloppe.strokeColor = this.enveloppeColor2;
       				}
       			}
			}.bind(this);


			//evenement ;  la fonction déclarée se déclenche quand la souris sort dans un cercle
       		this.circle.onMouseLeave = function(event){

       			if(this.enveloppe !== undefined){
       				this.enveloppe.strokeWidth = 1;
       				this.enveloppe.strokeColor = this.enveloppeColor1;
       			}
       			if(!this.clicked){

       				this.circle.scale(0.666);
       				this.hide();
       				this.showCliques(false);
       				if(!allAreasVisible){
       					if(this.enveloppe !== undefined){
       						this.enveloppe.remove();
       					}
       				}else{
       					this.enveloppe.strokeWidth = 1;
       					this.enveloppe.strokeColor = this.enveloppeColor1;
       				}
       			}else{
       				if(this.enveloppe !== undefined){
       					if(allAreasVisible){

       					}
       				}
       			}
       		}.bind(this);


       		//evenement ;  la fonction déclarée se déclenche quand la souris clique sur le cercle
       		this.circle.onClick = function(event){
       			if(this.clicked){								//si le mot est déjà cliqué alors :
       				this.clicked=false;							//booleen pour garder en mémoire l'état du mot (cliqué/non-cliqué)
       				this.unselect();							
       				if(!allAreasVisible){
       					if(this.enveloppe!==undefined){
       						this.enveloppe.remove();
       					}
					}
       			}
       			else{
       				this.clicked = true;
       				this.select();
				}
			}.bind(this);


			//méthode pour l'affichage de l'enveloppe
			this.enveloppeCli = function(){
				
				if(showAreas){


					if(this.enveloppe !== undefined){ 										//si l'enveloppe est déjà affiché on la supprime
						this.enveloppe.remove();
					}

					if (this.cliques.length == 1){  										// si le mot n'a qu'une seule clique on se contente de dessiner un cercle autour 
						this.enveloppe = new paper.Path.Circle(this.point, 9);
					} else if (this.cliques.length == 2) { 									//si le mot a exactement deux clique, on dessine un rectangle au bords arrondis autour

						let center = new paper.Point((this.cliques[0].point.x + this.cliques[1].point.x) / 2, (this.cliques[0].point.y + this.cliques[1].point.y) / 2); //position du rectangle
						let length = Math.sqrt(Math.pow(this.cliques[0].point.x - this.cliques[1].point.x, 2) + Math.pow(this.cliques[0].point.y - this.cliques[1].point.y, 2)); //longueur du rectangle
						length = length + 10;
						var rect = new paper.Rectangle(0, 0, length, 14);  					//creation d'une forme rectangulaire au bonne dimension
						rect.center = center; 
						rect = new paper.Path.Rectangle(rect, 7); 							//dessin du reclangle
						let angle =  Math.atan((this.cliques[0].point.y - this.cliques[1].point.y) / (this.cliques[0].point.x - this.cliques[1].point.x)); //on fait une rotation du rectangle :  calcul de l'angle
						angle = angle * 180 / 3.14;
						rect.rotate(angle);  												//calcul de l'angle
						this.enveloppe = rect;

					} else {  																//si il y a plus de 2 cliques :

						var convexHull = new ConvexHullGrahamScan();  						//objet permetant de trouver l'enveloppe convexe d'un nombre N de points
						for (var i = 0; i < this.cliques.length; i++) {
							convexHull.addPoint(this.cliques[i].point.x, this.cliques[i].point.y);
						}
						var enveloppePoints = convexHull.getHull();  						// tableau de points définissant l'enveloppe

						this.enveloppe = new paper.Path(enveloppePoints); 					//on créé une forme reliant les points de l'enveloppe
						this.enveloppe.closed = true; 
						this.enveloppe.smooth({ type: 'catmull-rom' });  					//adoucissement de la forme
					}

					this.enveloppe.strokeColor = this.enveloppeColor1;  					//colore l'enveloppe
					this.enveloppe.strokeWidth = 1;                                      	//epaisseur de l'enveloppe

					//evenement : quand on passe sur l'enveloppe cette fonction est appelée
					this.enveloppe.onMouseEnter = function(){   

						this.enveloppe.strokeWidth = 2;  									//l'enveloppe devient plus épaisse
						this.enveloppe.strokeColor = this.enveloppeColor2;					//l'enveloppe prend un rouge plus foncé
						if(!this.clicked){													
							this.show();													//affiche l'ettiquette du mot
							this.showCliques(true);											//passe les cliques en rouge
						}
					}.bind(this);

					//evenement : quand on quitte l'enveloppe cette fonction est appelée
					this.enveloppe.onMouseLeave = function(){
						this.enveloppe.strokeWidth = 1;
						this.enveloppe.strokeColor = this.enveloppeColor1;
						if(!this.clicked){
							this.hide();													//cache l'etiquette du mot
							this.showCliques(false);										//passe les cliques en bleu
						}
					}.bind(this);
				}
				
			}.bind(this);

			
			//evenement : fonction appelée quand on passe sur l'étiquette d'un mot
			this.label.onMouseEnter = function(){
				if(this.enveloppe !== undefined){
					this.enveloppe.strokeWidth = 2;
					this.enveloppe.strokeColor = this.enveloppeColor2;
				}
				this.showCliquesHtml();
			}.bind(this);

			//evenement : fonction appelée quand on sort de l'étiquette d'un mot
			this.label.onMouseLeave = function(event){
				if(this.enveloppe !== undefined){
					this.enveloppe.strokeWidth = 1;
					this.enveloppe.strokeColor = this.enveloppeColor1;
				}
				if(!showallAreas){
					if(this.enveloppe!==undefined){
						this.enveloppe.remove();
					}
				}
				
			}.bind(this);
			
			//evenement : fonction appelée lorsqu'un clique sur l'étiquette d'un mot
			this.label.onClick = function(event){
				if(event.delta.x === 0 && event.delta.y === 0){
					if(this.clicked){
						this.clicked=false;
						this.hide();
						this.showCliques(false);
						this.unselect();
						this.circle.scale(0.666);
						if(!allAreasVisible){
							if(this.enveloppe!==undefined){
								this.enveloppe.remove();
							}
						}
						
					}
				}
			}.bind(this);

			//evenement : gerer le cliquer-deplacer d'une étiquette
			this.label.onMouseDrag = function(event) {
				this.label.position.x += event.delta.x;
				this.label.position.y += event.delta.y;
				this.updateLabel();
				
			}.bind(this);

			//méthode pour redessiner le lien entre le cercle du mot et  son étiquette
			this.updateLabel= function(){
				this.linkPointText.firstSegment.point = this.circle.position;
				let a = new paper.Point(this.text.bounds.left, this.text.bounds.bottom);
				this.linkPointText.lastSegment.point = a;
				this.linkPointText.strokeWidth = 1;
			};

			//evenement : fonction appelée lorsqu'on clique sur un mot dans la liste de synonymes
			this.span.click(function(){
				if(this.clicked){
					this.clicked=false;
					this.unselect();
					if(!allAreasVisible){
						if(this.enveloppe!==undefined){
							this.enveloppe.remove();
						}
					}
				}
				else{
					this.clicked = true;
					this.select();
				}	


			}.bind(this));

			//evenement : fonction appelée lorsqu'on passe sur un mot dans la liste de synonymes
			this.span.mouseenter(function(){

				this.showCliquesHtml();
				if(!this.clicked){
					this.showCliques(true);
					this.show();
					if(!allAreasVisible){
						this.enveloppeCli();
					}
					this.circle.scale(1.5);
					if(this.enveloppe !== undefined){
						if(allAreasVisible){
							this.enveloppe.strokeWidth = 2;
							this.enveloppe.strokeColor = this.enveloppeColor2;
						}else{
							this.enveloppe.strokeWidth = 1;
							this.enveloppe.strokeColor = this.enveloppeColor1;
						}
					}
				}else{
					if(this.enveloppe !== undefined){
						this.enveloppe.strokeWidth = 2;
						this.enveloppe.strokeColor = this.enveloppeColor2;
					}
				}	
			}.bind(this));
  			

  			//evenement : fonction appelée lorsqu'on quitte un mot dans la liste de synonymes
			this.span.mouseleave(function(){
				if(this.enveloppe !== undefined){
					this.enveloppe.strokeWidth = 1;
					this.enveloppe.strokeColor = this.enveloppeColor1;
				}
				if(!this.clicked){

					this.circle.scale(0.666);
					this.hide();
					this.showCliques(false);
					if(!allAreasVisible){
						if(this.enveloppe !== undefined){
							this.enveloppe.remove();
						}
					}else{
						this.enveloppe.strokeWidth = 1;
						this.enveloppe.strokeColor = this.enveloppeColor1;
					}
				}else{
					if(this.enveloppe !== undefined){
						if(allAreasVisible){
							
						}
					}
				}
			}.bind(this));

			
			
			//methode appelée pars la fonction globale "updateAxis()" lors d'un changement d'axe, les parametres x et y sont les numéro d'axe (de 1 à 6)
			this.setAxis = function(x, y){
				x = 0.4*this.coords[x]*paper.view.bounds.width/extremevalues[x];
				y = 0.4*this.coords[y]*paper.view.bounds.height/extremevalues[y];
				this.setCoordinates(x, y);
			}.bind(this);


			//methode pour deplacer un point dans le graphe
			this.setCoordinates = function(x, y){
				this.point.x = x;
				this.point.y = y;
				this.circle.position = this.point;
				this.updateLabel();	
			}.bind(this);
		}
		//////////////////////////////////////////////////////////////////////
		//fin de la définition de l'objet Syn
		/////////////////////////////////////////////////////////////////////


		//////////////////////////////////////////////////////////////////////////////////////
		//début de la fonction pour la construction et instantiation de l'objet Cli (pour les cliques)
		//////////////////////////////////////////////////////////////////////////////////////
		function Cli(clique, i){
				this.lightblue = new paper.Color(0, 0, 1, 0.5);			//deux nuances de bleu pour la clique
				this.hardblue = new paper.Color(0, 0, 1, 1);
				this.index = i;											//index de la clique
				this.mots = clique;										//tableaux de mots composant la clique (initialisé avec les mots sous forme de string)

				//on remplace les mots sous forme de string par des références aux objets Syn correspondant
				for (var i = 0; i < this.mots.length; i++) {			//parcours du tableau de mot que composent la clique
					for (var j = 0; j < syns.length; j++) {				//parcours des objets Syn
						if(this.mots[i] == syns[j].mot){				//si le mot est le même :
							this.mots[i]= syns[j];						//on remplace le string par une référence à l'objet Syn
						}
					}
				}
				this.isRed = 0;											//entier pour gerer la couleur rouge du mot (voir la méthode "showCliques()" de l'objet syn)
				this.clicked = false;									//booleen (clique cliquée/non-cliquée)
				this.coords = coords[this.index];						//tableau des 6 coordonnées de la clique
           		this.point = new paper.Point(0,0);						//position de la clique, initialisée à 0
           		this.cliVisible = false;								//booléen (clique visible/non-visible)


           		//etiquette de la clique
           		this.text = new paper.PointText(new paper.Point(this.point.x, this.point.y));		
           		this.text.visible = false;
				this.text.justification = 'center';
				this.text.fillColor = this.lightblue;
				this.text.fontSize = 15;
				this.labelText = "";
				for (var i = 0; i < this.mots.length; i++) {			//boucle pour ajouter les mots dans l'étiquette
					if(i === 0){
						this.labelText = this.mots[i].mot;
					}else{
						this.labelText = this.labelText + " " +this.mots[i].mot;
					}
					
				}
				this.text.content = this.labelText;							

				//rectangle encadrant l'étiquette
				let b = new paper.Rectangle(this.text.bounds);
				b.width = b.width*1.2;
				b.height = b.height*1.1;
				this.rectangle = new paper.Path.Rectangle(b);
				this.rectangle.strokeColor = this.lightblue;
				this.rectangle.visible = false;

				//lien entre le cercle de la clique et son étiquette
				let a = new paper.Point(this.text.bounds.bottom, this.text.bounds.left);
           		this.linkPointText = new paper.Path.Line(this.point, a);
           		this.linkPointText.strokeColor = this.lightblue;
				this.linkPointText.visible = false;
				this.label = new paper.Group([this.text, this.rectangle]); 

           		//le cercle bleu de la clique
           		this.pointt = new paper.Path.Circle(this.point, 1 + 0.5*Math.pow(this.mots.length, 1.3));
           		this.pointt.fillColor = this.lightblue;
           		this.pointt.visible = false;

           		//tableau pour stocker les liens (traits sur le graphe) entre les cliques et les mots
           		this.paths = [];


           		//méthode appelée lorsqu'on passe sur la clique
           		this.show = function() {
           			this.pointt.scale(1.5);							//grossissement du cercle
           			
           			
           			//affiche l'étiquette
           			this.text.position = new paper.Point(this.point.x, this.point.y - 30);
					this.rectangle.position = this.text.position;
					this.text.visible = true;
					this.rectangle.visible = true;

					//affiche le lien entre le cercle et l'étiquette
					this.linkPointText.firstSegment.point = this.point;
					this.linkPointText.lastSegment.point = new paper.Point(this.text.bounds.left, this.text.bounds.bottom);
					this.linkPointText.strokeWidth = 1;
					
					this.linkPointText.visible = true;
           		}.bind(this);

           		//méthode appelée lorsque la souris quitte la clique
           		this.hide = function() {
           			this.pointt.scale(0.666);								//la clique reprend sa taille normale
           			if(this.isRed === 0){									//si la clique n'est pas rouge, elle repasse en bleu
           				this.pointt.fillColor = this.lightblue;
           			}
           			
           			//cacher l'étiquette:
           			this.labelVisible = false;
					this.linkPointText.visible = false;
					this.text.visible = false;
					this.rectangle.visible = false;
           		}.bind(this);


           		//méthode : passage de la clique en bleu foncé quand on clique dessus
           		this.select = function(){						
					if(this.isRed === 0){									//si le cercle n'est pas rouge, on le colore d'un bleu plus foncé		
           				this.pointt.fillColor = this.hardblue;		
           				this.text.fillColor = this.hardblue;
           				this.linkPointText.strokeColor = this.hardblue;
           				this.rectangle.strokeColor = this.hardblue;
           			}
           			
           		};

           		//fonction pour redessiner le lien entre le cercle et son étiquette lorsqu'on déplace l'étiquette
           		this.updateLabel= function(){
					this.linkPointText.firstSegment.point = this.point;
					let a = new paper.Point(this.text.bounds.left, this.text.bounds.bottom);
					this.linkPointText.lastSegment.point = a;
    				this.linkPointText.strokeWidth = 1;
				};

				//méthode, affiche les mots que composent la clique sur le graphe
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

           		//dessine les liens entre la clique et ses mots
				this.linkWithWords = function(thickness){
           			for (var i = 0; i < this.mots.length; i++) {
           				let a = new paper.Path.Line(this.point, this.mots[i].point);
						a.strokeColor = 'black';
						a.strokeWidth = thickness;
						this.paths.push(a);								//on stoque les traits dans le tableau this.paths[]
           			}
           		}.bind(this);

           		//efface les liens entre la clique et ses mots
           		this.unLinkWithWords = function(){
           			for (var i = 0; i < this.paths.length; i++) {
						this.paths[i].remove();							//on vide le tableau pour effacer les liens
					}
           		}.bind(this);

           		//evenement : la fonction gére le deplacement par cliquer-deplacer de l'étiquette 
           		this.label.onMouseDrag = function(event) {
           			this.label.position.x += event.delta.x;
    				this.label.position.y += event.delta.y;
					this.updateLabel();
					
				}.bind(this);

				//evenement : fonction executée lorsqu'on clique sur l'étiquette
				this.label.onClick = function(event) {
					if(event.delta.x === 0 && event.delta.y === 0){
						this.clicked = false;
						this.hide();
						this.text.visible = false;
						this.unLinkWithWords();
					}
           		}.bind(this);

           		//evenement : fonction executée lorsqu'on passe sur l'étiquette
           		this.label.onMouseEnter = function(event) {
					this.showWords(true);
           		}.bind(this);


           		//evenement : fonction executée lorsque la souris quitte l'étiquette
           		this.label.onMouseLeave = function(event) {
					this.showWords(false);
           		}.bind(this);



           		//evenemtn : fonction executée lorsque la souris passe sur le point bleu de la clique
           		this.pointt.onMouseEnter = function(event){
           			this.showWords(true);
           			if(!this.clicked){
           				this.show();
           				this.linkWithWords(0.5);   					//dessine les traits entre la clique et ses mots
           			}
				}.bind(this);

				//evenemtn : fonction executée lorsque la souris clique sur le point bleu de la clique
				this.pointt.onClick = function(event){
					if(this.clicked){								//si la clique est cliquée 
						this.clicked = false;						//variable qui gère l'état cliqué/non-cliqué de la clique
						this.unLinkWithWords();						//enleve les traits entre la clique et ses mots
					}else{
						this.clicked = true;						//variable qui gère l'état cliqué/non-cliqué de la clique
						this.select();
					}
				}.bind(this);

				//evenemtn : fonction executée lorsque la souris quitte le point bleu de la clique
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
				

				//methode appelée par la fonction globale "updateAxis()", 
				this.setAxis = function(x, y){
					this.setCoordinates(0.4*this.coords[x]*paper.view.bounds.width/extremevalues[x], 0.4*this.coords[y]*paper.view.bounds.height/extremevalues[y]);

				}.bind(this);


				//methode pour affecter de nouvelle coordonnnée à la clique
				this.setCoordinates= function(x, y){

					this.point.x = x;
					this.point.y = y;
					this.updateLabel();
					this.pointt.position = this.point;
					if(cliVisible){
						this.pointt.visible = true;
					}
					
				};

		}
		///////////////////////////////////////////////////////////////////////////////////
		//fin de la fonction de définition de l'objet clique
		///////////////////////////////////////////////////////////////////////////////////
	




		////////////////////////////////////////////////////////////////////////////////////
		//fonction gobale, appellée à la suite de la requête ajax (au chargement de la page, et à chaque utilisation de la barre de recherche)
		//cette fonction recoit en paramètre "data" qui contient sous format JSON toute les données stoquée dans dico pour le mot
		//////////////////////////////////////////////////////////////////////////////////////
		function espsem(data, statut){
			//netoyer la page avant d'ajouter les nouvelles données
			syns = null;
			cliques = null;
			coords=null;
			paper.project.clear();									//vide le canvas
			$("#clilist").html("");									//vide les listes de mots et de cliques
			$("#clispan").html("");
			$("#synlist").html("");
			$("#synspan").html($("#word").val());					

			$('#axe1').val(0);										//reinitialise les listes de selections d'axe									
			$('#axe2').val(1);

			$('#showAreas').prop('checked', false);					//reinitialiser les checkbox
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
			
			//affichage des axes :
			let a = new paper.Point(0, paper.view.bounds.bottom);
			let b = new paper.Point(0, paper.view.bounds.top);
			axe1Line = new paper.Path.Line(a, b);
			a = new paper.Point(paper.view.bounds.left, 0);
			b = new paper.Point(paper.view.bounds.right, 0);
			axe2Line = new paper.Path.Line(a, b);
			axe1Line.strokeColor = 'black';
			axe2Line.strokeColor = 'black';

			//dessiner des petites fleches
			arrow1 = new paper.Path();
			arrow2 = new paper.Path();
			arrow1.strokeColor = 'black';
			arrow1.add(new paper.Point(-5, paper.view.bounds.top + 8));
			arrow1.add(new paper.Point(0, paper.view.bounds.top));
			arrow1.add(new paper.Point(5, paper.view.bounds.top + 8));

			
			arrow2.strokeColor = 'black';
			arrow2.add(new paper.Point(paper.view.bounds.right - 8, -5));
			arrow2.add(new paper.Point(paper.view.bounds.right, 0));
			arrow2.add(new paper.Point(paper.view.bounds.right - 8 , 5));

			//label des axes
			axe1Label = new paper.PointText(new paper.Point(15, paper.view.bounds.top + 20));
			axe1Label.justification = 'center';
			axe1Label.fillColor = 'black';
			axe1Label.fontSize = 20;
			axe1Label.content = '';

			axe2Label = new paper.PointText(new paper.Point(paper.view.bounds.right - 10, -30));
			axe2Label.justification = 'center';
			axe2Label.fillColor = 'black';
			axe2Label.fontSize = 20;
			axe2Label.content = '';

			axe1Label.position.x = arrow1.position.x + 15;
	    	axe2Label.position.y = arrow2.position.y - 15;

	    	$('#axe1').css({"border-color": "hsla(0,0%,0%, 0)", "visibility":"visible"});
    		$('#axe2').css({"border-color": "hsla(0,0%,0%, 0)", "visibility":"visible"});
	    	
	    	$('#axe1').css({"top": paper.view.projectToView(axe2Label.position).y - 50, "left": paper.view.projectToView(axe2Label.position).x - 70});
	    	$('#axe2').css({"top": paper.view.projectToView(axe1Label.position).y + 15, "left": paper.view.projectToView(axe1Label.position).x + 10});

	    	//evenement : clique sur le bouton zoom
	    	$('#zoomIn').click(function(){															
	    		arrow1.position.x = (arrow1.position.x)*1.4;
				arrow2.position.y = (arrow2.position.y)*1.4;

				axe1Label.position.x = arrow1.position.x + 15;
	    		axe2Label.position.y = arrow2.position.y - 15;

	    		if((paper.view.projectToView(axe1Label.position).x + 10) < window.innerWidth - 20 && (paper.view.projectToView(axe1Label.position).x + 10) > 20){
	    			$('#axe2').css({"top": paper.view.projectToView(axe1Label.position).y + 15, "left": paper.view.projectToView(axe1Label.position).x + 10});
	    		}
	    		if((paper.view.projectToView(axe2Label.position).y - 50) < window.innerHeight -20 && (paper.view.projectToView(axe2Label.position).y - 50) > 20){
	    			$('#axe1').css({"top": paper.view.projectToView(axe2Label.position).y - 50, "left": paper.view.projectToView(axe2Label.position).x - 70});
	    		}

				axe1Line.firstSegment.point.x = (axe1Line.firstSegment.point.x)*1.4;
	    		axe1Line.firstSegment.point.y = paper.view.bounds.bottom;

	    		axe1Line.lastSegment.point.x = (axe1Line.lastSegment.point.x)*1.4;
	    		axe1Line.lastSegment.point.y = paper.view.bounds.top;
	    		
	    		axe2Line.firstSegment.point.x = paper.view.bounds.left;
	    		axe2Line.firstSegment.point.y = (axe2Line.firstSegment.point.y)*1.4;

	    		axe2Line.lastSegment.point.x = paper.view.bounds.right;
	    		axe2Line.lastSegment.point.y = (axe2Line.lastSegment.point.y)*1.4;
				for (var i = 0; i < syns.length; i++) {
    				let x2 = (syns[i].point.x)*1.4 ;
    				let y2 = (syns[i].point.y)*1.4;
    				syns[i].setCoordinates(x2, y2);
    				syns[i].label.position.x = syns[i].label.position.x * 1.4;
    				syns[i].label.position.y = syns[i].label.position.y * 1.4;
					syns[i].updateLabel();
    			}
    			for (var i = 0; i < cliques.length; i++) {
    				let x2 = (cliques[i].point.x)*1.4;
    				let y2 = (cliques[i].point.y)*1.4;
    				cliques[i].setCoordinates(x2, y2);
    				cliques[i].label.position.x = cliques[i].label.position.x * 1.4;
    				cliques[i].label.position.y = cliques[i].label.position.y * 1.4;
					cliques[i].updateLabel();
    			}
    			background.position = paper.view.center;
	    		background.bounds = paper.view.bounds;
	    		updateView();
	    	});


	    	//evenement : clique sur le bouton zoom out
	    	$('#zoomOut').click(function(){
	    		arrow1.position.x = (arrow1.position.x)*0.8;
				arrow2.position.y = (arrow2.position.y)*0.8;

				axe1Label.position.x = arrow1.position.x + 15;
	    		axe2Label.position.y = arrow2.position.y - 15;

	    		if((paper.view.projectToView(axe1Label.position).x + 10) < window.innerWidth - 20 && (paper.view.projectToView(axe1Label.position).x + 10) > 20){
	    			$('#axe2').css({"top": paper.view.projectToView(axe1Label.position).y + 15, "left": paper.view.projectToView(axe1Label.position).x + 10});
	    		}
	    		if((paper.view.projectToView(axe2Label.position).y - 50) < window.innerHeight -20 && (paper.view.projectToView(axe2Label.position).y - 50) > 20){
	    			$('#axe1').css({"top": paper.view.projectToView(axe2Label.position).y - 50, "left": paper.view.projectToView(axe2Label.position).x - 70});
	    		}

				axe1Line.firstSegment.point.x = (axe1Line.firstSegment.point.x)*0.8;
	    		axe1Line.firstSegment.point.y = paper.view.bounds.bottom;

	    		axe1Line.lastSegment.point.x = (axe1Line.lastSegment.point.x)*0.8;
	    		axe1Line.lastSegment.point.y = paper.view.bounds.top;
	    		
	    		axe2Line.firstSegment.point.x = paper.view.bounds.left;
	    		axe2Line.firstSegment.point.y = (axe2Line.firstSegment.point.y)*0.8;

	    		axe2Line.lastSegment.point.x = paper.view.bounds.right;
	    		axe2Line.lastSegment.point.y = (axe2Line.lastSegment.point.y)*0.8;
				for (var i = 0; i < syns.length; i++) {
    				let x2 = (syns[i].point.x)*0.8 ;
    				let y2 = (syns[i].point.y)*0.8;
    				syns[i].setCoordinates(x2, y2);
    				syns[i].label.position.x = syns[i].label.position.x * 0.8;
    				syns[i].label.position.y = syns[i].label.position.y * 0.8;
					syns[i].updateLabel();
    			}
    			for (var i = 0; i < cliques.length; i++) {
    				let x2 = (cliques[i].point.x)*0.8;
    				let y2 = (cliques[i].point.y)*0.8;
    				cliques[i].setCoordinates(x2, y2);
    				cliques[i].label.position.x = cliques[i].label.position.x * 0.8;
    				cliques[i].label.position.y = cliques[i].label.position.y * 0.8;
					cliques[i].updateLabel();
    			}
    			background.position = paper.view.center;
	    		background.bounds = paper.view.bounds;
	    		updateView();
	    	});

	    	//evenement : clique sur le bouton reset view
	    	$('#resetView').click(function(){
	    		updateAxis();
	    	});
			

			//evenement : cliquer-deplacer sur le graphe
	    	background.onMouseDrag = function(event) {

	    		arrow1.position.x = arrow1.position.x + event.delta.x;
	    		arrow2.position.y = arrow2.position.y + event.delta.y;

	    		axe1Label.position.x = arrow1.position.x + 15;
	    		axe2Label.position.y = arrow2.position.y - 15;

	    		if((paper.view.projectToView(axe1Label.position).x + 10) < window.innerWidth - 20 && (paper.view.projectToView(axe1Label.position).x + 10) > 20){
	    			$('#axe2').css({"top": paper.view.projectToView(axe1Label.position).y + 15, "left": paper.view.projectToView(axe1Label.position).x + 10});
	    		}
	    		if((paper.view.projectToView(axe2Label.position).y - 50) < window.innerHeight -20 && (paper.view.projectToView(axe2Label.position).y - 50) > 20){
	    			$('#axe1').css({"top": paper.view.projectToView(axe2Label.position).y - 50, "left": paper.view.projectToView(axe2Label.position).x - 70});
	    		}

	    		axe1Line.firstSegment.point.x = axe1Line.firstSegment.point.x + event.delta.x;
	    		axe1Line.firstSegment.point.y = paper.view.bounds.bottom;

	    		axe1Line.lastSegment.point.x = axe1Line.lastSegment.point.x + event.delta.x;
	    		axe1Line.lastSegment.point.y = paper.view.bounds.top;

	    		axe2Line.firstSegment.point.x = paper.view.bounds.left;
	    		axe2Line.firstSegment.point.y = axe2Line.firstSegment.point.y + event.delta.y;

	    		axe2Line.lastSegment.point.x = paper.view.bounds.right;
	    		axe2Line.lastSegment.point.y = axe2Line.lastSegment.point.y + event.delta.y;

	    		for (var i = 0; i < syns.length; i++) {
	    			let x2 = syns[i].point.x + event.delta.x;
	    			let y2 = syns[i].point.y + event.delta.y ;
	    			syns[i].setCoordinates(x2, y2);
	    			syns[i].label.position.x += event.delta.x;
    				syns[i].label.position.y += event.delta.y;
					syns[i].updateLabel();
	    		}
	    		for (var i = 0; i < cliques.length; i++) {
	    			let x2 = cliques[i].point.x + event.delta.x;
	    			let y2 = cliques[i].point.y + event.delta.y;
	    			cliques[i].setCoordinates(x2, y2);
	    			cliques[i].label.position.x += event.delta.x;
    				cliques[i].label.position.y += event.delta.y;
					cliques[i].updateLabel();
	    		}

	    		/*
					


	    		*/
	    		background.position = paper.view.center;
	    		background.bounds = paper.view.bounds;
	    		updateView();
	    	}
			

	    	//on recupère dans un objet javascript les données reçues sous format JSON
			data = JSON.parse(data);
			console.log(data);
			
			cliques = data.cliques;				//on initialise le tableaux de cliques
			syns = data.synonymes;				//on initialise le tableaux de synonymes
			coords = data.coords;				//on initialise le tableaux de coordonnées
			getExtremsCoords();					//on recupère les coordonnées extrèmes
			
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
           			syns[i].circle.scale(1 + 0.15*Math.pow(syns[i].cliques.length, 1.1));			//on agrandit les cercles des synonymes en fonction du nombre de cliques
           		}else{
           			syns[i].circle.scale(1 + 0.15*Math.pow(40, 1.1));								//si le synonymes a beaucoup de clique on lui donne une valeur fixe (pour éviter d'avoir des point trop grand)
           		}	
           		
			}
			
			for (var i = 0; i < syns.length; i++) {
				syns[i].setAxis(0,1);																//on initialise la position des Syn
			}
			for (var i = 0; i < cliques.length; i++) {
				cliques[i].setAxis(0,1);															//on initialise la position des Cli
			}

			
		}


		function getExtremsCoords(){									//fonction pour trouver les valeurs extremes de coordonnées pour chaques axe
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
    