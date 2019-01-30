<?php
namespace app\index\controller;
use think\Controller;
use think\Config;
use think\Db;
use think\exception\HttpResponseException;
use think\Request;

class Index extends Controller
{
    public function index(){
        //全部变成小写字母
        $agent = strtolower($_SERVER['HTTP_USER_AGENT']);
        $type ='other';
        //分别进行判断
        if(strpos($agent,'iphone') || strpos($agent,'ipad'))
       {
            //获取ios最新的
            $result=model('Version')->getnew(2);
            if(empty($result)){
                echo "暂无ios版本";
            }
            $this->redirect($result['href']);
        }

        if(strpos($agent,'android'))
       {
            $result=model('Version')->getnew(1);
            if(empty($result)){
                echo "暂无andriod版本";
            }
            $this->redirect($result['url']);
        }
       echo "system can not find your machine's model~";
    }
}
