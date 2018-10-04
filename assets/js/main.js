var titulo_des_graf="Tasa de Homicidios";
    var estados = estados_global;
    var atributos = atributos_global;
    var anioo;
  
    // docuemento general
    $(document).ready(function () 
    {
      titulo_des_graf = atributos.DescripInd_des;
      //$('#loader').delay(2000).fadeOut("slow");
    });

    function gen(props) 
    {
      var chart = c3.generate({
        bindto: '.info',
        padding: {
          top: 10,
          left: 30,
          right: 10
        },
        data: {
          x: 'Entidad',
          columns: [busqueda_anios(),props,busqueda_mexico()]
        },
        tooltip: {
          format: {
              value: function(value) {
                  return d3.format(",.2f")(value)
              }
          }
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              rotate: -90,
              format: function (x) { return x.getFullYear(); }
            },
            height: 35,
          },
          y: {
            tick: {
              format: d3.format(".0f")
            }
          }
        },
        color: {
          pattern: ['#00AEEF', 'rgba(255,0,0,0.8)']
        },
        size: {
          width: 260,
          height: 200
        },
        legend: {
          show: false
        },
        grid: {
          x: {
            show: false
          },
          y: {
            show: true
          }
        }

      });
    }

    function busqueda_estado(cadena) 
    {
      for (var i = 0; i < estados.length; i++) 
      {
        if (estados[i][0] == cadena) 
        {
          return parseFloat(estados[i][1]);
        }
      }
    }

    function busqueda_indice(cadena) {
      for (var i = 0; i < estados.length; i++) {
        if (estados[i][0] == cadena) {
          return parseFloat(i);
        }
      }
    }

    function busqueda_mexico() 
    {
      var arrray=[];
      for (var i = 0; i < estados.length; i++) 
      {
        if (estados[i][0] == "Estados Unidos Mexicanos") 
        {
          for(var j=0;j< estados[i].length;j++)
          {
            arrray.push(estados[i][j])
          }
        }
      }
      return arrray;
    }


    function busqueda_anios() 
    {
      var arrray=[];
      for (var i = 0; i < estados.length; i++) 
      {
        if (estados[i][0] == "Entidad") 
        {
          for(var j=0;j< estados[i].length;j++)
          {
            arrray.push(estados[i][j])
          }
        }
      }
      return arrray;
    }

    function busqueda_estado_posicion(cadena, posicion) 
    {
      for (var i = 0; i < estados.length; i++) 
      {
        if (estados[i][0] == cadena)
        {
          return parseFloat(estados[i][posicion]);
        }
      }
    }

    function busqueda_anio(cadena) 
    {
      for (var i = 0; i < estados[0].length; i++) 
      {
        if (estados[0][i] == cadena) 
        {
          return i;
        }
      }
    }

    //variable de mapa
    var img;
    var data_url;
    var locked = false;
    var map = L.map('map',
      {
        scrollWheelZoom: false,
        maxZoom: 14,
        minZomm: 5,
      }).setView([24.8, -100], 5);

    L.tileLayer('http://{s}.google.com/vt/?hl=es&x={x}&y={y}&z={z}&s={s}&apistyle=s.t%3A5|p.l%3A53%2Cs.t%3A1314|p.v%3Aoff%2Cp.s%3A-100%2Cs.t%3A3|p.v%3Aon%2Cs.t%3A2|p.v%3Aoff%2Cs.t%3A4|p.v%3Aoff%2Cs.t%3A3|s.e%3Ag.f|p.w%3A1|p.l%3A100%2Cs.t%3A18|p.v%3Aoff%2Cs.t%3A49|s.e%3Ag.s|p.v%3Aon|p.s%3A-19|p.l%3A24%2Cs.t%3A50|s.e%3Ag.s|p.v%3Aon|p.l%3A15&style=47,37', {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      maxZoom: 14,
      minZomm: 5,
      attribution: '&copy <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> &copy <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
      id: 'mapbox.light',
    }).addTo(map);

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
      map.dragging.disable();
    }

    // control that shows state info on hover
    var info = L.control();
    info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'infos hide');
      this.update();
      return this._div;
    };

    var res = atributos.Serie[0].CobTemporal_ser;
    anioo = res.split('-');

    info.update = function (props) 
    {      
      $('.infos').removeClass('hide');
      $('.info2').removeClass('hide');
      if (props != undefined) {
        this._div.innerHTML = '<div><h5 style="font-weight:bold">' + props.nom_ent + '</h5><br><div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b style="font-size: 20px;color: #00aeef;">' + busqueda_estado(props.nom_ent).toFixed(2)/*props.density*/ + '</b><br/><b style="padding-left:28px;color:#999999;">(' + anioo[1] + ')</b><p style="position: absolute;bottom: 71%;left: 35%;font-size: 15px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;width: 164px;">'+titulo_des_graf+'</p></div></div><div class="info"></div>';
        gen(estados[busqueda_indice(props.nom_ent)]);
      }
    };

    info.addTo(map);
    // get color depending on population density value
    // function getColor(d) {
    // 	return d > 1000 ? '#800026' :
    // 	       d > 500  ? '#BD0026' :
    // 	       d > 200  ? '#E31A1C' :
    // 	       d > 100  ? '#FC4E2A' :
    // 	       d > 50   ? '#FD8D3C' :
    // 	       d > 20   ? '#FEB24C' :
    // 	       d > 10   ? '#FED976' :
    // 	                  '#FFEDA0';
    // }

    function getColor(d) {
      return d > 100 ? '#004b67' :
        d > 50 ? '#007dab' :
          d > 20 ? '#01baff' :
            '#45ccff';
    }

    function getColoR(number) 
    {
      return brew.getColorInRange(number);
    }

    function style(feature) 
    {
      var res = String(getColoR(busqueda_estado(feature.properties.nom_ent))).split(",");
      return {
        weight: 0.5,
        opacity: 1,
        color: '#000',
        dashArray: '1',
        fillOpacity: 1,
        // fillColor: getColoR(feature.properties.density),
        fillColor: getColoR(busqueda_estado(feature.properties.nom_ent)),
        className: "c" + res[1]
      };
    }

    function highlightFeature(e) 
    {
      if (locked == false) {
        var layer = e.target;
        layer.setStyle({
          weight: 2,
          color: '#ccc',
          dashArray: '',
          fillOpacity: 1
        });
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          layer.bringToFront();
        }
        info.update(layer.feature.properties);
      }
    }

    var geojson;
    function resetHighlight(e) 
    {
      geojson.resetStyle(e.target);
      info.update(); 
    }

    function zoomToFeature(e) {
      map.fitBounds(e.target.getBounds());
    }

    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        mousedown: function (e) {
          if (locked == true) {
            locked = false;
            (function ($) {
              $(".info2").css("border", "none");
              $(".infos").css("border", "none");
            } (jQuery));
          }
          else {
            locked = true;
            (function ($) {
              //	$(".info2").css("border","5px solid #00cc99");
              $(".info2").css("border-bottom", "5px solid rgb(107, 174, 214)");
              $(".info2").css("border-left", "5px solid rgb(107, 174, 214)");
              $(".info2").css("border-right", "5px solid rgb(107, 174, 214)");
              $(".infos").css("border-top", "5px solid rgb(107, 174, 214)");
              $(".infos").css("border-left", "5px solid rgb(107, 174, 214)");
              $(".infos").css("border-right", "5px solid rgb(107, 174, 214)");
              //								$(".infos").css("border","5px solid #00cc99");
            } (jQuery));
          }
          // 			resetHighlight(e);
        },
        //          click: zoomToFeature
      });
    }

    function highlightFromLegend(e) 
    {
      (function ($) {
        $("svg path." + e).addClass("highlighted");
        var r = $("svg path." + e);
        for (var i = 0; i < r.length; i++) {
          r[i].classList.add("highlighted");
        }
      } (jQuery));
    }

    function clearHighlight() {
      (function ($) {

        $("path").removeClass("highlighted");
        var r = $("path");
        for (var i = 0; i < r.length; i++) {
          r[i].classList.remove("highlighted");
        }
      } (jQuery));
    }

    var brew = new classyBrew();
    var values = [];
    var values2 = [];
    for (var i = 0; i < statesData.features.length; i++) {
      if (statesData.features[i].properties.nom_ent == null) continue;
      values.push(busqueda_estado(statesData.features[i].properties.nom_ent));
    }

    brew.setSeries(values);
    brew.setNumClasses(4);
    brew.setColorCode("Reds");
    brew.classify('jenks');

    

    geojson = L.geoJson(statesData, {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(map);



    map.attributionControl.addAttribution('');
    var legend = L.control();
    legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info2 legend hide'),
        grades = brew.getBreaks(),//[0, 20, 50, 100],
        labels = [],
        from, to;
      for (var i = 0; i < grades.length - 1; i++) {
        from = grades[i];
        to = grades[i + 1];
        var res = String(getColoR(from)).split(",");
        labels.push(
          '<div style="float:left; text-align: center;"><i class="leyenda" onmouseover="highlightFromLegend(\'c' + res[1] + '\')" onmouseout="clearHighlight();" style="width:100%; background:' + getColoR(from) + '"></i><br>' +
          from.toFixed(2) + (to.toFixed(2) ? '&ndash;' + to.toFixed(2) : '+') + '</div>');
      }
      div.innerHTML = labels.join('');
      return div;
    };
    legend.addTo(map);

