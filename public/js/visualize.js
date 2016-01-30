Array.prototype.contains = function(n){return this.indexOf(n) > -1};

var container;
var camera, scene, raycaster, renderer, controls;

var mouse = new THREE.Vector2(), INTERSECTED;
var radius = 100, theta = 0;


var blocks = {};

var settings = {
	autoDisplay: {
		enabled: false,
		speed: 1
	},
	variables: {

	},
	firstRay: 0,
	lastRay: 4
};

var gui = new dat.GUI();

function startVis(url){

	$.getJSON(url, function( data ) {
		console.log("JSON Recieved!");
		init(data);
		animate();


	}).fail( function(d, textStatus, error) {
		console.error("getJSON failed, status: " + textStatus + ", error: "+error);
	});

}



function setRayVisibility(ray, visible){
	var iter = []
	if (ray instanceof Array){iter = ray;}
	else {iter = [ray];}

	iter.forEach(function(rayNum){

		blocks[rayNum].forEach(function(block){
			block.visible=visible;
		});

	});
	
}

function rng(x, y){
	var temp = [];
	for(var i=x; i<y; i++){
		temp.push(i);
	};
	return temp;
}


function init(data) {

	settings.nray = data.nray;

	

	//$("body").css("padding", "0px").css("margin", "0px");

	container = document.createElement( 'div' );
	container.style.position="absolute";
	container.style["z-index"]="-1";
	container.style.top ="0";
	container.style.left="0";
	//document.getElementsByClassName("right")[0].appendChild( container );
	document.body.appendChild( container );
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 100;
	scene = new THREE.Scene();

	var light = new THREE.DirectionalLight( 0xffffff, 1 );
	light.position.set( 1, 1, 1 ).normalize();
	scene.add( light );


	
	gui.remember(settings);
	gui.remember(settings.variables);
	gui.remember(camera.position);
	gui.remember(camera.rotation);



	var cameraFolder = gui.addFolder("Camera");
	var pos = cameraFolder.addFolder("Position");
	pos.add(camera.position, "x").listen();
	pos.add(camera.position, "y").listen();
	pos.add(camera.position, "z").listen();

	var rot = cameraFolder.addFolder("Rotation");
	rot.add(camera.rotation, "x").listen().step(0.1);
	rot.add(camera.rotation, "y").listen().step(0.1);
	rot.add(camera.rotation, "z").listen().step(0.1);

	var autoDisplayFolder = cameraFolder.addFolder("AutoDisplay");
	autoDisplayFolder.add(settings.autoDisplay, 'enabled');
	autoDisplayFolder.add(settings.autoDisplay, 'speed', -10, 10);

	var f1 = gui.addFolder("Rays");
	f1.add(settings, 'firstRay', 0, settings.nray).step(1).listen();
	f1.add(settings, 'lastRay', 0, settings.nray).step(1).listen();

	var f2 = gui.addFolder("Variables");

	for(var name in data.varnames){
		settings.variables[name] = false;
		f2.add(settings.variables, name).listen();
	}


	


	var geometry = new THREE.BoxGeometry( 1, 1, 1 );

	console.log(data);

	for (var ray = 0; ray < data.nray; ray++){
		blocks[ray] = [];
		for (var timestep = 0; timestep < data.values.wx[0].length; timestep++){

			var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: ray/2 * (0xff0000) } ) );



			object.position.x = data["values"]["wx"][ray][timestep];
			object.position.y = data["values"]["wz"][ray][timestep];
			object.position.z = data["values"]["wy"][ray][timestep];

			object.properties = {};

			for(var key in data.varnames){
				object.properties[key] = data["values"][key][ray][timestep];
			}


			object.visible = (ray <= 3);

			scene.add( object );
			blocks[ray].push( object );
		}

		
	}

	console.log(blocks);

	

	raycaster = new THREE.Raycaster();

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0xf0f0f0 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.sortObjects = false;
	renderer.domElement.style.position="absolute"
	container.appendChild(renderer.domElement);



	controls = new THREE.OrbitControls( camera, renderer.domElement );
				//controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
				controls.enableDamping = true;
				controls.dampingFactor = 0.25;
				controls.enableZoom = true;





				document.addEventListener( 'mousemove', onDocumentMouseMove, false );

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function onDocumentMouseMove( event ) {

				event.preventDefault();

				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				controls.update();

				render();


			}

			function render() {

				if(settings.autoDisplay.enabled){
					theta += 0.1*settings.autoDisplay.speed;

					camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
					camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
					camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
					camera.lookAt( scene.position );

					camera.updateMatrixWorld();
				}

				setRayVisibility(rng(0, settings.nray-1), false);
				setRayVisibility(rng(settings.firstRay, settings.lastRay), true);


				// find intersections

				raycaster.setFromCamera( mouse, camera );

				var intersects = raycaster.intersectObjects( scene.children );

				if ( intersects.length > 0 ) {

					if ( INTERSECTED != intersects[ 0 ].object ) {

						if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

						INTERSECTED = intersects[ 0 ].object;
						INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
						INTERSECTED.material.emissive.setHex( 0xff0000 );

						list = document.createElement("ul");

						for(var key in INTERSECTED.properties){

							if(settings.variables[key]){
							var item = document.createElement('li');


							item.appendChild(document.createTextNode(key + ": " + INTERSECTED.properties[key]));
							item.setAttribute("title", [key]);
							item.setAttribute("class", "tipsythingy");
							list.appendChild(item);
						}
						}

						var left = document.getElementsByClassName("left")[0]
						left.innerHTML = "";
						left.appendChild(list);

					}

				} else {

					if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

					INTERSECTED = null;

				}
				

				renderer.render( scene, camera );

			}
