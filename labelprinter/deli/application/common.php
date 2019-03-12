<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: 流年 <liu21st@gmail.com>
// +----------------------------------------------------------------------
use think\Config;
// 应用公共文件

use think\Request;
use think\Session;

//初始化Redis
function initRedis(){
        Config::load(APP_PATH.'redis.php');
        $conf = Config::get('redis');
        import('redis.RedisClient',EXTEND_PATH);
        $redis =new \RedisClient($conf);
        return $redis;
}

//初始化微信
function initWechat(){
        Config::load(APP_PATH.'wechat.php');
        $conf = Config::get('wechat');
        import('wechat.Wechat',EXTEND_PATH);
        $wechat =new \Wechat($conf);
        return $wechat;
}

/**
 * 获取客户端IP地址
 * @param integer $type 返回类型 0 返回IP地址 1 返回IPV4地址数字
 * @return mixed
 */
function get_client_ip($type = 0) {
    $type       =  $type ? 1 : 0;
    static $ip  =   NULL;
    if ($ip !== NULL) return $ip[$type];
    if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $arr    =   explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        $pos    =   array_search('unknown',$arr);
        if(false !== $pos) unset($arr[$pos]);
        $ip     =   trim($arr[0]);
    }elseif (isset($_SERVER['HTTP_CLIENT_IP'])) {
        $ip     =   $_SERVER['HTTP_CLIENT_IP'];
    }elseif (isset($_SERVER['REMOTE_ADDR'])) {
        $ip     =   $_SERVER['REMOTE_ADDR'];
    }
    // IP地址合法验证
    $long = sprintf("%u",ip2long($ip));
    $ip   = $long ? array($ip, $long) : array('0.0.0.0', 0);
    return $ip[$type];
}

/**
 * 数据签名认证
 * @param  array  $data 被认证的数据
 * @return string       签名
 */
function data_auth_sign($data) {
    //数据类型检测
    if(!is_array($data)){
        $data = (array)$data;
    }
    ksort($data); //排序
    $code = http_build_query($data); //url编码并生成query字符串
    $sign = sha1($code); //生成签名
    return $sign;
}

/**
 * 系统加密方法
 * @param string $data 要加密的字符串
 * @param string $key  加密密钥
 * @param int $expire  过期时间 (单位:秒)
 * @return string 
 */
function think_ucenter_encrypt($data, $key, $expire = 0) {
	$key  = md5($key);
	$data = base64_encode($data);
	$x    = 0;
	$len  = strlen($data);
	$l    = strlen($key);
	$char =  '';
	for ($i = 0; $i < $len; $i++) {
		if ($x == $l) $x=0;
		$char  .= substr($key, $x, 1);
		$x++;
	}
	$str = sprintf('%010d', $expire ? $expire + time() : 0);
	for ($i = 0; $i < $len; $i++) {
		$str .= chr(ord(substr($data,$i,1)) + (ord(substr($char,$i,1)))%256);
	}
	return str_replace('=', '', base64_encode($str));
}

/**
 * 系统解密方法
 * @param string $data 要解密的字符串 （必须是think_encrypt方法加密的字符串）
 * @param string $key  加密密钥
 * @return string 
 */
function think_ucenter_decrypt($data, $key){
	$key    = md5($key);
	$x      = 0;
	$data   = base64_decode($data);
	$expire = substr($data, 0, 10);
	$data   = substr($data, 10);
	if($expire > 0 && $expire < time()) {
		return '';
	}
	$len  = strlen($data);
	$l    = strlen($key);
	$char = $str = '';
	for ($i = 0; $i < $len; $i++) {
		if ($x == $l) $x = 0;
		$char  .= substr($key, $x, 1);
		$x++;
	}
	for ($i = 0; $i < $len; $i++) {
		if (ord(substr($data, $i, 1)) < ord(substr($char, $i, 1))) {
			$str .= chr((ord(substr($data, $i, 1)) + 256) - ord(substr($char, $i, 1)));
		}else{
			$str .= chr(ord(substr($data, $i, 1)) - ord(substr($char, $i, 1)));
		}
	}
	return base64_decode($str);
}




/*
 * 
 */
function createSn($name=''){
    $day =date('Ymd',time());
    $now_day =empty(cache($name.'nowday'))?$day:cache($name.'nowday');
    $now_num =(empty(cache($name.'nowcount')) || $now_day!=$day)?1:cache($name.'nowcount');
       //     cache('nowcount');
    
    $sn =$name.$day.sprintf("%05d", $now_num);
    if($now_day!=$day){
        cache($name.'nowday',$day);
    }
    cache($name.'nowcount',$now_num+1);
    return $sn;
   // return $name.uniqid().$str[mt_rand(0,$count-1)].mt_rand(10000,99999);
}
/*大小写转换_
 * 类似AgentAudit => agent_audit
 */    
 function __classToStr($string){
        $len =strlen($string);
        $new ="";
        for($i=0;$i<$len;$i++){
            $old =ord($string[$i]);
            if($old>64 && $old<91 && $i!=0){
                 $new =$new.'_'.strtolower($string[$i]);
            }else{
                $new .= strtolower($string[$i]);
            }
        }
        return $new;
    }
/*大小写转换_
 * 类似si_merchant_product => merchant_product
 */    
 function __classToStrs($string){
        $new =  str_replace('si_','', $string);
        return $new;
    }

/*检验是否为空
 * 
 */
function checkEmpty($value) {
    if (!isset($value))
            return true;
    if ($value === null)
            return true;
    if (trim($value) === "")
            return true;

    return false;
}

/**
 * 检测用户是否登录
 * @return integer 0-未登录，大于0-当前登录用户ID
 */
function is_login(){
    $name=  getSessionName();
    $user = session($name.'_auth');
    if (empty($user)) {
        return false;
    } else {
        return session($name.'_auth_sign') == data_auth_sign($user) ?$user : false;
    }
}

/**
 * 检测用户是否是超级管理员
 * @return integer 0-未登录，大于0-当前登录用户ID
 */
function is_admin(){
    $name=  getSessionName();
    $user = session($name.'_auth');
    return $user['is_root']==1?1:0;
}


/*清除session
 * 
 */

function clearSession(){
    $name =getSessionName();
    session($name.'_auth', null);
    session($name.'_auth_sign', null);
    session($name.'_dl_auth',null); 
    return true;
}

/*设置session
 * 
 */
function settingSession($auth){
    $name =getSessionName();
    session($name.'_auth', $auth);
    session($name.'_auth_sign', data_auth_sign($auth));
    return true;
}
/*设置当前模块session名称
 * 
 */
function setSessionName($name){
    $request = Request::instance();
    $module =$request->module();
   session($module.'_login_session_name',$name); 
   return true;
}

function getSessionAuth(){
    $se_name = getSessionName();
    return session($se_name."_auth");
}

/*获取当前模块session名称
 * 
 */
function getSessionName(){
    $request = Request::instance();
    $module =$request->module();
    return session($module.'_login_session_name');
}


/*获取一个字符串里面的所有数字
 * 
 */
