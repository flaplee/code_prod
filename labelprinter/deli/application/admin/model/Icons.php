<?php
namespace app\admin\model;

use app\admin\model\Base;

class Icons extends Base
{

//自动填充时间
    protected $autoWriteTimestamp = false;



    public function getListData($param=null){
        $map =[];
        $page =(isset($param['page']) && intval($param['page'])>0)?intval($param['page']):1;
        $page_size=(isset($param['limit']) && intval($param['limit'])>0)?intval($param['limit']):10;

        if(isset($param['name'])){
            $map['name']=$param['name'];
        }
        if(isset($param['type_name'])){
            $map['type_name']=$param['type_name'];
        }
        $prex =config('database.prefix');
        $count =db($this->getTheTable())->alias('a')->where($map)->count();
        $sql =$this->where($map)->alias('a')
                ->join($prex.'admin b','a.create_id=b.id','LEFT')
                ->field('a.id,a.name,a.create_id,a.picture,a.type_name,a.status,a.create_time,b.username as create_name')
                ->order('id desc')->limit(($page-1)*$page_size.','.$page_size)->buildSql();
        $result =$this->query($sql);
        return $this->generalResult($result,$count);
    }
    public function __formatList($list = null) {
        if(!empty($list)){
            foreach($list as $k=>$v){
                $list[$k]['status']=$v['status']==1?"正常":"失效";
                if(!empty($list[$k]['create_time'])){
                    $list[$k]['create_time']=date('Y-m-d H:m:s',$list[$k]['create_time']);
                }
            }
            return $list;
        }
    }

    /*更新之前
     *
     */
    public function __my_before_update(&$data){
        $icons=db('Icons')->where('id',$data['id'])->find();
        if(empty($data['picture'])){
            $data['picture']=$icons['picture'];
        }
        return true;
    }

    /*插入之前
     *
     */

    public function __my_before_insert(&$data){
        $data['status']=1;
        $data['create_time']=time();
        $data['create_id']=UID;
        return TRUE;
    }
    

    public function getTypeNameList()
    {
        $map=[];
        $result = db($this->getTheTable())->where($map)->field('type_name')->group('type_name')->select();
        return $result;
    }
    
}