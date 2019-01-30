<?php
namespace app\admin\controller;
use JPush\Http;
use think\Db;
use think\Config;
use think\Request;


class Client extends Base
{
    public function version_list(){
        $this->assign('_title','版本列表');
        $this->setCookie('version_list');
        $this->setParam('version_list');
        return $this->fetch();
    }
    public function getVersionList()
    {
        $model = model('Version');
        $param = input();
        $param1 =$this->getParam('version_list');
        $param = array_merge($param,$param1);
        $result = $model->getListData($param);
        $result = $this->__doList($model, $result);
        return ($result);
    }
    /*新增版本
 *
 */
    public function version_add(){

        $model =model('Version');
        if(request()->isPost()){

            /***自定义验证区域*****/
            $data=input('post.');
            //存储
            $back =$model->__msave(input('post.'),'Version');
            $back['url']=($back['code']==0)?'':$this->getCookie('version_list');
            if($back['code']==1){
                $theid =(isset($data['id'])&& !empty($data['id']))?$data['id']:$back['id'];
                $model->setqrcode($theid);
                $is_insert =(isset($data['id'])&& !empty($data['id']))?2:1;
                model('AdminLog')->addLog(UID,'Version',$theid,$is_insert,json_encode($data));
            }


            $this->returnBack($back['code'],$back['msg'],'',$back['url']);
        }else{
            $title =empty(input('id'))?'新增版本':'修改版本';
            return $this->__edits($model,input('id'),null,$title);
        }
    }

    /*
 *
 */
    public function version_change_status(){

        $id = input('id/a');
        if(is_array($id)) sort($id);
        $id = is_array($id) ? implode(',',$id) : $id;
        if ( empty($id) ) {
            $this->error('请选择要操作的数据!');
        }
        $ids= explode(',', $id);
        $id_count=count($ids);


        $model="Version";

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
    /*下载文件
*
*
*/
    public function read_file($id){
        $result=db('Version')->where('id',$id)->find();
        $file=$result['url'];
        $file_dir=ROOT_PATH.'public';
//        echo $file_dir.$file;
        if(!file_exists($file_dir.$file)){
            echo "文件找不到";
            exit();
        }else{
            $file1=fopen($file_dir.$file,"r");
            Header("Content-type:application/octet-stream");
            Header("Accept-Ranges:bytes");
            Header("Accept-Length:".filesize($file_dir.$file));
            Header("Content-Disposition:attachment;filename=".$file);
            ob_clean();
            flush();
            echo fread($file1,filesize($file_dir.$file));
            fclose($file1);
            exit();
        }
    }
    public function down_file($id){
        $result=db('Font')->where('id',$id)->find();
        $file=$result['font_url'];
        $file_dir=ROOT_PATH.'public';
//        echo $file_dir.$file;
        if(!file_exists($file_dir.$file)){
            echo "文件找不到";
            exit();
        }else{
            $file1=fopen($file_dir.$file,"r");
            Header("Content-type:application/octet-stream");
            Header("Accept-Ranges:bytes");
            Header("Accept-Length:".filesize($file_dir.$file));
            Header("Content-Disposition:attachment;filename=".$file);
            ob_clean();
            flush();
            echo fread($file1,filesize($file_dir.$file));
            fclose($file1);
            exit();
        }
    }



    public function icons_list(){
        $this->assign('_title','图标列表');
        $this->setCookie('icons_list');
        $this->setParam('icons_list');
        return $this->fetch();
    }
    public function getIconsList()
    {
        $model = model('Icons');
        $param = input();
        $param1 =$this->getParam('icons_list');
        $param = array_merge($param,$param1);
        $result = $model->getListData($param);
        $result = $this->__doList($model, $result);
        return ($result);
    }
    /*新增版本
 *
 */
    public function icons_add(){

        $model =model('Icons');
        if(request()->isPost()){

            /***自定义验证区域*****/
            $data=input('post.');
            //存储
            $back =$model->__msave(input('post.'),'Icons');
            $back['url']=($back['code']==0)?'':url('icons_list');
            if($back['code']==1){
                $theid =(isset($data['id'])&& !empty($data['id']))?$data['id']:$back['id'];
                $is_insert =(isset($data['id'])&& !empty($data['id']))?2:1;
                model('AdminLog')->addLog(UID,'Icons',$theid,$is_insert,json_encode($data));
            }


            $this->returnBack($back['code'],$back['msg'],'',$back['url']);
        }else{
            $title =empty(input('id'))?'新增图标':'修改图标';
            return $this->__edits($model,input('id'),null,$title);
        }
    }

    /*
 *
 */
    public function icons_change_status(){

        $id = input('id/a');
        if(is_array($id)) sort($id);
        $id = is_array($id) ? implode(',',$id) : $id;
        if ( empty($id) ) {
            $this->error('请选择要操作的数据!');
        }
        $ids= explode(',', $id);
        $id_count=count($ids);


        $model="Icons";

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


    public function font_list(){
        $this->assign('_title','字体列表');
        $this->setCookie('font_list');
        $this->setParam('font_list');
        return $this->fetch();
    }
    public function getFontList()
    {
        $model = model('Font');
        $param = input();
        $param1 =$this->getParam('font_list');
        $param = array_merge($param,$param1);
        $result = $model->getListData($param);
        $result = $this->__doList($model, $result);
        return ($result);
    }
    /*新增字体
 *
 */
    public function font_add(){

        $model =model('Font');
        if(request()->isPost()){

            /***自定义验证区域*****/
            $data=input('post.');
            //存储
            $back =$model->__msave(input('post.'),'Font');
            $back['url']=($back['code']==0)?'':$this->getCookie('font_list');
            if($back['code']==1){
                $theid =(isset($data['id'])&& !empty($data['id']))?$data['id']:$back['id'];
                $is_insert =(isset($data['id'])&& !empty($data['id']))?2:1;
                model('AdminLog')->addLog(UID,'Font',$theid,$is_insert,json_encode($data));
            }


            $this->returnBack($back['code'],$back['msg'],'',$back['url']);
        }else{
            $title =empty(input('id'))?'新增字体':'修改字体';
            return $this->__edits($model,input('id'),null,$title);
        }
    }

    /*
 *
 */
    public function font_change_status(){

        $id = input('id/a');
        if(is_array($id)) sort($id);
        $id = is_array($id) ? implode(',',$id) : $id;
        if ( empty($id) ) {
            $this->error('请选择要操作的数据!');
        }
        $ids= explode(',', $id);
        $id_count=count($ids);


        $model="Font";

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