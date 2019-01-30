<?php
namespace app\admin\model;

use app\admin\model\Base;

class Dau extends Base{
    
//自动填充时间    
protected $autoWriteTimestamp = false;



    
    public function getListData($param=null,$order=''){
        $map =[];
        $page =(isset($param['page']) && intval($param['page'])>0)?intval($param['page']):1;
        $page_size=(isset($param['limit']) && intval($param['limit'])>0)?intval($param['limit']):10;
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
    
/*新增dau
 * 
 */
    public function add_dau($member_id,$type){
        $time =time();
        $the_day =date('Y-m-d',$time);
        $data['the_day']=$the_day;
        $data['member_id']=$member_id;
        $result =db($this->getTheTable())->where($data)->find();
        
        if(empty($result)){
            $data['count']=1;
            $data['create_time']=$time;
            $data['type']=$type;
            $this->insert($data);
        }else{
            $data1['id']=$result['id'];
            $data1['count']=$result['count']+1;
            $this->update($data1);
        }
        return true;
    }
        
    
/*获取当日dau
 * 
 */    
    public function get_the_day_dau($the_day=""){
        $time =time();
        $the_day =empty($the_day)?date('Y-m-d'):$the_day;
        $data['the_day']=$the_day;
        $hour_list =$this->get_hour();
        $result =db($this->getTheTable())->where($data)->select();
        $return1=$return2=[];
        if(!empty($result)){
            foreach($result as $k=>$v){
                $create_time =$v['create_time'];
                $h =date('H',$create_time);
                $str_name ="return".$v['type'];
                if(isset($$str_name[$h])){
                    $$str_name[$h]+=1;
                }else{
                    $$str_name[$h]=1;
                }
            }
        }
        $back['1']=$this->do_data($hour_list,$return1);
        $back['2']=$this->do_data($hour_list,$return2);
       //  print_r($back);print_r($return2);exit;
        $back['3']=count($result);
        return $back;
    }
    
/*获取统计图需要的x轴
 * 
 */
    public function get_hour(){
        $return =[];
        for($i=0;$i<24;$i++){
            $return[]=transNum($i,1);
        }
        return $return;
    }
    
/*拼接数据
 * 
 */
    public function do_data($hour_list,$target){
        $return=[];
        foreach($hour_list as $k=>$v){
            if(isset($target[$v])){
                $return[]=$target[$v];
            }else{
                $return[]=0;
            }
        }
        return $return;
    }
}