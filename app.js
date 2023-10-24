var localizacaoAtual = { lat: -23.94, lng: -46.33 };

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setPosition)
  } else{
    alert("Seu navegador não possui suporte a geolocalização.");
  }
}

async function setPosition(position) {
  localizacaoAtual = {
    "lat" : position.coords.latitude,
    "lng": position.coords.longitude
  };

  var dadosAtuais = [];
  
  $.ajax({
    url: 'api/index.php?param=buscar',
    crossDomain: true,
    method: "POST",
    data: {
      lat: localizacaoAtual.lat,
      long: localizacaoAtual.lng
    },
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", "Bearer 6QXNMEMFHNY4FJ5ELNFMP5KRW52WFXN5")
    },
    success: function(data){
      var dadosAtuais = JSON.parse(data); 
      const dadosCidade = dadosAtuais.data.city.name.split(',');
      let extensoQualidade = "";

      if (dadosAtuais.data.aqi <= 50) {
        extensoQualidade = "Bom";
      } else if (dadosAtuais.data.aqi <= 100) {
        extensoQualidade = "Moderado";
      } else if (dadosAtuais.data.aqi <= 150) {
        extensoQualidade = "Insalubre para grupos sensíveis"
      } else if (dadosAtuais.data.aqi <= 200) {
        extensoQualidade = "Pouco saudável";
      } else {
        extensoQualidade = "Perigoso";
      }

      $('#NomeCidade')[0].textContent = dadosCidade[0];
      $('#NomeEstado')[0].textContent = dadosCidade[1];
      $('#NomePais')[0].textContent = dadosCidade[2];

      $('#QualidadeAr')[0].textContent = dadosAtuais.data.aqi + " - " + extensoQualidade;
      $('#Temperatura')[0].textContent = dadosAtuais.data.iaqi.t.v + ' ºC';
      $('#Umidade')[0].textContent = dadosAtuais.data.iaqi.h.v;
    }
  });
}
