<?php
namespace app\admin\model;

use app\admin\model\Base;

class LableType extends Base{
    
//自动填充时间    
protected $autoWriteTimestamp = false;



    
    public function getListData($param=null,$order=''){
        $map =[];
        $page =(isset($param['page']) && intval($param['page'])>0)?intval($param['page']):1;
        $page_size=(isset($param['limit']) && intval($param['limit'])>0)?intval($param['limit']):10;

        $prex =config('database.prefix');

        if(isset($param['username']) && !empty($param['username'])){
            $data['username']=['like',"%".$param['username']."%"];
            $result =db('Admin')->where($data)->select();

            $ids =[];
            if(!empty($result)){
                foreach($result as $k=>$v){
                    $ids[]=$v['id'];
                }
            }
            $ids =empty($ids)?"":$ids;
            $map['a.create_id']=['in',$ids];
        }

        if(isset($param['name'])){
            $map['name']=$param['name'];
        }

        $count =db($this->getTheTable())->alias('a')->where($map)->count();
        $sql =$this->where($map)->alias('a')
            ->join($prex.'admin b','a.create_id=b.id','LEFT')
            ->field('a.id,a.name,a.status,b.username as create_user,a.create_time')
            ->limit(($page-1)*$page_size.','.$page_size)->buildSql();
        $result =$this->query($sql);
        return $this->generalResult($result,$count);
    }

    public function __formatEdit($data = null) {
        return $data;
    }
    

    public function __formatList($list = null) {
        if(!empty($list)){
            foreach($list as $k=>$v){
                $list[$k]['status']=$v['status']==1?"正常":"不正常";
                if(!empty($list[$k]['create_time'])){
                    $list[$k]['create_time']=date('Y-m-d H:m:s',$list[$k]['create_time']);
                }
            }
            return $list;
        }
        return $list;
    }
    
/*插入之前
 * 
 */
    
    public function __my_before_insert(&$data){
        if(empty($data['name'])){
            $this->setError('请输入模板类型名称');
            return false;
        }
        $data['status']=1;
        $data['create_id']=UID;
        $data['create_time']=time();
        return true;
    }
        
    
    public function __my_before_update(&$data){
        return true;
    }
        
/*获取全部标签类型
 * 
 */ 
    public function get_all_type_list(){
        $map['status']=1;
        $result =db($this->getTheTable())->where($map)->select();
        return $result;
    }
            

}