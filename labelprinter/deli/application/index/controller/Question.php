<?php
namespace app\index\controller;
use think\Db;
use think\Config;
use think\Request;
header('content-type:text/html;charset=utf-8' );

    class Question extends ApiBase
{
    public function get_ques_list(){
//          $this->__checkParam('page',$this->input);
        extract($this->input);

        $page =1;
        $page_size=10000;
        $data['status']=1;
        $result =db('Question')->where($data)->order('update_time desc')->limit(($page-1)*$page_size.",".$page_size)->select();
        if(empty($result)){
            $this->returnJson(0, '暂无更多数据');
        }else{
            for($i=0;$i<count($result);$i++){
                $result[$i]['content']=str_replace('/\t','',$result[$i]['content']);
            }
            $this->returnJsonData(1, '获取成功', $result);
        }

    }


}