function getNumInString($string){
  $patterns = "/\d+/";
  preg_match_all($patterns,$string,$arr);
  return implode('',$arr[0]);
}

/*图片
 * 
 */
function generalImg($img){
    
    return empty($img)?"":"http://".$_SERVER['HTTP_HOST'].$img;
}     
function generalImgs($img){
    
    if(empty($img)){
        return ['',''];
    }else{
        
        $check =explode('.',$img);
        $ext =$check[1];
        $img_ext ='jpg,png,gif,jpeg';
        $file_ext='doc,docx,xls,xlsx,zip,rar,pdf';
        
        $img_type=(strpos($img_ext,$ext)!==false)?1:2;
        return ["http://".$_SERVER['HTTP_HOST'].$img,$img_type];
    }
    
    
    return empty($img)?"":"http://".$_SERVER['HTTP_HOST'].$img;
}     

/*修改数字
 * @param type 1: 1=>01 ,11=>11;;;;2:1=>001,11=>011,111=>111
 * 
 */

function transNum($num,$type=1){
    if($type==1){
        
        if($num<10){
            $num = "0".$num;
        };
    }else{
        if($num<10){
            $num = "00".$num;
        }else if($num <100){
            $num ="0".$num;
        };
    }
    return $num;
}




/*
 * 发送验证码
 * @param string $tel
 */

function SendCodes($tel,$type){


        Vendor("verficode.yuntongxun");
        $accountSid = '8a216da85d158d1b015d5db4b5c41d05';
        $accountToken = '0199ee9f41a04df98d697b0405164199';
        $appId = '8a216da85d158d1b015d5db4b7241d0b';
        $serverIP = 'sandboxapp.cloopen.com';
        $serverPort = '8883';
        $softVersion = '2013-12-26';
//        $minute =30;
        
//        $accountSid = 'aaf98f8952b6f5730152e3fabcdf2c43';
//        $accountToken = '67efef8f82ac45baa24c8218c088b1bf';
//        $appId = 'aaf98f8952f255490152f3a18d4d0402';
//        $serverIP = 'sandboxapp.cloopen.com';
//        $serverPort = '8883';
//        $softVersion = '2013-12-26';
        $minute =5;
        
        switch($type){
            case 1:
                $temp=193782;
                break;
            case 2:
                $temp=193782;
                break;
            case 3:
                $temp =192790;
                break;
            default:
                $back['msg']="发送类型有误";
                $back['status']=0;
                return $back;
                break;
        }
        
        import('verficode.Yunmsg',EXTEND_PATH);
        $rest = new \Yunmsg($serverIP, $serverPort, $softVersion);
        $rest->setAccount($accountSid, $accountToken);
        $rest->setAppId($appId);
        $veriry =rand(100000,999999);
        if($type==3){
             $result = $rest->sendTemplateSMS($tel,[], $temp);
        }else{
            $result = $rest->sendTemplateSMS($tel, array($veriry, $minute), $temp);
        }
        cache('the_logs',json_encode($result,true));
     //   $this->returnJson(1,json_encode($result));
      //  print_r($result);exit();
        if ($result == NULL) {
                $back['msg']="发送失败";
                $back['status']=0;
                return $back;
        }
        if ($result->statusCode != 0) {
                $back['msg']="发送失败";
                $back['status']=0;  
                return $back;
        } else {
            model('merchant/PhoneVerify')->addVerify($tel,$veriry,$type);
            $back['msg']="发送成功";
            $back['status']=1;
            return $back;
        }    
}
/*
 * 发送语音提醒
 * @param string $tel
 */

function SendCall($tel,$type=1){


        Vendor("verficode.yuntongxun");
        $accountSid = '8a216da85a3c0c39015a5a8554cf0c93';
        $accountToken = '4ebccc4ae23f418894582707a3c5a14a';
        $appId = '8aaf07085c1ab70d015c2ea249270414';
        $serverIP = 'sandboxapp.cloopen.com';
        $serverPort = '8883';
        $softVersion = '2013-12-26';
        $minute =30;
        import('verficode.Yunmsg',EXTEND_PATH);
        $rest = new \Yunmsg($serverIP, $serverPort, $softVersion);
        $rest->setAccount($accountSid, $accountToken);
        $rest->setAppId($appId);
        $veriry =rand(100000,999999);
        
      //  $result = $rest->sendTemplateSMS($tel, array($veriry, $minute), 68639);
        $result = $rest->landingCall($tel,'','这是测试','','2','http://api.centerwl.com/Crontab/test');
     //   $this->returnJson(1,json_encode($result));
        print_r($result);exit();
        if ($result == NULL) {
                $back['msg']="发送失败";
                $back['status']=0;
                return $back;
        }
        if ($result->statusCode != 0) {
                $back['msg']="发送失败";
                $back['status']=0;  
                return $back;
        } else {
            model('PhoneVerify')->addVerify($tel,$veriry,$type);
            $back['msg']="发送成功";
            $back['status']=1;
            return $back;
        }    
}
/*
 * 发送语音提醒
 * @param string $tel
 */

function queryCallResult($callsid){


        Vendor("verficode.yuntongxun");
        $accountSid = '8a216da85a3c0c39015a5a8554cf0c93';
        $accountToken = '4ebccc4ae23f418894582707a3c5a14a';
        $appId = '8aaf07085c1ab70d015c2ea249270414';
        $serverIP = 'sandboxapp.cloopen.com';
        $serverPort = '8883';
        $softVersion = '2013-12-26';
        $minute =30;
        import('verficode.Yunmsg',EXTEND_PATH);
        $rest = new \Yunmsg($serverIP, $serverPort, $softVersion);
        $rest->setAccount($accountSid, $accountToken);
        $rest->setAppId($appId);
        $veriry =rand(100000,999999);
        
      //  $result = $rest->sendTemplateSMS($tel, array($veriry, $minute), 68639);
        $result = $rest->CallResult($callsid);
     //   $this->returnJson(1,json_encode($result));
        print_r($result);exit();
        if ($result == NULL) {
                $back['msg']="发送失败";
                $back['status']=0;
                return $back;
        }
        if ($result->statusCode != 0) {
                $back['msg']="发送失败";
                $back['status']=0;  
                return $back;
        } else {
            model('PhoneVerify')->addVerify($tel,$veriry,$type);
            $back['msg']="发送成功";
            $back['status']=1;
            return $back;
        }    
}






/*数字串插入字符串
 * 
 */
function str_insert($str, $i, $substr) 
{ 
	$startstr=$laststr='';
    for($j=0; $j<$i; $j++){ 
    $startstr .= $str[$j]; 
    } 
    for ($j=$i; $j<strlen($str); $j++){ 
    $laststr .= $str[$j]; 
    } 
    $str = ($startstr . $substr . $laststr); 
    return $str; 
}
/*形成字符串
 * 
 */
function doCile($num,$string){
	$rand_num =rand(0,strlen($num));
	return str_insert((string)$num,$rand_num,$string);
	
}
/*生成二维码
 * 
 */
function getQrcode($num){
	$str ='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$length = 10-strlen($num);
	for($i=0;$i<$length;$i++){
		$rand_string =$str[rand(0,51)];
		$num= doCile($num,$rand_string);
	}
	return $num;
}

