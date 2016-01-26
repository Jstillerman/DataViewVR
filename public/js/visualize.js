var container;
var camera, scene, raycaster, renderer;

var mouse = new THREE.Vector2(), INTERSECTED;
var radius = 100, theta = 0;


$.getJSON(window.location.href + "/json", function( data ) {
	init(data);
	animate();
});


function init(data) {

	//$("body").css("padding", "0px").css("margin", "0px");

	container = document.createElement( 'div' );
	container.style.position="absolute";
	container.style["z-index"]="-1";
	container.style.top ="0";
	container.style.left="0";
	//document.getElementsByClassName("right")[0].appendChild( container );
	document.body.appendChild( container );
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );

	scene = new THREE.Scene();

	var light = new THREE.DirectionalLight( 0xffffff, 1 );
	light.position.set( 1, 1, 1 ).normalize();
	scene.add( light );

	var geometry = new THREE.BoxGeometry( 1, 1, 1 );

	console.log(data);

	for (var ray = 0; ray< data.nray; ray++){
		for (var timestep = 0; timestep < data.values.wx[0].length; timestep++){
			var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: ray/4 * 0xff0000 } ) );
			
			object.position.x = data["values"]["wx"][ray][timestep];
			object.position.y = data["values"]["wz"][ray][timestep];
			object.position.z = data["values"]["wy"][ray][timestep];

			scene.add( object );

		}
		
	}

	

	raycaster = new THREE.Raycaster();

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0xf0f0f0 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.sortObjects = false;
	renderer.domElement.style.position="absolute"
	container.appendChild(renderer.domElement);

	

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

				render();
		

			}

			function render() {

				theta += 0.1;

				camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
				camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
				camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
				camera.lookAt( scene.position );

				camera.updateMatrixWorld();

				// find intersections

				raycaster.setFromCamera( mouse, camera );

				var intersects = raycaster.intersectObjects( scene.children );

				if ( intersects.length > 0 ) {

					if ( INTERSECTED != intersects[ 0 ].object ) {

						if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

						INTERSECTED = intersects[ 0 ].object;
						INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
						INTERSECTED.material.emissive.setHex( 0xff0000 );

					}

				} else {

					if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

					INTERSECTED = null;

				}

				renderer.render( scene, camera );

			}
