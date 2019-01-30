<?php
namespace app\index\model;

use app\admin\model\Base;

class Version extends Base
{

//自动填充时间
    protected $autoWriteTimestamp = false;



    public function getnew($type){
        $data =[
          'type'=>$type,
          'status'=>1  
        ];
        $result=db($this->getTheTable())->where($data)->order('version_num desc')->find();
        
        if(!empty($result)){
            $res['type']=$type;
            $res['version_name']=$result['version_num'];
            $res['version_num']= str_replace('.', '', $result['version_num']);
            $res['content']=$result['content'];
            $res['href']=$result['href'];
            $res['url']= generalImg($result['url']);
            return $res;
        }else{
            return null;
        }
    }
}