/*获取配置值
 * 
 */
function sysC($key=''){
    $result =model('admin/Config')->getAllValueToSave();
    
    if(empty($key))
        return $result;
    
    if(!empty($key) && !isset($result[$key]))
        return null;
    return $result[$key];
}


/*TCP 长连接
 * @param string $protocol 协议
 * @param string $ip  ip地址
 * @param int port 端口
 * @param array $data 传输的数据
 * @param int $type 1开通管道2关闭管道
 */
function tcpLongConnect($data,$type){
    $config =config('TCP_CONFIG');
    $connect =$config['protocol']."://".$config['ip'].":".$config['port'];
    // 建立socket连接到内部推送端口
    $client = stream_socket_client($connect, $errno, $errmsg, 5);
    if (!$client) {
        $back['msg']=$errmsg;
        $back['code']=0;
        return $back;
    }
    $data['type']=$type;
    $data['sign']=config('LONG_KEY');
    // 推送的数据，包含uid字段，表示是给这个uid推送
    fwrite($client, json_encode($data));
    // 读取推送结果
    $result= fread($client, 8192);
    $result =  json_decode($result,true);
    return $result;
    

}

/*获取天气预报
 * 
 */
    function getWeather($city){
        $ch = curl_init();
        $key_array = Config::get('WEATHER_KEY');
        $need =[
            'area'=>$city,
            'needAlarm'=>1,
            'needMoreDay'=>1,
            'needHourData'=>0,
            'showapi_appid'=>$key_array['app_id']
        ];
        ksort($need);
      //  print_r($need);
        //拼接str 
        $str="";
        foreach($need as $k=>$v){
            $str.=$k.$v;
        };
        $str.=$key_array['secret'];
        $md5_sign =md5($str);
        $need['showapi_sign']=$md5_sign;
        
        $param =http_build_query($need);
        $url ="http://route.showapi.com/9-2/?".$param;
       // echo $url;
       // $url = 'http://apis.baidu.com/showapi_open_bus/weather_showapi/address?area='.$city.'&needIndex=1&needAlarm=1';
//        $key = Config::get('WEATHER_KEY');
//        $header = array(
//            "apikey: $key",
//        );
        // 添加apikey到header
    //    curl_setopt($ch, CURLOPT_HTTPHEADER  , $header);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        // 执行HTTP请求
        curl_setopt($ch , CURLOPT_URL , $url);
        $res = curl_exec($ch);
        return $res;
    }

    
    
function check_group($str) {
    
    if($str='91350900M0000WJ09R'){
        return 1;
    }
    
    if(strlen($str)!=18){
        return 0;
    }
    $text = '0123456789ABCDEFGHJKLMNPQRTUWXY';
    
    for ($i=0; $i <=17; $i++) {
        if(strpos($text,$str[$i])===false){
            return 0;
        }
    }
    
    
    $one = '159Y';//第一位可以出现的字符
    $two = '12391';//第二位可以出现的字符
    $str = strtoupper($str);
    if(!strstr($one,$str['0']) || !strstr($two,$str['1']) || !empty($array[substr($str,2,6)])){
        return 0;
    }
    $wi = array(1,3,9,27,19,26,16,17,20,29,25,13,8,24,10,30,28);//加权因子数值
    $str_organization = substr($str,0,17);
    $num =0;
    for ($i=0; $i <17; $i++) {
        $num +=transFormation($str_organization[$i])*$wi[$i];
    }
    switch ($num%31) {
        case '0':
            $result = 0;
            break;
        default:
            $result = 31-$num%31;
            break;
    }
    if(substr($str,-1,1) == transFormation($result,true)){
        return 1;
    }else{
        return 0;
    }
}
 
function transFormation($num,$status=false){
    $list =array(0,1,2,3,4,5,6,7,8,9,'A'=>10,'B'=>11,'C'=>12,'D'=>13,'E'=>14,'F'=>15,'G'=>16,'H'=>17,'J'=>18,'K'=>19,'L'=>20,'M'=>21,'N'=>22,'P'=>23,'Q'=>24,'R'=>25,'T'=>26,'U'=>27,'W'=>28,'X'=>29,'Y'=>30);//值转换
    if($status == true){
        $list = array_flip($list);//翻转key/value
    }
    return $list[$num];
}


 function check_token ($rule='__token__', $data)
    {
        $rule = !empty($rule) ? $rule : '__token__';
        if (!isset($data[$rule]) || !Session::has($rule)) {
            // 令牌数据无效
            return false;
        }

        // 令牌验证
        if (isset($data[$rule]) && Session::get($rule) === $data[$rule]) {
            // 防止重复提交
            Session::delete($rule); // 验证完成销毁session
            return true;
        }
        // 开启TOKEN重置
        Session::delete($rule);
        return false;
    }
    
/*页面验证
 * 
 */    
function checkPageAuth($name){
        $check_token =cookie($name.'_csl');
        $token =session($name.'_page_verify');
        if($check_token!=$token || empty($check_token) || empty($token)){
            return false;
        }
          
        return true;
    }
    
/*设置页面验证
 * 
 */
function setPackAuth($name){
        $token =  Request::instance()->token($name.'_page_verify', 'md5');
        cookie($name.'_csl',$token);
    }    
    
function check_phone($num){
if(preg_match("/^1[34578]{1}\d{9}$/",$num)){  
    return true;  
}else{  
     return false;  
} 
}   

/*数组
 * 
 */
function arrayceil($data,$expect){
    if(empty($data)){
        return [];
    }
    foreach($data as $k=>$v){
        if(strpos($expect,$k)!==false){
            $data[$k]=intval($v);
        }else{
            $data[$k] = sprintf("%.1f", $v);
        }
    }
    return $data;
}

/*审核状态改变
 * 
 */
function changeEvaStatus($status){
    
}

function isDateTime($dateTime){
    $ret = strtotime($dateTime);
    return $ret !== FALSE && $ret != -1;
}

/*敏感单词检测
 * 
 */
function checkSense($word){
    
    import('word.Word',EXTEND_PATH);
    $path =dirname(__DIR__)."/sence_word.txt";
    $filter = new \SensitiveWordFilter($path);
    $result =$filter->filter($word, 1);
    return $result;
   // echo dirname(__DIR__);
    //$redis =new \SensitiveWordFilter();
    
}
/*敏感词数组检测
 * 
 */
function checkSenceArr($arr,$checkarr=[]){
    return true;
    if(empty($arr)){
        return [];
    }
    if(empty($checkarr)){
        return $arr;
    }
    foreach($checkarr as $k=>$v){
        if(isset($arr[$k])){
            $check =strtolower(checkSense($arr[$k]));
       
            if($check!=strtolower($arr[$k])){
                return $v."输入中存在敏感词:".$arr[$k]."  ".$check;
            }
        }
    }
    return true;
}

/*ocr识别
 * @param string $type 
 * idcard 身份证
 * bankcard 银行卡
 * general 通用含文字
 * basicGeneral 通用文字识别(不含文字位置信息)
 * webImage 网图OCR识别
 * enhancedGeneral  生僻字OCR识别
 * vehicleLicense 行驶证识别
 * drivingLicense 驾驶证
 */
