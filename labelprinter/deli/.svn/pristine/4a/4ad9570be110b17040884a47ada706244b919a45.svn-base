<?php
namespace app\admin\model;

use app\admin\model\Base;

class Device extends Base{
    
//自动填充时间    
protected $autoWriteTimestamp = false;



    
    public function getListData($param=null,$order=''){
        $map =[];
        $page =(isset($param['page']) && intval($param['page'])>0)?intval($param['page']):1;
        $page_size=(isset($param['limit']) && intval($param['limit'])>0)?intval($param['limit']):10;
        $map['pid']=0;
        if(isset($param['pid']) && $param['pid']>0){
            $map['pid']=$param['pid'];
        }
        $count =$this->where($map)->count();
        $sql =$this->where($map)->limit(($page-1)*$page_size.','.$page_size)->buildSql();
        $result =$this->query($sql);
        return $this->generalResult($result,$count);
    }

    public function __formatEdit($data = null) {
        return $data;
    }
    

    public function __formatList($list = null) {
        return $list;
    }
    
    
    public function add_device($member_id,$device_code){
        
        //先判断是否存在设备
        $data['device_code']=$device_code;
        $result =db($this->getTheTable())->where($data)->find();
        if(!empty($result)){
            return false;
        }
        $time =time();
        $data['the_day']=date('Y-m-d',$time);
        $data['member_id']=$member_id;
        $data['create_time']=time();
        $this->insert($data);
        return true;
    }
    
/*插入之前
 * 
 */
    
    public function __my_before_insert(&$data){
        return true;
    }
        
    
    public function __my_before_update(&$data){
        return true;
    }
        
    

}