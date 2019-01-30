<?php
namespace app\index\controller;
use think\Db;
use think\Config;
use think\Request;
header('content-type:text/html;charset=utf-8' );

class Client extends ApiBase
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
//        $headers=getallheaders();
//        $this->returnJsonData(1, '666', $headers);exit;
//        print_r(getallheaders());exit;
//        $this->verifyUser();
//        $this->__checkParam('page',$this->input);
        extract($this->input);
        
        $page =1;
        $page_size=10000;
        
        $typelist =model('admin/Icons')->getTypeNameList();
        if(empty($typelist)){
            $this->returnJson(-1, '暂无分类数据');
        }
        
        
        $type_name =(!isset($type_name)|| empty($type_name))?$typelist[0]['type_name']:$type_name;
        
        $data['type_name']=$type_name;
        $data['status']=1;
        
        $result =db('Icons')->where($data)->limit(($page-1)*$page_size.",".$page_size)->select();
        
        $back['typelist']=$typelist;    
       

        
        if(empty($result)){
             $back['datalist']=null;    
            $this->returnJsonData(1, '暂无更多数据',$back);
        }
        
        foreach($result as $k=>$v){
            $result[$k]['picture']= generalImg($v['picture']);
        }
        $back['datalist']=$result;
        
        
        $this->returnJsonData(1, '获取成功', $back);
    }
    /*
  *
  */

    public function get_font_list(){
      //  $this->__checkParam('page',$this->input);
        extract($this->input);

        $page =1;
        $page_size=100000;
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
    
/*获取模板页
 * @param type 1获取全部2只获取类型
 */
    public function get_cloud_lable_list(){
        $this->__checkParam('type,plat',$this->input);
        extract($this->input);
        $page =isset($page)?$page:1;
       // $page =1;
        $page_size=1000;
        $type =isset($this->input['type'])?$this->input['type']:1;
        $plat =isset($this->input['plat'])?$this->input['plat']:1;
        $typelist =model('admin/LableType')->get_all_type_list();
        if(empty($typelist)){
            $this->returnJson(0, '暂无分类数据');
        }
        $back['typelist']=$typelist;    
        $back['datalist']=null;    
        if($type==2){
            $this->returnJsonData(1, '获取成功', $back);
        }
        $name =isset($name)?$name:"";
        $size =isset($size)?$size:"";
        
        
        $type_id =(!isset($type_id)|| empty($type_id))?$typelist[0]['id']:$type_id;
        
        $data['type']=$plat;
        $data['type_id']=$type_id;
        $data['status']=1;
//
//        if(!empty($size)){
//            $size_arr = explode('*', $size);
//            if(intval($size_arr[0])!=0){
//                $data['lable_width']=intval($size_arr[0]);
//            }
//            if(isset($size_arr[1]) && intval($size_arr[1])!=0){
//                $data['lable_height']=intval($size_arr[1]);
//            }
//        }
        
        if(!empty($name)){
            $data['lable_width|lable_height|lable_name']=['like',"%".$name."%"];
            unset($data['type_id']);
        }
        
        
        
        $result =db('Lable')->where($data)->order('id desc')->limit(($page-1)*$page_size.",".$page_size)->select();
        
        
        
        
        if(empty($result)){
            $this->returnJsonData(1, '暂无更多数据',$back);
        }
        
        foreach($result as $k=>$v){
            $result[$k]['lable_cover']= generalImg($v['lable_cover']);
            //处理data
            $thedata =json_decode($result[$k]['data'],true);
            $thedata['backURL']=generalImg($thedata['backURL']);
            if(isset($thedata['draftStickers'])){
                foreach($thedata['draftStickers'] as $k1=>$v1){
                    if(isset($v1['path'])){
                        $thedata['draftStickers'][$k1]['path']= generalImg($v1['path']);
                    }
                }
            }
            $result[$k]['data']=$thedata;
        }
        $back['typelist']=$typelist;
        $back['datalist']= ($result);
        
        
        $this->returnJsonData(1, '获取成功', $back);
    }
    
 /*保存标签
  * @param int type 1android 2ios
  * @param data mix 数据
  */   
    public function save_lable(){
        $member_result =$this->verifyUser();
        if($member_result['type']!=2){
            $this->returnJson(0, '身份有误');
        }
        $member_id=$member_result['id'];
      //  $member_id=2;
        $this->__checkParam('imgcount,data,type,type_id',$this->input);
        extract($this->input);
        
        $data=json_decode($data,true);


        if($type!=1 && $type!=2){
            $this->returnJson(0,'类型有误');
        }
        if(!isset($data['lable_name'])){
            $this->returnJson(0, '数据有误，不存在模板名称字段');
        }
        $lable_name =$data['lable_name'];
        if(!isset($data['lable_height'])){
            $this->returnJson(0, '数据有误，不存在模板高度');
        }
        $lable_height =$data['lable_height'];
        
        if(!isset($data['lable_width'])){
            $this->returnJson(0, '数据有误，不存在模板宽度');
        }
        $lable_width =$data['lable_width'];
        
        //检验type_id
        $type_result =db('LableType')->find($type_id);
        
        if(empty($type_result) || $type_result['status']!=1){
            $this->returnJson(0,'请上传正确的模板分类');
        }
        
        $file1 = request()->file('lable_cover');
        $lable_cover="";
        if(!empty($file1)){
            // 移动到框架应用根目录/public/uploads/ 目录下
            $info = $file1->validate(['size'=>2*1024*1024,'ext'=>'jpg,png,gif'])->move(ROOT_PATH . 'public' . DS . 'uploads'. DS .'lable');
           // $this->returnJson(0, '777');
            if($info){
                    $save_name =$info->getSaveName();
                    $save_name =  str_replace('\\', '/', $save_name);
                    $file_path ='/uploads/lable/'.$save_name;
                    $lable_cover=$file_path;
            }else{
                    $this->returnJson(0,$file->getError());
            }
        }else{
            $this->returnJson(0,'请上传模板封面');
        }
        $file2 = request()->file('backurl');
        $backurl="";
        if(!empty($file2)){
            // 移动到框架应用根目录/public/uploads/ 目录下
            $info = $file2->validate(['size'=>2*1024*1024,'ext'=>'jpg,png,gif'])->move(ROOT_PATH . 'public' . DS . 'uploads'. DS .'lable');
            if($info){
                    $save_name =$info->getSaveName();
                    $save_name =  str_replace('\\', '/', $save_name);
                    $file_path ='/uploads/lable/'.$save_name;
                    $backurl=$file_path;
            }else{
                    $this->returnJson(0,$file->getError());
            }
        }
        
        $dataimg_arr=[];
        if($imgcount>0){
            for($t=1;$t<=$imgcount;$t++){
                $files = request()->file('dataimg'.$t);
                if(!empty($files)){
                    // 移动到框架应用根目录/public/uploads/ 目录下
                    $info = $files->validate(['size'=>2*1024*1024,'ext'=>'jpg,png,gif'])->move(ROOT_PATH . 'public' . DS . 'uploads'. DS .'lable');
                    if($info){
                            $save_name =$info->getSaveName();
                            $save_name =  str_replace('\\', '/', $save_name);
                            $file_path ='/uploads/lable/'.$save_name;
                            $dataimg_arr[]=$file_path;
                    }else{
                            $this->returnJson(0,$file->getError());
                    }
                }
            }

    //        $file3 = request()->file('dataimg');
    //        $dataimg_arr=[];
    //        if(!empty($file3)){
    //            foreach($file3 as $item){
    //                $info = $item->validate(['ext'=>'jpg,png,gif,jpeg'])->move(ROOT_PATH . 'public' . DS . 'uploads'. DS .'lable');
    //                if($info){
    //                    $save_name =$info->getSaveName();
    //                    $save_name =  str_replace('\\', '/', $save_name);
    //                    $file_path ='/uploads/lable/'.$save_name;
    //                    $dataimg_arr[]=$file_path;
    //                }else{
    //                    // 上传失败获取错误信息
    //                    $this->returnJson(0,$item->getError());
    //                }
    //            }
    //        }

            $datalist =isset($data['draftStickers'])?$data['draftStickers']:[];
            $count=0;
            foreach($data['draftStickers'] as $k=>$v){
                if(isset($v['path'])){
                   $count++;
                }
            }
            if($count!=count($dataimg_arr)){
                $this->returnJson(0,'您传的素材图片与draftStickers里面不符合');
            }

            $i=0;
            foreach($data['draftStickers'] as $k=>$v){
                if(isset($v['path'])){
                    $data['draftStickers'][$k]['path']=$dataimg_arr[$i];
                    $i++;
                }
            }
        }
        
        $data['backURL']=$backurl;
        
        
        $insert['create_id']=$member_id;
        $insert['lable_name']=$lable_name;
        $insert['lable_height']=$lable_height;
        $insert['lable_width']=$lable_width;
        $insert['lable_cover']=$lable_cover;
        $insert['type_id']=$type_id;
        $insert['type']=$type;
        $insert['data']=json_encode($data);
        $insert['create_time']=time();
        db('Lable')->insert($insert);
        
        //记录每日统计
         model('admin/DayStatic')->add_static(0,1);
        
        
        
        $this->returnJson(1, '添加云模板成功');
        
    }
    
    public function feeback(){
        $member_result =$this->verifyUser();
        $member_id=$member_result['id'];
        $this->__checkParam('content',$this->input);
        extract($this->input);
        $data['content']=$content;
        $data['create_id']=$member_id;
        $data['create_time']=time();
        $result =db('Feedback')->insert($data);
       $this->returnJson(1, '反馈成功');
        
    }
    
/*
 * 
 */    
    public function add_device(){
        $member_result =$this->verifyUser();
        $member_id=$member_result['id'];
        $this->__checkParam('device_code',$this->input);
        extract($this->input);
        
        $result =model('admin/Device')->add_device($member_id,$device_code);
        
        //记录每日统计
        if($result===true)
            model('admin/DayStatic')->add_static(0,0,1);
        $this->returnJson(1,'上传成功');
    }
    public function get_config_list(){
//        $this->__checkParam('key',$this->input);
  //      extract($this->input);
        $back['user_protocol']=sysC('USER_PROTOCOL');
        $back['operation_manual']=sysC('OPERATION_MANUAL');
        $this->returnJsonData(1, '获取成功', $back);
    }

    
}