function ocrdo($path,$type){
    
    $type_arr =['idcard','bankcard','general','basicGeneral','webImage','enhancedGeneral','vehicleLicense','drivingLicense'];
    
    if(!in_array($type,$type_arr)){
        return false;
    }
    $path=str_replace('\\', '/', UPLOAD_PATH.$path);
    if(!is_file($path)){
        return false;
    }
    
    import('ocr.Ocr',EXTEND_PATH);
    $config =config('OCR_CONFIG');
    $aipOcr = new AipOcr($config['appid'], $config['appkey'], $config['seckey']);
    if($type=='idcard'){
        $str =json_encode($aipOcr->$type(file_get_contents($path), true), JSON_PRETTY_PRINT);
    }elseif($type=='bankcard' || $type=='general'){
        $str=json_encode($aipOcr->$type(file_get_contents($path)));
    }else{
        $str=json_encode($aipOcr->$type(file_get_contents($path)), JSON_PRETTY_PRINT);
    }
    return  (json_decode($str,true));
}



function validation_filter_id_card($id_card){
    if(strlen($id_card)==18){
        return idcard_checksum18($id_card);
    }elseif((strlen($id_card)==15)){
        $id_card=idcard_15to18($id_card);
        return idcard_checksum18($id_card);
    }else{
        return false;
    }
}
// 计算身份证校验码，根据国家标准GB 11643-1999
function idcard_verify_number($idcard_base){
    if(strlen($idcard_base)!=17){
        return false;
    }
    //加权因子
    $factor=array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2);
    //校验码对应值
    $verify_number_list=array('1','0','X','9','8','7','6','5','4','3','2');
    $checksum=0;
    for($i=0;$i<strlen($idcard_base);$i++){
        $checksum += substr($idcard_base,$i,1) * $factor[$i];
    }
    $mod=$checksum % 11;
    $verify_number=$verify_number_list[$mod];
    return $verify_number;
}
// 将15位身份证升级到18位
function idcard_15to18($idcard){
    if(strlen($idcard)!=15){
        return false;
    }else{
        // 如果身份证顺序码是996 997 998 999，这些是为百岁以上老人的特殊编码
        if(array_search(substr($idcard,12,3),array('996','997','998','999')) !== false){
            $idcard=substr($idcard,0,6).'18'.substr($idcard,6,9);
        }else{
            $idcard=substr($idcard,0,6).'19'.substr($idcard,6,9);
        }
    }
    $idcard=$idcard.idcard_verify_number($idcard);
    return $idcard;
}
// 18位身份证校验码有效性检查
function idcard_checksum18($idcard){
    if(strlen($idcard)!=18){
        return false;
    }
    $idcard_base=substr($idcard,0,17);
    if(idcard_verify_number($idcard_base)!=strtoupper(substr($idcard,17,1))){
        return false;
    }else{
        return true;
    }
}

function generalPath($path){
    return ROOT_PATH."/public/".$path;
}

//检测录入时间

function doMerchantEnd($mer_id=""){
    
    if($mer_id=='158'){
        return true;
    }
    
    $now =date('Y-m-d',time());
    return false;
    $se_time =sysC('MER_SE_TIME');
    
    if(empty($se_time)){
        return false;
    };
    
    $arr = explode(',', $se_time);
    if(count($arr)!=2){
        return false;
    };
    
    $start =$arr[0];
    $end =$arr[1];
   // echo "now:".$now."   st:".$start."  end:".$end;exit;
    if($now<$start || $now>$end ){
        return false;
    }       
    return true;
}
/*企业修改截至时间
 * 
 */

function doChangeEnd(){
//   return true;
    $now =time();

    $pre_time =sysC('PRE_SE_TIME');
  //  $two_time =sysC('TWO_SE_TIME');
    
    
    
    if(empty($pre_time)){
        return false;
    };
    
    
    $arr = explode(',', $pre_time);
    if(count($arr)!=2){
        return false;
    };
    
//    $arr2 = explode(',', $two_time);
//    if(count($arr2)!=2){
//        return false;
//    };
//    
    
    
    $start =strtotime($arr[0]." 00:00:00");
    $end =strtotime($arr[1]." 23:59:59");
//
//    if($now<$start || $now>$end ){
//        return false;
//    }
   // echo $now."  ".$end."   ".$start;exit;
    if($now>$end || $now <$start){
        return false;
    }
    return true;
}


//检测录入时间

function doYYEnd(){
    $now =date('Y-m-d',time());

    $se_time =sysC('YY_SE_TIME');
    
    if(empty($se_time)){
        return false;
    };
    
    $arr = explode(',', $se_time);
    if(count($arr)!=2){
        return false;
    };
    
    $start =$arr[0];
    $end =$arr[1];

    if($now<$start || $now>$end ){
        return false;
    }       
    return true;
}
//检测录入时间

function doConEnd(){
    $now =date('Y-m-d',time());

    $se_time =sysC('CON_SE_TIME');
    
    if(empty($se_time)){
        return false;
    };
    
    $arr = explode(',', $se_time);
    if(count($arr)!=2){
        return false;
    };
    
    $start =$arr[0];
    $end =$arr[1];

    if($now<$start || $now>$end ){
        return false;
    }       
    return true;
}

//检测公示时间

function doGSEnd(){
    $now =date('Y-m-d',time());

    $se_time =sysC('GS_SE_TIME');
    
    if(empty($se_time)){
        return false;
    };
    
    $arr = explode(',', $se_time);
    if(count($arr)!=2){
        return false;
    };
    
    $start =$arr[0];
    $end =$arr[1];

    if($now<$start){
        return false;
    }       
    return true;
}

/*检验上传路径是否正确
 * 
 */
function checkUpload($file_url){
    $real_address=str_replace('\\', '/', UPLOAD_PATH.$file_url);
    if(!is_file($real_address)){
        return false;
    }
    return true;
} 

/*删除文件
 * 
 */
function delFile($file_path){
    $real_address=str_replace('\\', '/', UPLOAD_PATH.$file_path);
    if(is_file($real_address)){
         @unlink($real_address);
    }
    
}

/*设置文件删除队列
 * 
 */
function delQuee($str){
    
}


/*判断是否超过审核数
 * 
 */
function isOverCount($eva_count){
    return $eva_count>1?false:true;
}

/*双随机ip白名单
 * 
 */
function isIpWhite(){
    $ip_list =sysC('SJ_WHITE_IP');
  //  $ip_list =explode(',',$ip_list);
    
    $client_ip = get_client_ip();
    //echo $client_ip;exit;
    return strpos($ip_list,$client_ip)===false?false:true;
    
}

/*判断是否能够提交审核
 * 
 */
function isCommitPs($status){

    if($status==2 || $status==5){
        return false;
    }
    
    if(!isFive()){
        return false;
    }
    
    return true;
}



/*判断是否在5日内
 * 
 */
