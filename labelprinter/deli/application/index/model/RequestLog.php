<?php
namespace app\index\model;

use app\admin\model\Base;

class RequestLog extends Base{
    
//自动填充时间    
protected $autoWriteTimestamp = false;


/*验证码验证
 * 
 */
    public function add_log($app_id,$url,$post_data,$header,$result,$request_type){
        $data['request_url']=$url;
        $data['request_type']=$request_type;
        $data['request_data']=json_encode($post_data);
        $data['request_header']=json_encode($header);
        $data['appid']=$app_id;
        $data['request_date']=date('Y-m-d',time());
        $data['request_respone']=$result;
        $data['request_url']=$url;
        $data['create_time']=time();
        db($this->getTheTable())->insert($data);
        return true;
    }
}