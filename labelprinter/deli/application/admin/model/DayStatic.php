<?php
namespace app\admin\model;

use app\admin\model\Base;

class DayStatic extends Base{
    
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
    
/*新增统计, 这里每天的统计直接进入redis，然后在每日定时更新
 * 
 */
    public function add_static($member_count=0,$lable_count=0,$device_count=0){

        $time =time();
        $the_day =date('Y-m-d',$time);
        $data['the_day']=$the_day;
        $result =db($this->getTheTable())->where($data)->find();
        if(empty($result)){
            $data['member_count']=$member_count;
            $data['lable_count']=$lable_count;
            $data['device_count']=$device_count;
            $data['create_time']=$time;
            $this->insert($data);
        }else{
            
            $data1['id']=$result['id'];
            $data1['member_count']=$result['member_count']+$member_count;
            $data1['lable_count']=$result['lable_count']+$lable_count;
            $data1['device_count']=$result['device_count']+$device_count;
            $this->update($data1);
        }
        return true;
    }
    
/*获取总的
 * 
 */    
    public function get_total_count(){
        $map=[];
        $result =db($this->getTheTable())->where($map)->select();
        $return['member_count']=0;
        $return['lable_count']=0;
        $return['device_count']=0;
        
        if(!empty($result)){
            foreach($result as $k=>$v){
                $return['member_count']+=$v['member_count'];
                $return['lable_count']+=$v['lable_count'];
                $return['device_count']+=$v['device_count'];
            }
        }
        return $return;
    }
    
/*
 * 
 */
    public function delelable(){
        $result=db('DayStatic')->select();
        for($i=0;$i<=count($result)-1;$i++){
            if($result[$i]['lable_count']>0){
                $result[$i]['lable_count']=$result[$i]['lable_count']-1;
                $data[$i]['lable_count']=$result[$i]['lable_count'];
                db('DayStatic')->where('id',$result[$i]['id'])->update($data[$i]);
                break;
            }
        }

    }
    

}