function isFive(){
    $data['merchant_id']=MID;
    $eva_time =db('Evaluate')->where($data)->order('create_time asc')->find();
    if(empty($eva_time)){
        return false;
    }
    $first_time =$eva_time['create_time'];
    $first_time =$first_time+86400;
    
    
    //开始天数
    $strtime =strtotime(date('Y-m-d',$first_time)." 00:00:00");
    
    
    //结束天数
    $end_time=date('Y-m-d H:i:s',$strtime+86400*7-1);
    
    $now_time =date('Y-m-d H:i:s',time());
    
    
    if($now_time>$end_time){
        return false;
    }
    return true;
}

/*获取菜单
 * 
 */
function getMenuFirstSession(){
    $pid =session('pid_'.UID);
    return empty($pid)?0:$pid;
}

function setMenuFirstSession($pid){
    session('pid_'.UID,$pid);
    return true;
}
function getMenuSecondSession(){
    $pid =session('two_pid_'.UID);
    return empty($pid)?0:$pid;
}

function setMenuSecondSession($pid){
    session('two_pid_'.UID,$pid);
    return true;
}
/*获取菜单
 * 
 */
function getTree($data, $pId,$select=[]){
    $tree = [];
    foreach($data as $k => $v)
    {
        $v['select']="";
        if(!empty($select) && in_array($v['id'], $select)){
            $v['select']="checked";
        }
       if($v['pid'] == $pId)
       {         //父亲找到儿子
        $v['childs'] = getTree($data, $v['id'],$select);
        $tree[] = $v;
        //unset($data[$k]);
       }
    }
    //print_r($tree);exit;
    return $tree;
}

/*循环找出
 * 
 */
 function getCycleResult($data,$id){
    $result=[];
    foreach($data as $k=>$v){
        if($v['id']==$id){
            $result =$v;
            break;
        }else{
            if(!empty($v['childs'])){
                $result =getCycleResult($v['childs'],$id);
                if(!empty($result)) break;
            } 
        }
    }
    return $result;
 }



/*从字符串中找出数字
 * 
 */
function findNum($str=''){
    $str=trim($str);
    if(empty($str)){return '';}
    $reg='/(\d{10}(\.\d+)?)/is';//匹配数字的正则表达式
    preg_match_all($reg,$str,$result);
    if(preg_match_all('/\d+/',$str,$arr)){
       return $arr[0];
    }
    return '';
}

/*检验必关联头部   
 * @param array $head 被检测的头部
 * @param string $str 需要检测的字段
 */
function checkNeedHead($head,$str=""){
    if(empty($str)){
        return true;
    }
    $bind_arr =model('admin/Rule')->getBindField();
    $need_arr = explode((','), $str);
    foreach($need_arr as $k=>$v){
        if(!in_array($v,$head)){
            return $bind_arr[$v]." 字段未绑定，请进行绑定";
        }
    }
    return true;
}
/*二维数组排序
 * 
 */
function multi_array_sort($multi_array,$sort_key,$sort=SORT_ASC){ 
	if(is_array($multi_array)){ 
		foreach ($multi_array as $row_array){ 
			if(is_array($row_array)){ 
			$key_array[] = $row_array[$sort_key]; 
			}else{ 
			return false; 
			} 
		} 
	}else{ 
	return false; 
	}
array_multisort($key_array,$sort,$multi_array); 
return $multi_array; 
}

/*一维数组转二维
 * 
 */
function transOnetoTwo($array){
    if(empty($array)){
        return [];
    }
    if(!isset($array[0])){
        $t[0]=$array;
         $array=$t;
    }
    return $array;
    
}

function getWorld($string){
    import('pinyin.Pinyin',EXTEND_PATH);
    $pinyin =new Pinyin();
    $pinyin::convert($string,'',$allWord,$firstWord);
   // print_r($allWord);
   // print_r($firstWord);
   // exit;
    $world =isset($firstWord[0])?strtoupper($firstWord[0]):"";
    return $world;
}

/*三级合并
 * 
 * 
 * $arr=[
	['a1','a2','a30'],
	['a1','a4','a50'],
	['a1','a2','a60'],
	['b1','b5','b60'],
	['b2','b5','b60'],
	['a1','a4','a30'],
	['b1','b5','b40'],
];
 */

function threeMerge($arr){
	
	$last=$first=$remark2=[];
	foreach($arr as $k=>$v){
            if(!isset($first[$v[0]])){
                    $first[$v[0]]=$v[0];
            }
            $str =$v[0].";".$v[1];
            $remark2[$str][]=$v[2];
	}
    //    print_r($remark2);exit;
	foreach($remark2 as $k=>$v){
            
            $v['count']=count($v);
            foreach($first as $k1=>$v1){
                if(strpos($k,$v1)!==false){
                    $temp =explode(';',$k);
                    $last[$v1][$temp[1]]=$v;
                }
            }
	}
	return $last;
	
}

/*二级合并
 * $arr=[
	['a1','a30'],
	['a2','a30'],
	['a1','a40'],
	['a4','a60'],
	['a3','a30'],
	['a2','a50'],
];
 */

function twoMerge($arr){
    $remark2=[];
    foreach($arr as $k=>$v){
            $remark2[$v[0]][]=$v[1];
    }
    //print_r($remark2);exit;=
    foreach($remark2 as $k=>$v){
            $remark2[$k]['count']=count($v);
    }
    return $remark2;
}

/*
$arr=[
    ['a1'],
    ['a2'],
    ['a3'],
    ['a2'],
    ['a2'],
];
 */
function oneMerge($arr){
    $return=[];
    foreach($arr as $k=>$v){
            $return[$v[0]]=$v[0];
    }
    return $return;
}

/*生成不同的长度
 * 
 */
