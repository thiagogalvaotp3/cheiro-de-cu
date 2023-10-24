<?php

class Api {
    public $param;
    
    public function valida_parametro($param) {
        if ($param == 'buscar') {
            return true;
        }
        return false;
    }

    public function get_dados($lat, $long) {
        $token = "e19416fb4d02cb742d10908aff9fd86ec1a5255b";
        $url_api = "https://api.waqi.info/feed/";

        $url = $url_api."geo:".$lat.";".$long."/?token=".$token;

        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

        $resp = curl_exec($curl);
        curl_close($curl);
        
        echo($resp);
    }
}
