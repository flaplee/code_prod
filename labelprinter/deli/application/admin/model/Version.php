<?php
namespace app\admin\model;

use app\admin\model\Base;

class Version extends Base
{

//自动填充时间
    protected $autoWriteTimestamp = false;



    public function getListData($param=null){
        $map =[];
        $page =(isset($param['page']) && intval($param['page'])>0)?intval($param['page']):1;
        $page_size=(isset($param['limit']) && intval($param['limit'])>0)?intval($param['limit']):10;

        if(isset($param['type'])){
            $map['type']=$param['type'];
        }
        //   print_r($param);exit;
        $count =$this->where($map)->count();
        $sql =$this->where($map)->limit(($page-1)*$page_size.','.$page_size)->order('version_num desc')->buildSql();
        $result =$this->query($sql);
        return $this->generalResult($result,$count);
    }
    public function __formatList($list = null) {
        if(!empty($list)){
            foreach($list as $k=>$v){
                $list[$k]['status']=$v['status']==1?"正常":"失效";
                $list[$k]['is_force']=$v['is_force']==1?"是":"不是";
                if($list[$k]['type']==1){
                    $list[$k]['type']='android';
                }
                if($list[$k]['type']==2){
                    $list[$k]['type']='ios';
                }

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
//        dump($data);exit();
        $picture=db('Version')->where('id',$data['id'])->find();
        if(empty($data['picture'])){
            $data['picture']=$picture['picture'];
        }
        if(empty($data['url'])){
            $data['url']=$data['down_url'];
        }
        unset($data['down_url']);
        return true;
    }

    /*插入之前
     *
     */

    public function __my_before_insert(&$data){
//        dump($data);exit();
        if(isset($data['down_url'])){
            unset($data['down_url']);
        }
        $data['status']=1;
        $data['create_time']=time();
        return TRUE;
    }
    public function setqrcode($id){
        $version=db('Version')->where('id',$id)->find();
        if(!empty($version['url'])){
            $url=generalImg($version['url']);
            $savePath = APP_PATH . '../public/qrcode/';
            $webPath = '/qrcode/';
            $qrData = $url;
            $qrLevel = 'H';
            $qrSize = '10';
            $savePrefix = 'DeLi';
            if($filename = createQRcode($savePath, $qrData, $qrLevel, $qrSize, $savePrefix)){
                $pic = $webPath . $filename;
            }
            $data['picture']=$pic;
            $result=db('Version')->where('id',$id)->update($data);
            if($result){
                return true;
            }else{
                return false;
            }
        }
    }
}