function generalSize($size){
    $size=$size+1;
    switch($size){
        case $size<=15:
            return[
                0=>'style="max-width:18px;  padding:5px 0 5px 0 ; font-size:14px; font-weight:bold; border-color:black;"',
                1=>'style="max-width:28px;white-space: nowrap; padding:5px 0 5px 0; font-size:16px;  font-weight:bold;border-color:black;"',
                2=>'style="max-width:140px; padding:5px 0 5px 0 ; font-size:14px; font-weight:bold;border-color:black;"',
                3=>'style="max-width:140px;white-space: nowrap; padding:5px 0 5px 0; font-size:16px; font-weight:bold;border-color:black;"',
                4=>'style=" padding:5px 0 5px 0 ; font-size:16px; font-weight:bold;border-color:black;"',
                5=>'style=" padding:5px 0 5px 0 ;font-size:14px; font-weight:bold;border-color:black;"',
            ];
            
            
            break;
        case $size<=19 && $size>15:
            return[
                0=>'style="max-width:18px;  padding:5px 0 5px 0 ; font-size:12px; font-weight:bold;border-color:black;"',
                1=>'style="max-width:24px;white-space: nowrap; padding:5px 0 5px 0; font-size:14px;  font-weight:bold;border-color:black;"',
                2=>'style="max-width:70px; padding:5px 0 5px 0 ; font-size:12px; font-weight:bold;border-color:black;"',
                3=>'style="max-width:70px;white-space: nowrap; padding:5px 0 5px 0; font-size:14px; font-weight:bold;border-color:black;"',
                4=>'style=" padding:5px 0 5px 0 ; font-size:14px; font-weight:bold;border-color:black;"',
                5=>'style=" padding:5px 0 5px 0 ;font-size:12px; font-weight:bold;border-color:black;"',
            ];
            break;
        case  $size<=21 && $size>19:
            return[
                0=>'style="max-width:18px;  padding:5px 0 5px 0 ; font-size:10px; font-weight:bold;border-color:black;"',
                1=>'style="max-width:22px;white-space: nowrap; padding:5px 0 5px 0; font-size:12px;  font-weight:bold;border-color:black;"',
                2=>'style="max-width:70px; padding:5px 0 5px 0 ; font-size:12px; font-weight:bold;border-color:black;"',
                3=>'style="max-width:70px;white-space: nowrap; padding:5px 0 5px 0; font-size:10px; font-weight:bold;border-color:black;"',
                4=>'style=" padding:5px 0 5px 0 ; font-size:12px; font-weight:bold;border-color:black;"',
                5=>'style=" padding:5px 0 5px 0 ;font-size:10px; font-weight:bold;border-color:black;"',
            ];
        case  $size<=23 && $size>21:
            return[
                0=>'style="max-width:18px;  padding:5px 0 5px 0 ; font-size:10px; font-weight:bold;border-color:black;"',
                1=>'style="max-width:22px;white-space: nowrap; padding:5px 0 5px 0; font-size:10px;  font-weight:bold;border-color:black;"',
                2=>'style="max-width:70px; padding:5px 0 5px 0 ; font-size:10px; font-weight:bold;border-color:black;"',
                3=>'style="max-width:70px;white-space: nowrap; padding:5px 0 5px 0; font-size:10px; font-weight:bold;border-color:black;"',
                4=>'style=" padding:5px 0 5px 0 ; font-size:10px; font-weight:bold;border-color:black;"',
                5=>'style=" padding:5px 0 5px 0 ;font-size:10px; font-weight:bold;border-color:black;"',
            ];
            break;
        case $size>23:
            return[
                0=>'style="max-width:18px;  padding:5px 0 5px 0 ; font-size:10px; font-weight:bold;border-color:black;"',
                1=>'style="max-width:22px;white-space: nowrap; padding:5px 0 5px 0; font-size:10px;  font-weight:bold;border-color:black;"',
                2=>'style="max-width:70px; padding:5px 0 5px 0 ; font-size:10px; font-weight:bold;border-color:black;"',
                3=>'style="max-width:70px;white-space: nowrap; padding:5px 0 5px 0; font-size:10px; font-weight:bold;border-color:black;"',
                4=>'style=" padding:5px 0 5px 0 ; font-size:10px; font-weight:bold;border-color:black;"',
                5=>'style=" padding:5px 0 5px 0 ;font-size:10px; font-weight:bold;border-color:black;"',
            ];
            break;
        default:
            break;
        
    }
    
    
    
}

function toMergeStr($arr1,$arr2){
    $str=[];
    foreach($arr1 as $k=>$v){
        $str[]=$v."为".$arr2[$k];
    }
    return implode(',',$str);
}

	
function toMerge($arr){
	$return =[];
	foreach($arr as $k=>$v){
		
		
		$target=[];
		$item =$v;
		
		if(isset($item['child'])){
			if(isset($item['part_code']))
				unset($item['part_code']); 
			if(isset($item['asse_code']))
				unset($item['asse_code']); 
			
			$child1 =$item['child'];
			unset($item['child']);
			$target[]=$item;
			foreach($child1 as $k1=>$v1){
				$item1=$v1;
				//print_r($item1);exit;
				if(isset($item1['child'])){
					if(isset($item1['asse_code']))
						unset($item1['asse_code']); 
					if(isset($item1['spare_code']))
						unset($item1['spare_code']); 
                                        
					$child2 =$item1['child'];
					unset($item1['child']);
					$target[]=$item1;
					foreach($child2 as $k2=>$v2){
                                            $item2=$v2;
                                            if(isset($item2['child'])){
                                                    if(isset($item2['spare_code']))
                                                            unset($item2['spare_code']); 
                                                    $target[]=$item2;
                                            }else{
                                                    if(isset($item2['spare_code']))
                                                            unset($item2['spare_code']); 

                                                    if(isset($item2['count']))
                                                            unset($item2['count']); 
                                                    $target[]=$item2;
                                            }
					}
					
					
					
				}else{
					if(isset($item1['asse_code']))
						unset($item1['asse_code']); 
                                        
					if(isset($item1['spare_code']))
						unset($item1['spare_code']); 
					
					if(isset($item1['count']))
						unset($item1['count']); 
					
					if(isset($item1['asse_count']))
						unset($item1['asse_count']); 
					$target[]=$item1;
				}
				
			}
			
			 
		}else{
			if(isset($item['spare_code']))
				unset($item['spare_code']); 
			if(isset($item['part_code']))
				unset($item['part_code']); 
			if(isset($item['asse_code']))
				unset($item['asse_code']); 
			if(isset($item['count']))
				unset($item['count']); 
			if(isset($item['part_count']))
				unset($item['part_count']); 
			if(isset($item['asse_count']))
				unset($item['asse_count']); 
			$target[]=$item;
		}
		sort($target);
		$target =md5(json_encode($target));
              
		if(isset($return[$target])){
                  //      print_r(json_encode($return[$target]));exit;
			$test =$return[$target];
			$test[0]=$test;
			foreach($test as $k1=>$v1){
                            //    echo $k1;exit;
				if(isset($v1['spare_code'])){
					$test[$k1]['spare_code']=$test[$k1]['spare_code'].",".$v['spare_code'];
				}
				if(isset($v1['part_code'])){
					$test[$k1]['part_code']=$test[$k1]['part_code'].",".$v['part_code'];
				}
				if(isset($v1['asse_code'])){
					$test[$k1]['asse_code']=$test[$k1]['asse_code'].",".$v['asse_code'];
				}
                                if(isset($v1['part_count'])  && isset($v['part_count'])){
                                        $test[$k1]['part_count']=$test[$k1]['part_count']+$v['part_count'];
                                }
                                if(isset($v1['asse_count'])  && isset($v['asse_count'])){
                                        $test[$k1]['asse_count']=$test[$k1]['asse_count']+$v['asse_count'];
                                }
                                
				if(isset($v1['child'])){
                                    
					foreach($v1['child'] as $k2=>$v2){
                                            
						if(isset($v2['asse_code'])){
							$test[$k1]['child'][$k2]['asse_code']=$test[$k1]['child'][$k2]['asse_code'].",".$v['child'][$k2]['asse_code'];
						}
						if(isset($v2['spare_code'])){
							$test[$k1]['child'][$k2]['spare_code']=$test[$k1]['child'][$k2]['spare_code'].",".$v['child'][$k2]['spare_code'];
						}
                                                if(isset($v2['asse_count']) && isset($v['child'][$k2]['asse_count']) ){
                                                        $test[$k1]['child'][$k2]['asse_count']=$test[$k1]['child'][$k2]['asse_count']+$v['child'][$k2]['asse_count'];
                                                }
                                                
                                                
						if(isset($v2['child'])){
							foreach($v2['child'] as $k3=>$v3){
								
									if(isset($v3['spare_code'])){
										$test[$k1]['child'][$k2]['child'][$k3]['spare_code']=$test[$k1]['child'][$k2]['child'][$k3]['spare_code'].",".$v['child'][$k2]['child'][$k3]['spare_code'];
									}
													
									if(isset($v3['rice'])){
										$test[$k1]['child'][$k2]['child'][$k3]['rice']=$test[$k1]['child'][$k2]['child'][$k3]['rice']+$v['child'][$k2]['child'][$k3]['rice'];
									}
									if(isset($v3['square'])){
										$test[$k1]['child'][$k2]['child'][$k3]['square']=$test[$k1]['child'][$k2]['child'][$k3]['square']+$v['child'][$k2]['child'][$k3]['square'];
									}
									if(isset($v3['cube'])){
										$test[$k1]['child'][$k2]['child'][$k3]['cube']=$test[$k1]['child'][$k2]['child'][$k3]['cube']+$v['child'][$k2]['child'][$k3]['cube'];
									}
                                                                        if(isset($v3['count'])){
                                                                                $test[$k1]['child'][$k2]['child'][$k3]['count']=$test[$k1]['child'][$k2]['child'][$k3]['count']+$v['child'][$k2]['child'][$k3]['count'];
                                                                        }
							}
							
							
							
						}else{
							if(isset($v2['count']) && isset($v['child'][$k2]['count'])){
								$test[$k1]['child'][$k2]['count']=$test[$k1]['child'][$k2]['count']+$v['child'][$k2]['count'];
							}
							if(isset($v2['asse_count']) && isset($v['child'][$k2]['asse_count']) ){
								$test[$k1]['child'][$k2]['asse_count']=$test[$k1]['child'][$k2]['asse_count']+$v['child'][$k2]['asse_count'];
							}
							if(isset($v2['rice']) && isset($v['child'][$k2]['rice'])){
								$test[$k1]['child'][$k2]['rice']=$test[$k1]['child'][$k2]['rice']+$v['child'][$k2]['rice'];
							}
							if(isset($v2['square']) && isset($v['child'][$k2]['square']) ){
								$test[$k1]['child'][$k2]['square']=$test[$k1]['child'][$k2]['square']+$v['child'][$k2]['square'];
							}
							if(isset($v2['cube']) && isset($v['child'][$k2]['cube']) ){
								$test[$k1]['child'][$k2]['cube']=$test[$k1]['child'][$k2]['cube']+$v['child'][$k2]['cube'];
							}
						}
						
						
					}
				}else{
					if(isset($v1['count']) && isset($v['count'])){
						$test[$k1]['count']=$test[$k1]['count']+$v['count'];
					}
					if(isset($v1['part_count'])  && isset($v['part_count'])){
						$test[$k1]['part_count']=$test[$k1]['part_count']+$v['part_count'];
					}
					if(isset($v1['asse_count'])  && isset($v['asse_count'])){
						$test[$k1]['asse_count']=$test[$k1]['asse_count']+$v['asse_count'];
					}
					if(isset($v1['rice']) && isset($v['rice'])){
						$test[$k1]['rice']=$test[$k1]['rice']+$v['rice'];
					}
					if(isset($v1['square'])  && isset($v['square'])){
						$test[$k1]['square']=$test[$k1]['square']+$v['square'];
					}
					if(isset($v1['cube'])  && isset($v['cube'])){
						$test[$k1]['cube']=$test[$k1]['cube']+$v['cube'];
					}
                                        
                                        
				}
				
			}
			
			$return[$target]=$test[0];
			
			
		}else{
			$return[$target]=$v;
		}
	}
	return ($return);
}	
function my_error_handdle($errno,$errstr,$errfile,$errline){
	throw new Exception("$errno,$errstr",1);
}	

