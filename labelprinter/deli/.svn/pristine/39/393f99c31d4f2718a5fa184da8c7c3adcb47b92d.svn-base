<?php
namespace app\index\controller;
use think\Db;
use think\Config;
use think\Request;
header('content-type:text/html;charset=utf-8' );

class Version extends ApiBase
{
    public function getnewversion(){
        $result1=model('Version')->getnew(1);
        $result2=model('Version')->getnew(2);
        $result=array('android'=>$result1,'iOS'=>$result2);
        $this->returnJsonData(1,'获取成功',$result);

    }
    
    
 /*
  * 
  */ 
    
    public function get_icon_list(){
        $this->__checkParam('page',$this->input);
        extract($this->input);
        
        $page =intval($page)<=0?1:intval($page);
        $page_size=10;
        $data['status']=1;
        $result =db('Icons')->where($data)->limit(($page-1)*$page_size.",".$page_size)->select();
        if(empty($result)){
            $this->returnJson(0, '暂无更多数据');
        }
        
        foreach($result as $k=>$v){
            $result[$k]['picture']= generalImg($v['picture']);
        }
        
        $this->returnJsonData(1, '获取成功', $result);
    }
    /*
 *
 */

    public function get_font_list(){
        $this->__checkParam('page',$this->input);
        extract($this->input);

        $page =intval($page)<=0?1:intval($page);
        $page_size=10;
        $data['status']=1;
        $result =db('Font')->where($data)->limit(($page-1)*$page_size.",".$page_size)->select();
        if(empty($result)){
            $this->returnJson(0, '暂无更多数据');
        }

        foreach($result as $k=>$v){
            $result[$k]['font_url']= generalImg($v['font_url']);
        }

        $this->returnJsonData(1, '获取成功', $result);
    }
    
}
