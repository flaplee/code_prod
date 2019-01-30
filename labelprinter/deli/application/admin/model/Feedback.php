<?php
namespace app\admin\model;

use app\admin\model\Base;

class Feedback extends Base
{

//自动填充时间
    protected $autoWriteTimestamp = false;



    public function getListData($param=null){
        $map =[];
        $page =(isset($param['page']) && intval($param['page'])>0)?intval($param['page']):1;
        $page_size=(isset($param['limit']) && intval($param['limit'])>0)?intval($param['limit']):10;
        
        $prex =config('database.prefix');

        if(isset($param['name']) && !empty($param['name'])){
            $data['name']=['like',"%".$param['name']."%"];
            $result =db('Member')->where($data)->select();

            $ids =[];
            if(!empty($result)){
                foreach($result as $k=>$v){
                    $ids[]=$v['id'];
                }
            }
            $ids =empty($ids)?"":$ids;
            $map['a.create_id']=['in',$ids];
        }

//        if(isset($param['name'])){
//            $map['name']=$param['name'];
//        }
        //   print_r($param);exit;
        $count =db($this->getTheTable())->alias('a')->where($map)->count();
        $sql =$this->where($map)->alias('a')
                ->join($prex.'member b','a.create_id=b.id','LEFT')
                ->field('a.id,a.create_id,a.content,a.status,a.create_time,b.name as create_name,b.reg_platform as type')
                ->order('status asc,id desc')->limit(($page-1)*$page_size.','.$page_size)->buildSql();
        
        $result =$this->query($sql);
        return $this->generalResult($result,$count);
    }
    
    
    
    public function __formatList($list = null) {
        if(!empty($list)){
            foreach($list as $k=>$v){
                $list[$k]['status']=$v['status']==1?"已处理":"未处理";
                if(!empty($list[$k]['create_time'])){
                    $list[$k]['create_time']=date('Y-m-d H:m:s',$list[$k]['create_time']);
                }
                if($list[$k]['type']==1){
                    $list[$k]['type']='android';
                }
                if($list[$k]['type']==2){
                    $list[$k]['type']='ios';
                }
                if($list[$k]['type']==1){
                    $list[$k]['type']='其他';
                }
            }
            return $list;
        }
    }

    /*更新之前
     *
     */
    public function __my_before_update(&$data){
//        dump($data);exit();
        $font=db('Font')->where('id',$data['id'])->find();
        if(empty($data['font_url'])){
            $data['font_url']=$data['down_url'];
        }
        unset($data['down_url']);
        $data['create_id']=$font['create_id'];
        return true;
    }

    /*插入之前
     *
     */

    public function __my_before_insert(&$data){
        unset($data['down_url']);
        $data['status']=1;
        $data['create_id']=UID;
        $data['create_time']=time();
        return TRUE;
    }
}