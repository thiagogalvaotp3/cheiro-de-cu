<?php
include('./api.php');

$api = new Api();

if ($api->valida_parametro($_GET['param'])) {
    $lat = $_POST['lat'];
    $long = $_POST['long'];

    //echo json_encode($_POST);
    //echo "teste lat:". $lat ." long:". $long;
    $dados = $api->get_dados($lat, $long);

    echo $dados;
} else {
    echo json_encode('{status: 400, mensagem: "Parametro Invalido"}');
}
