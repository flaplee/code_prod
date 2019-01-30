<?php
namespace app\admin\model;

use app\admin\model\Base;

class Lable extends Base
{

//自动填充时间
    protected $autoWriteTimestamp = false;



    public function getListData($param=null){
        $map =[];
        $page =(isset($param['page']) && intval($param['page'])>0)?intval($param['page']):1;
        $page_size=(isset($param['limit']) && intval($param['limit'])>0)?intval($param['limit']):10;
        
        $prex =config('database.prefix');

        if(isset($param['type'])  &&  !empty($param['type'])){
            $map['a.type']=$param['type'];
        }
        if(isset($param['status'])  &&  !empty($param['status'])){
            $map['a.status']=$param['status'];
        }
        
        if(isset($param['create_user']) && !empty($param['create_user'])){
            $data['name']=['like',"%".$param['create_user']."%"];
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

        if(isset($param['name']) && !empty($param['name'])){
            $data['name']=$param['name'];
            $result =db('LableType')->where($data)->select();

            $ids =[];
            if(!empty($result)){
                foreach($result as $k=>$v){
                    $ids[]=$v['id'];
                }
            }
            $ids =empty($ids)?"":$ids;
            $map['a.type_id']=['in',$ids];
        }



        $count =db($this->getTheTable())->alias('a')->where($map)->count();
        $sql =$this->where($map)->alias('a')
                ->join($prex.'lable_type b','a.type_id=b.id','LEFT')
                ->join($prex.'member c','a.create_id=c.id','LEFT')
                ->field('a.id,a.lable_cover,a.lable_name,a.lable_height,a.lable_width,b.name as type_name
                        ,a.type,a.data,a.status,c.name as create_user,a.create_time')
                ->order('id desc')->limit(($page-1)*$page_size.','.$page_size)->buildSql();
        
        $result =$this->query($sql);
        return $this->generalResult($result,$count);
    }
    
    
    
    public function __formatList($list = null) {
        if(!empty($list)){
            $name_arr =$this->get_status_name();
            $color_arr =$this->get_status_color();
            
            foreach($list as $k=>$v){
                $list[$k]['status_name']=$name_arr[$v['status']];
                $list[$k]['status_color']=$color_arr[$v['status']];
                if(!empty($list[$k]['create_time'])){
                    $list[$k]['create_time']=date('Y-m-d H:m:s',$list[$k]['create_time']);
                }
                $list[$k]['type']=$v['type']==1?"android":"ios";
                $list[$k]['lable_cover']= generalImg($v['lable_cover']);
            }
//            dump($list);exit();
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
        return true;
    }
    
    public function get_status_name(){
        return [
            1=>'正常',
            0=>'失效',
        ];
    }
    public function get_status_color(){
        return [
            1=>'#1E9FFF;',
            0=>'#ff0e07;',
        ];
    }
    
}