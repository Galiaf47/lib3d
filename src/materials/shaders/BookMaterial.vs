varying vec3 vViewPosition;
varying vec3 vNormal;

#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP )
	varying vec2 vUv;
	uniform vec4 offsetRepeat;
#endif

#ifndef PHONG_PER_PIXEL
	#if MAX_POINT_LIGHTS > 0
		uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];
		uniform float pointLightDistance[ MAX_POINT_LIGHTS ];
		varying vec4 vPointLight[ MAX_POINT_LIGHTS ];
	#endif

	#if MAX_SPOT_LIGHTS > 0
		uniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];
		uniform float spotLightDistance[ MAX_SPOT_LIGHTS ];
		varying vec4 vSpotLight[ MAX_SPOT_LIGHTS ];
	#endif
#endif

#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP )
	varying vec3 vWorldPosition;
#endif

#ifdef USE_COLOR
	varying vec3 vColor;
#endif

void main() {
	#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP )
		vUv = uv * offsetRepeat.zw + offsetRepeat.xy;
	#endif

	#ifdef USE_COLOR
		#ifdef GAMMA_INPUT
			vColor = color * color;
		#else
			vColor = color;
		#endif
	#endif

	vec3 objectNormal;
	#ifdef USE_SKINNING
		objectNormal = skinnedNormal.xyz;
	#endif

	#if !defined( USE_SKINNING ) && defined( USE_MORPHNORMALS )
		objectNormal = morphedNormal;
	#endif

	#if !defined( USE_SKINNING ) && ! defined( USE_MORPHNORMALS )
		objectNormal = normal;
	#endif

	#ifdef FLIP_SIDED
		objectNormal = -objectNormal;
	#endif

	vec3 transformedNormal = normalMatrix * objectNormal;
	vNormal = normalize(transformedNormal);
	vec4 mvPosition;
	#ifdef USE_SKINNING
		mvPosition = modelViewMatrix * skinned;
	#endif

	#if !defined( USE_SKINNING ) && defined( USE_MORPHTARGETS )
		mvPosition = modelViewMatrix * vec4( morphed, 1.0 );
	#endif

	#if !defined( USE_SKINNING ) && ! defined( USE_MORPHTARGETS )
		mvPosition = modelViewMatrix * vec4( position, 1.0 );
	#endif

	gl_Position = projectionMatrix * mvPosition;
	vViewPosition = -mvPosition.xyz;
	#if defined( USE_ENVMAP ) || defined( PHONG ) || defined( LAMBERT ) || defined ( USE_SHADOWMAP )
		#ifdef USE_SKINNING
			vec4 worldPosition = modelMatrix * skinned;
		#endif

		#if defined( USE_MORPHTARGETS ) && ! defined( USE_SKINNING )
			vec4 worldPosition = modelMatrix * vec4( morphed, 1.0 );
		#endif

		#if ! defined( USE_MORPHTARGETS ) && ! defined( USE_SKINNING )
			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
		#endif
	#endif

	#ifndef PHONG_PER_PIXEL
		#if MAX_POINT_LIGHTS > 0
			for( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {
				vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );
				vec3 lVector = lPosition.xyz - mvPosition.xyz;
				float lDistance = 1.0;

				if ( pointLightDistance[ i ] > 0.0 )
					lDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );
					vPointLight[ i ] = vec4( lVector, lDistance );
			}
		#endif

		#if MAX_SPOT_LIGHTS > 0
			for( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {
				vec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );
				vec3 lVector = lPosition.xyz - mvPosition.xyz;
				float lDistance = 1.0;

				if ( spotLightDistance[ i ] > 0.0 )
					lDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );
					vSpotLight[ i ] = vec4( lVector, lDistance );
			}
		#endif
	#endif

	#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP )
		vWorldPosition = worldPosition.xyz;
	#endif
}