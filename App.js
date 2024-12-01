import { latLngToVector3, ThreeJSOverlayView } from "@googlemaps/three"
import { CityJSONLoader, CityJSONWorkerParser } from "cityjson-threejs-loader"
import data from './media/3dbag.json'
import data2 from './media/3dbag2.json'
import * as THREE from "three"
import proj4 from "proj4"
import { Loader } from "@googlemaps/js-api-loader"


const loader = new Loader({
  apiKey: "AIzaSyAnzlq9yYSHWTqiw3BHC_utiL60Adf5MCI",
  version: "weekly"
})

let loading = true

const displayloader = () => {
  const loadingDiv = document.getElementById('loading')
if (loading == true) {
  loadingDiv.classList.add('active')
} else {
  loadingDiv.classList.remove('active')
}
}

displayloader()

async function initMap() {
  

  

  function buildMap(selected) {
    // console.log('building')

  const bbox = {min: [93020.80535217284, 441390.3222985839], max: [94328.40995117188, 442657.3331323242]}
  const bbox2 = {min: [231950.2690419922, 580268.0473933105], max: [233249.2989682922, 581562.3079829101]}
  const center = bbox.min.map((v, i) => (v + bbox.max[i]) / 2)
  const center2 = bbox2.min.map((v, i) => (v + bbox2.max[i]) / 2)

  
  const sourceCRS = '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +units=m'
  const targetCRS = 'EPSG:4326'
  const transform = proj4(sourceCRS, targetCRS)
  const [longitude, latitude] = transform.forward(selected == 'first' ? center : center2)

  // console.log(latitude, longitude)

const mapOptions = {
    center: {
      lng: longitude,
      lat: latitude
    },
    mapId: 'dc15dc155ec03ac6',
    zoom: 15,
    heading: 45,
    tilt: 67,
  }

  //creat scene
  const scene = new THREE.Scene()

  //initialize google map
  const map = new google.maps.Map(document.getElementById('map'), mapOptions)
  console.log(map)


  //add lighting to the scene to allow the users see the meshes
  const directionalLight = new THREE.DirectionalLight(0xffffff)
      directionalLight.position.set(0, -70, 100).normalize()
      scene.add(directionalLight)

      const directionalLight2 = new THREE.DirectionalLight(0xffffff)
      directionalLight2.position.set(0, 70, 100).normalize()
      scene.add(directionalLight2)

      const parser = new CityJSONWorkerParser()
        const loader1 = new CityJSONLoader( parser )
        loader1.load(selected == 'first' ? data : data2)
        // console.log(data)

        loader1.scene.position.copy(latLngToVector3(mapOptions.center))
        loader1.scene.rotation.x = -1.6
        loader1.scene.position.x += 40
        loader1.scene.position.z -= 10
        window.loader1Scene = loader1.scene
        scene.add(loader1.scene)
        // console.log(loader1.scene)


  //initialize google map's webGlOverlayView
  const overlay = new ThreeJSOverlayView({
    scene,
    map,
    THREE
  });



  //animate 
  const animate = () => {
    requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)

  google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
    loading = false
    displayloader()
  })
}

let selected = 'first';
buildMap(selected)

  const option1 = document.getElementById('option1')
  const option2 = document.getElementById('option2')

  function changeBackgroundcolor() {
    // console.log('changing color')
    if (selected == 'first') {
      option1.style.backgroundColor = '#9cc09f50'
      option2.style.backgroundColor = 'white'
    } else if (selected == 'second') {
      option1.style.backgroundColor = 'white'
      option2.style.backgroundColor = '#9cc09f50'
    }
  }

  changeBackgroundcolor()

  option1.addEventListener('click', ()=> {
    // console.log('option1 clicked')
    loading = true
    selected = 'first'
    changeBackgroundcolor()
    buildMap(selected)
  })
  

  option2.addEventListener('click', () => {
    // console.log('option2 clicked')
    loading = true
    selected = 'second'
    changeBackgroundcolor()
    buildMap(selected)
  })
  

}




      loader.load().then(()=> {

      initMap()
    })

    