function num_to_rmb($num){
    $c1 = "零壹贰叁肆伍陆柒捌玖";
    $c2 = "分角元拾佰仟万拾佰仟亿";
    //精确到分后面就不要了，所以只留两个小数位
    $num = round($num, 2); 
    //将数字转化为整数
    $num = $num * 100;
    if (strlen($num) > 15) {
        return "金额太大，请检查";
    } 
    $i = 0;
    $c = "";
    while (1) {
        if ($i == 0) {
            //获取最后一位数字
            $n = substr($num, strlen($num)-1, 1);
        } else {
            $n = $num % 10;
        }
        //每次将最后一位数字转化为中文
        $p1 = substr($c1, 3 * $n, 3);
        $p2 = substr($c2, 3 * $i, 3);
        if ($n != '0' || ($n == '0' && ($p2 == '亿' || $p2 == '万' || $p2 == '元'))) {
            $c = $p1 . $p2 . $c;
        } else {
            $c = $p1 . $c;
        }
        $i = $i + 1;
        //去掉数字最后一位了
        $num = $num / 10;
        $num = (int)$num;
        //结束循环
        if ($num == 0) {
            break;
        } 
    }
    $j = 0;
    $slen = strlen($c);
    while ($j < $slen) {
        //utf8一个汉字相当3个字符
        $m = substr($c, $j, 6);
        //处理数字中很多0的情况,每次循环去掉一个汉字“零”
        if ($m == '零元' || $m == '零万' || $m == '零亿' || $m == '零零') {
            $left = substr($c, 0, $j);
            $right = substr($c, $j + 3);
            $c = $left . $right;
            $j = $j-3;
            $slen = $slen-3;
        } 
        $j = $j + 3;
    } 
    //这个是为了去掉类似23.0中最后一个“零”字
    if (substr($c, strlen($c)-3, 3) == '零') {
        $c = substr($c, 0, strlen($c)-3);
    }
    //将处理的汉字加上“整”
    if (empty($c)) {
        return "零元整";
    }else{
        return $c . "整";
    }
}


/*生成条形码
 * 
 */
function generalBarecode($string){
    include EXTEND_PATH."barcode".DS."barcode_autoload.php";
    $generator = new Barcode\BarcodeGeneratorPNG();
    $content=$generator->getBarcode($string, $generator::TYPE_CODE_128);
    if(!file_exists(UPLOAD_PATH."/uploads/barcode/")){
        mkdir(UPLOAD_PATH."/uploads/barcode/",0777,true);
    }
    
    $url ='/uploads/barcode/'.$string.".png";
    $urls=UPLOAD_PATH.$url;
    file_put_contents($urls,$content);
    return $url;
}
/*检验是否是时间格式
 * 
 */
function checkTimeFormat($str,$format="Y-m-d H:i:s"){
    $unixTime=strtotime($str);
    if($unixTime===false){
        return false;
    }
    $checkDate= date($format, $unixTime);
    if($checkDate!=$str){
        return false;
    }
    return true;
}


/*发送短信请求
 * @param int $send_type 1注册2找回
 * @param string $phone 手机号
 * @param 
 */

