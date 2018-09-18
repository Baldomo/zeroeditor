/*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  API - Qui inseriamo le funzioni da rendere disponibili a loro
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

//Aggiunge il debug a un elemento della console e va a capo
function DEBUG(out){ $("#output").html($("#output").html() + getTime()  + "s ~ " + out + "<br>");	$("#output").scrollTop($("#output")[0].scrollHeight);}

//Error handling
//Restituisce true se è avvenuto un errore
function APP_getSafeCode(code){	return `(function() {try{ ` + code + ` return false;}catch(err){DEBUG_ERROR("Errore!");	DEBUG_ERROR(err.message);return true;	}}())`;}
//Stampa una scritta in rosso
function DEBUG_ERROR(out){$("#output").html($("#output").html() + '<span style="color: red;">'+ out + "<br></span>");	$("#output").scrollTop($("#output")[0].scrollHeight);}
function DEBUG_ADMIN(out){$("#output").html($("#output").html() + '<span style="color: blue;">'+ out + "<br></span>");	$("#output").scrollTop($("#output")[0].scrollHeight);}

var APP_points;
var APP_objnumber;
function APP_updateScore(){ $("#score").html("Oggetti attuali: "+ APP_objnumber + "&nbsp;&nbsp;Punti: "+ APP_points +"&nbsp;");}

//Restituisce il secondo dell'esecuzione
var APP_appCurrentTime = 0;
function getTime(){return APP_appCurrentTime*10;}


//Restituisce informazioni sullo spheres
var APP_appSphereRosso;
function getPosition(){return {x: APP_appSphereRosso.position.x, y: APP_appSphereRosso.position.y}; }
function getVelocity(){return {x: APP_appSphereRosso.velocity.x, y: APP_appSphereRosso.velocity.y}; }

//Funzioni matematiche
function vectorMagnitude(vector1) { return Matter.Vector.magnitude(vector1);}
function vectorAdd(vector1, vector2){ return Matter.Vector.add(vector1, vector2);}
function vectorSub(vector1, vector2){ return Matter.Vector.sub(vector1, vector2);}
function vectorMult(vector1, scalar){ return Matter.Vector.mult(vector1, scalar);}
function vectorDiv(vector1, scalar){ return Matter.Vector.div(vector1, scalar);}
function vectorScale(vector1, scalar){ return Matter.Vector.mult(Matter.Vector.normalise(vector1), scalar);}
function sin(x){return Math.sin(x);}
function cos(x){return Math.cos(x);}
function tan(x){return Math.tan(x);}

//Memorizza la forza da applicare per questo secondo
var APP_appExecutionVel;
function setForces(vector){ APP_appExecutionVel = vector; }
function setVelocity(vel){ setForces( vectorSub(vel,getVelocity())); }
function setPosition(pos){  var vectBet = vectorSub(pos, getPosition());setVelocity(vectorScale(vectBet, Math.sqrt(vectorMagnitude(vectBet)*2*0.009) ));}


//Funzioni gioco
var APP_objects;
var APP_objectsHasBeenTaken;
var APP_objectsHasBeenDropped;

function getObjectPos(index){
	if(index == 1) return {x:130, y:150};
	if(index == 2) return {x:500, y:100};
	if(index == 3) return {x:120, y:500};
	if(index == 4) return {x:720, y:220};
	if(index == 5) return {x:430, y:300};
}

function pickUpObject(){
	var penality = true;
	
	for(var i = 1; i <= 5; i++){
		if(APP_objectsHasBeenTaken[i] == false)
		if(vectorMagnitude(vectorSub(getPosition(), getObjectPos(i))) < 73){
					DEBUG_ADMIN('Preso l\'oggetto numero' + i);
					APP_objectsHasBeenTaken[i] = true;
					APP_objects[i].render.opacity = 0;
					APP_objnumber++;
					APP_updateScore();
					penality = false;

		}
		 
	}
	
	if(penality){ DEBUG_ADMIN("Impossibile prendere alcun oggetto! Ricevi -1 di penalit&agrave;!");  APP_points--; APP_updateScore(); };

}

function dropObjects(){
	var penality = true;
	for(var i = 1; i <= 5; i++){
		if(APP_objectsHasBeenTaken[i] == true)
		if(APP_objectsHasBeenDropped[i] == false)
		if(vectorMagnitude(vectorSub(getPosition(), {x: APP_appSphereBlu.position.x, y: APP_appSphereBlu.position.y})) < 85){
					var pointgain = (getTime() < 440) ? 8 : ((getTime() < 940) ?  5: 3);
					DEBUG_ADMIN('Hai consegnato l\'oggetto numero ' + i + " guadagnando " + pointgain + " punti");
					APP_objectsHasBeenDropped[i] = true;
					APP_points+= pointgain;
					APP_objnumber--;
					APP_updateScore();
					penality = false;
		}
		 
	}
	if(penality){ DEBUG_ADMIN("Impossibile consegnare oggetti! Ricevi -1 di penalit&agrave;!");  APP_points--; APP_updateScore(); };
}




/*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  App - Contiene le funzioni necessarie a gestire la sfida
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
var app = {
	
	//Il codice che compare a inizio simulazione
	startingCode: `
function init(){
	
}


function loop(){
	
	DEBUG("x:" + getPosition().x);
	setPosition( {x: 200, y:600});

	
}`,
	
	initWorld: function(){
		//Mette la gravità pari a zero
		engine.world.gravity.x = 0;		engine.world.gravity.y = 0;

		// Crea lo spheres rosso
		APP_appSphereRosso = Matter.Bodies.circle(200, 300, 40, {
						density: 1,
						frictionAir: 0,
						restitution: 0,
						friction: 0,
						render: {
							sprite: {
								texture: 'res/textures/red.png'
							}
						}
		});
		
		// Crea lo spheres blu		
		APP_appSphereBlu = Matter.Bodies.circle(600, 300, 45, {
					isSensor: true,

						density: 1,
						frictionAir: 0,
						restitution: 0,
						friction: 0,
						render: {
							sprite: {
								texture: 'res/textures/base.png'
							}
						}
		});

		// Crea l'oggetto contenente l'immagine di sfondo
		var background = Matter.Bodies.rectangle(400, 300, 800, 600, {
				isSensor: true,
				isStatic: true,
				render: {
							sprite: {
								texture: 'res/textures/space.png'
							}
				}
		});
		
		
				// Crea l'oggetto contenente l'immagine di sfondo
		var asteroide = Matter.Bodies.circle(710, 880, 422, {
				isStatic: true,
				render: {
							sprite: {
								texture: 'res/textures/asteroide.png'
							}
				}
		});
		
		APP_objects = new Array(6);
		APP_objectsHasBeenTaken = new Array(6);
		APP_objectsHasBeenDropped = new Array(6);
		
		for(var i = 1; i <= 5; i++){
			APP_objects[i] = Matter.Bodies.circle(getObjectPos(i).x, getObjectPos(i).y, 35, {
				isSensor: true,
				isStatic: true,
				render: {
							sprite: {
								texture: 'res/textures/ingranaggio' + i + '_0.png'
							}
				}
		});
		}

		//Proprietà dei muri, in modo che il satellite non esca
		var offset = 10, options = { isStatic: true	};

		//Aggiunge i muri e gli oggetti alla simulazione
		Matter.World.add(engine.world,  [
				Matter.Bodies.rectangle(400, -offset, 800.5 + 2 * offset, 50.5, options),      //Muri
				Matter.Bodies.rectangle(400, 600 + offset, 800.5 + 2 * offset, 50.5, options),
				Matter.Bodies.rectangle(800 + offset, 300, 50.5, 600.5 + 2 * offset, options),
				Matter.Bodies.rectangle(-offset, 300, 50.5, 600.5 + 2 * offset, options),
				background, //Immagine di sfondo
				APP_appSphereRosso, //Palla
				APP_appSphereBlu,
				asteroide,
				APP_objects[1],APP_objects[2],APP_objects[3],APP_objects[4],APP_objects[5]
			]);
		
	},
	
	
	//Codice che gestisce l'esecuzione
	startExecution: function(){
		

		
		//Si prepara per lanciare la simulazione
		APP_onExecution = false;              //Interrompe le simulazioni lanciate precendemente
		$("#output").html("");		          //Pulisce la console
		APP_appCurrentTime = 0;               //Resetta il cronometro
		APP_points = 0;
		APP_objnumber = 0;
		APP_updateScore();
		for(var i= 1; i <= 5; i++){ APP_objectsHasBeenTaken[i] = APP_objectsHasBeenDropped[i] = false; APP_objects[i].render.opacity = 1;
					APP_objects[i].render.sprite.texture = 'res/textures/ingranaggio' + i + '_' + (Math.random() < 0.98 ? 0 : 1) + '.png'; }

		//Riporta gli oggetti alla loro posizione iniziale
		APP_appExecutionVel = {x: 0, y: 0};   
		Matter.Body.setVelocity(APP_appSphereRosso, APP_appExecutionVel);
		Matter.Body.setPosition(APP_appSphereRosso, {x: 200, y:300});
		Matter.Body.setVelocity(APP_appSphereBlu, APP_appExecutionVel);
		Matter.Body.setPosition(APP_appSphereBlu, {x: 600, y:300});
		
		
		
		//Valida il codice
		if(window.eval(APP_getSafeCode("esprima.parseScript(editor.getValue());"))) return;
		
		//Init
		window.eval(editor.getValue());
		if(window.eval(APP_getSafeCode("init();"))) return;
		
		APP_onExecution = true;

			
	},
	
	onExecution: function(){
		//Opzioni
		var EXECUTION_MAX_TIME = 150;     //Durata della simulazione
		
		//Aggiorna il numero dei secondi passati
			APP_appCurrentTime++;
			
			//Controlla se sono già passati 100 secondi
			if( APP_appCurrentTime <= EXECUTION_MAX_TIME){
				
				//Se non ci sono problemi, esegue il loop
				if(window.eval(APP_getSafeCode("loop();"))){
					APP_onExecution = false;
					return;
				}
				
				//Applica le forze specificate dal programma
				//L'accelerazione massima applicabile deve avere modulo massimo = 1
				Matter.Body.setVelocity(APP_appSphereRosso, Matter.Vector.add(vectorMagnitude(APP_appExecutionVel) > 0.1 ? vectorScale(APP_appExecutionVel, 0.1) : APP_appExecutionVel, APP_appSphereRosso.velocity));
				

			}else{
				
				//Se sono già passati 100 secondi, avvisa che la simulazione è terminata
				app.endExecution();      //Blocca l'esecuzione del loop();
			}		
	},
	
	
	//Termina l'esecuzione
	endExecution: function(){
		APP_onExecution = false;	//Blocca l'esecuzione del loop();	
		APP_appExecutionVel = {x: 0, y: 0};   
		Matter.Body.setVelocity(APP_appSphereRosso, APP_appExecutionVel);
		Matter.Body.setVelocity(APP_appSphereBlu, APP_appExecutionVel);
		DEBUG_ADMIN('Simulazione terminata!');

	}
	
	
};



