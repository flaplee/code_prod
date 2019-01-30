<?php
namespace app\admin\controller;
use JPush\Http;
use think\Db;
use think\Config;
use think\Request;
header('content-type:text/html;charset=utf-8' );


class Temp extends Base
{
    public function temp_list(){
        $this->assign('_title','云模板列表');
        $this->setCookie('temp_list');
        $this->setParam('temp_list',['type'=>1]);
        return $this->fetch();
    }
    public function ios_temp_list(){
        $this->assign('_title','云模板列表');
        $this->setCookie('temp_list');
        $this->setParam('temp_list',['type'=>2]);
        return $this->fetch();
    }
    public function getTempList()
    {
        $model = model('Lable');
        $param = input();
        $param1 =$this->getParam('temp_list');
        $param = array_merge($param,$param1);
        $result = $model->getListData($param);
        $result = $this->__doList($model, $result);
        return ($result);
    }


    /*
 *
 */
    public function temp_change_status(){

        $id = input('id/a');
        if(is_array($id)) sort($id);
        $id = is_array($id) ? implode(',',$id) : $id;
        if ( empty($id) ) {
            $this->error('请选择要操作的数据!');
        }
        $ids= explode(',', $id);
        $id_count=count($ids);


        $model="Lable";

        $action =input('post.ope');
        $thestatus=0;
        switch($action){
            case 'open':
                $thestatus=3;
                break;
            case 'close':
                $thestatus=4;
                break;
            case 'delete':
                $thestatus=5;
                break;
            default:
                $this->error('操作类型有误',$_SERVER['HTTP_REFERER']);
        };


        $datass['id'] =['in',$id];
        $resultss =db($model)->where($datass)->select();
        $thecount=count($resultss);
        if($thecount!=$id_count){
            $this->error('选择的数据不匹配');
        }

//        if(!is_admin()){
//            $map['merchant_id']=MERID;
//        }


//        $map['is_root']=0;
        $map=[];

        $result =model($model)->__changeStatus($id,$action,$map);

        if($action=='delete'){
            model('DayStatic')->delelable();
        }

        if($result){


            //记录修改状态、删除
            $insertall =[];
            foreach($resultss as $k=>$v){
                $insertall[$k]['admin_id']=UID;
                $insertall[$k]['themodel']=$model;
                $insertall[$k]['object_id']=$v['id'];
                $insertall[$k]['status']=$thestatus;
                $insertall[$k]['json_data']=json_encode($v);
                $insertall[$k]['create_time']=time();
                $insertall[$k]['content']=model('admin/AdminLog')->generalContent($thestatus,$model,$v['id'],json_encode($v));
            }
            model('admin/AdminLog')->insertAll($insertall);
            $this->success('修改成功',$_SERVER['HTTP_REFERER']);
        }else
            $this->error('修改失败',$_SERVER['HTTP_REFERER']);


    }


    public function type_list(){
        $this->assign('_title','模板类型列表');
        $this->setCookie('type_list');
        $this->setParam('type_list');
        return $this->fetch();
    }
    public function getTypeList()
    {
        $model = model('LableType');
        $param = input();
        $param1 =$this->getParam('type_list');
        $param = array_merge($param,$param1);
        $result = $model->getListData($param);
        $result = $this->__doList($model, $result);
        return ($result);
    }

    /*新增模板类型
*
*/
    public function type_add(){

        $model =model('LableType');
        if(request()->isPost()){

            /***自定义验证区域*****/
            $data=input('post.');
            //存储
            $back =$model->__msave(input('post.'),'LableType');
            $back['url']=($back['code']==0)?'':$this->getCookie('type_list');
            if($back['code']==1){
                $theid =(isset($data['id'])&& !empty($data['id']))?$data['id']:$back['id'];
                $is_insert =(isset($data['id'])&& !empty($data['id']))?2:1;
                model('AdminLog')->addLog(UID,'LableType',$theid,$is_insert,json_encode($data));
            }


            $this->returnBack($back['code'],$back['msg'],'',$back['url']);
        }else{
            $title =empty(input('id'))?'新增模板类型':'修改模板类型';
            return $this->__edits($model,input('id'),null,$title);
        }
    }
    /*
*
*/
    public function type_change_status(){

        $id = input('id/a');
        if(is_array($id)) sort($id);
        $id = is_array($id) ? implode(',',$id) : $id;
        if ( empty($id) ) {
            $this->error('请选择要操作的数据!');
        }
        $ids= explode(',', $id);
        $id_count=count($ids);


        $model="LableType";

        $action =input('post.ope');
        $thestatus=0;
        switch($action){
            case 'open':
                $thestatus=3;
                break;
            case 'close':
                $thestatus=4;
                break;
            case 'delete':
                $thestatus=5;
                break;
            default:
                $this->error('操作类型有误',$_SERVER['HTTP_REFERER']);
        };


        $datass['id'] =['in',$id];
        $resultss =db($model)->where($datass)->select();
        $thecount=count($resultss);
        if($thecount!=$id_count){
            $this->error('选择的数据不匹配');
        }

//        if(!is_admin()){
//            $map['merchant_id']=MERID;
//        }


//        $map['is_root']=0;
        $map=[];

        $result =model($model)->__changeStatus($id,$action,$map);
        if($result){


            //记录修改状态、删除
            $insertall =[];
            foreach($resultss as $k=>$v){
                $insertall[$k]['admin_id']=UID;
                $insertall[$k]['themodel']=$model;
                $insertall[$k]['object_id']=$v['id'];
                $insertall[$k]['status']=$thestatus;
                $insertall[$k]['json_data']=json_encode($v);
                $insertall[$k]['create_time']=time();
                $insertall[$k]['content']=model('admin/AdminLog')->generalContent($thestatus,$model,$v['id'],json_encode($v));
            }
            model('admin/AdminLog')->insertAll($insertall);
            $this->success('修改成功',$_SERVER['HTTP_REFERER']);
        }else
            $this->error('修改失败',$_SERVER['HTTP_REFERER']);


    }
}