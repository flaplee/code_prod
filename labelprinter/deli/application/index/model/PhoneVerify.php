<?php
namespace app\index\model;

use app\admin\model\Base;

class PhoneVerify extends Base{
    
//自动填充时间    
protected $autoWriteTimestamp = false;


/*验证码验证
 * 
 */
    public function checkVerify($tepehone,$verify,$type){
        $data['telephone']=$tepehone;
        $data['type']=$type;
        $result =db($this->getTheTable())->where($data)->order('id desc')->find();
        
        if(empty($result)){
            $this->setError('无效验证码');
            return false;
        };
//        
//        if($result['type']!=$type){
//            $this->setError('无效验证码');
//            return false;
//        }
        
        if($result['status']==1){
            $this->setError('无效验证码');
            return false;
        };
        
        $now =time();
        if($result['create_time']<$now-300){
            $this->setError('验证码超时');
            return false;
        };
        
        if($result['verify_code']!=$verify){
            $this->setError('验证码输入有误');
            return false;
        };
        
        
//        $result['status']=1;
//        $this->__msave($result);
        
        return true;
    }
    
    
/*修改短信验证码状态
 * 
 */    
    public function changePhoneVerify($tepehone,$type){
        $data['telephone']=$tepehone;
        $data['type']=$type;
        $data1['status']=1;
        $result=$this->where($data)->update($data1);
        return true;
    }
    
/*新增验证码
 * 
 */
    public function addVerify($telephone,$verify_code,$type){
        $data['telephone']=$telephone;
        $data['verify_code']=$verify_code;
        $data['type']=$type;
        $data['send_date']=date('Y-m-d',time());
        $data['create_time']=time();
        return $this->insert($data);
    }
    
    
/*发送验证码之前验证
 * 
 */
    public function checkPhoneAble($tel){
        $now =time();
        $now_date =date('Y-m-d',$now);
        $data['telephone']=$tel;
        $data['send_date']=$now_date;
        $result =db($this->getTheTable())->where($data)->order('id desc')->select();
        
        
        if(!empty($result)){
            
            //验证1分钟
            if($now-$result[0]['create_time']<60){
                $this->setError('您发送的时间太频繁,请于'.($now-$result[0]['create_time'])."秒后发送");
                return false;
            }
            
            if(count($result)>=5){
                if($now-$result[4]['create_time']<3600){
                    $this->setError("您发送的时间太频繁,请于1小时后再发送");
                    return false;
                }
            }
            
            
            
            //验证1天
            if(count($result)>10){
                $this->setError('您今天已经用该手机号获取了10次验证码，已达到上限，烦请明天再来！~~');
                return false;
            }
        }
        return true;
        
        
    }
}