function dl_send_msg($phone,$send_type){
    
    $config =config('DELI_MSG_TEST');
    
    $time =time();	
    //构建post数据
    $post_data =[
            'mid'=> createSn('dl'),
            'from'=>$config['appid'],
            'to'=>'system',
            'action'=>'511',
            'time'=>$time,
            'data'=>[
                    'mode'=>$send_type,
                    'region'=>'86',
                    'mobile'=>$phone,
            ],
    ];
    
    //构建签名
    $sig =md5($post_data['action'].$post_data['from'].$post_data['to'].$config['appkey'].$time);
    $header=[
            'sig:'.$sig,
            "Content-type: application/json;charset='utf-8'",
    ];
    $result =dl_request($config['url'],json_encode($post_data),$header);
    return $result;
   
}

/*注册
 * @param string $phone 注册电话
 * @param string $password 注册密码md5
 * @param string $veri_code 验证码
 */

function dl_register($phone,$password,$veri_code){
    
    $config =config('DELI_MSG_TEST');
    
    $time =time();	
    //构建post数据
    $post_data =[
            'mid'=>createSn('dl'),
            'from'=>$config['appid'],
            'to'=>'system',
            'action'=>'512',
            'time'=>$time,
            'data'=>[
                    'region'=>'86',
                    'mobile'=>$phone,
                    'password'=>$password,
                    'veri_code'=>$veri_code,
            ],
    ];
    
    //构建签名
    $sig =md5($post_data['action'].$post_data['from'].$post_data['to'].$config['appkey'].$time);
    $header=[
            'sig:'.$sig,
            "Content-type: application/json;charset='utf-8'",
    ];
    $result =dl_request($config['url'],json_encode($post_data),$header);
    return $result;
}

/*登录
 * @param string $account 账号
 * @param string $pwd 密码
 */
function dl_login($account,$pwd){
    
    $config =config('DELI_MSG_TEST');
    
    $time =time();	
    //构建post数据
    $post_data =[
            'mid'=>createSn('dl'),
            'from'=>$config['appid'],
            'to'=>'system',
            'action'=>'515',
            'time'=>$time,
            'data'=>[
                    'region'=>'86',
                    'mobile'=>$account,
                    'password'=>$pwd,
            ],
    ];
    
    //构建签名
    $sig =md5($post_data['action'].$post_data['from'].$post_data['to'].$config['appkey'].$time);
    $header=[
            'sig:'.$sig,
            "Content-type: application/json;charset='utf-8'",
    ];
    $result =dl_request($config['url'],json_encode($post_data),$header);
    return $result;
}

/*重置密码
 * @param string $account 账号
 * @param string $pwd 密码
 */
function dl_reset_pwd($mobile,$password,$veri_code){
    
    $config =config('DELI_MSG_TEST');
    
    $time =time();	
    //构建post数据
    $post_data =[
            'mid'=>createSn('dl'),
            'from'=>$config['appid'],
            'to'=>'system',
            'action'=>'513',
            'time'=>$time,
            'data'=>[
                    'region'=>'86',
                    'mobile'=>$mobile,
                    'password'=>$password,
                    'veri_code'=>$veri_code,
            ],
    ];
    
    //构建签名
    $sig =md5($post_data['action'].$post_data['from'].$post_data['to'].$config['appkey'].$time);
    $header=[
            'sig:'.$sig,
            "Content-type: application/json;charset='utf-8'",
    ];
    $result =dl_request($config['url'],json_encode($post_data),$header);
    return $result;
}

/*POST请求
 * 
 */

function dl_request($url,$post_data,$header=false) {
    $post_data_arr =json_decode($post_data,true);
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); //TRUE 将curl_exec()获取的信息以字符串返回，而不是直接输出。
	
    curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
   // curl_setopt($ch, CURLOPT_HEADER, 1); //返回response头部信息
    //curl_setopt($ch, CURLINFO_HEADER_OUT, true); //TRUE 时追踪句柄的请求字符串，从 PHP 5.1.3 开始可用。这个很关键，就是允许你查看请求header

    curl_setopt($ch, CURLOPT_URL, $url);
    $result = curl_exec($ch);
	
   // echo curl_getinfo($ch, CURLINFO_HEADER_OUT); //官方文档描述是“发送请求的字符串”，其实就是请求的header。这个就是直接查看请求header，因为上面允许查看

    curl_close($ch);
    model('index/RequestLog')->add_log($post_data_arr['from'],$url,$post_data_arr,$header,$result,$post_data_arr['action']);
    $result =($result!==false)?json_decode($result,true):false;
    return $result;
}

/**
 * 功能：生成二维码
 * @param string $qrData 手机扫描后要跳转的网址
 * @param string $qrLevel 默认纠错比例 分为L、M、Q、H四个等级，H代表最高纠错能力
 * @param string $qrSize 二维码图大小，1－10可选，数字越大图片尺寸越大
 * @param string $savePath 图片存储路径
 * @param string $savePrefix 图片名称前缀
 */
function createQRcode($savePath, $qrData = 'PHP QR Code :)', $qrLevel = 'L', $qrSize = 4, $savePrefix = 'qrcode')
{
    vendor("phpqrcode.phpqrcode");
    $QRcode = new \QRcode();
    if (!isset($savePath)) return '';
    //设置生成png图片的路径
    $PNG_TEMP_DIR = $savePath;

    //检测并创建生成文件夹
    if (!file_exists($PNG_TEMP_DIR)) {
        mkdir($PNG_TEMP_DIR);
    }
    $filename = $PNG_TEMP_DIR . 'test.png';
    $errorCorrectionLevel = 'L';
    if (isset($qrLevel) && in_array($qrLevel, ['L', 'M', 'Q', 'H'])) {
        $errorCorrectionLevel = $qrLevel;
    }
    $matrixPointSize = 4;
    if (isset($qrSize)) {
        $matrixPointSize = min(max((int)$qrSize, 1), 10);
    }
    if (isset($qrData)) {
        if (trim($qrData) == '') {
            die('data cannot be empty!');
        }
        //生成文件名 文件路径+图片名字前缀+md5(名称)+.png
        $filename = $PNG_TEMP_DIR . $savePrefix . md5($qrData . '|' . $errorCorrectionLevel . '|' . $matrixPointSize) . '.png';
        //开始生成
        $QRcode->png($qrData, $filename, $errorCorrectionLevel, $matrixPointSize, 2);
    } else {
        //默认生成
        $QRcode->png('PHP QR Code :)', $filename, $errorCorrectionLevel, $matrixPointSize, 2);
    }
//    if (file_exists($PNG_TEMP_DIR . basename($filename)))
    return basename($filename);
//    else
//        return FALSE;
}

/*得力返回码
 * 
 */
 function to_return_code($code,$msg=""){
    switch($code){
        case 100:
            return "数据格式错误或手机号不规范";
            break;
        case 108:
            return "e+服务器处理异常";
            break;
        case 115:
            return "登录用户名或密码错误";
            break;
        case 116:
            return "注册用户名存在";
            break;
        case 117:
            return "验证手机号不存在";
            break;
        case 118:
            return "验证码错误";
            break;
        default:
            return $msg;
            break;
    }
 }