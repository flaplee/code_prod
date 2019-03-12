<?php defined('IN_PHPCMS') or exit('No permission resources.'); ?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=7" />
<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
<meta name="format-detection" content="telephone=no" />
<meta name="fragment" content="!" />
<meta name="baidu-site-verification" content="s8lKq14hsa" />
<title><?php if(isset($SEO['title']) && !empty($SEO['title'])) { ?><?php echo $SEO['title'];?><?php } ?><?php echo $SEO['site_title'];?></title>
<meta name="keywords" content="<?php echo $SEO['keyword'];?>">
<meta name="description" content="<?php echo $SEO['description'];?>">
<style>
 body.loading * {
    display: none;
}
body.loading #loading,
body.loading #loading * {
    display: block;
}
</style>
<script type="text/javascript" src='<?php echo APP_PATH;?>framework/all.js'></script>
</head>
<body class="loading">
    <div class="top-box">
        <div class="row clearfix">
            <div class="fl">
                <i class="icon iconfont tianliangico">&#xe728;</i>
                <a href="/">天亮培优学校</a>
            </div>
            <div class="fr">
                <a href="<?php echo $CATEGORYS['27']['url'];?>">关于我们</a>
                <a href="<?php echo $CATEGORYS['33']['url'];?>">客服中心</a>
                <a href="<?php echo $CATEGORYS['13']['url'];?>">天亮社区</a>
                <span><i class="icon iconfont phone">&#xe634;</i>资讯热线: 027-81771511</span>
            </div>
        </div>
    </div>
    <div class="header-box">
        <div class="header-inner clearfix">
            <div class="logo-box">
                <a class="logo" href="/" title="天亮教育-天亮培优学校">天亮教育-天亮培优学校</a>
            </div>
            <div class="post-box">
                <ul class="post-inner">
                    <li class="item"><a href="javascript:;" title=""><i class="icon-weibo"></i>微博</a></li>
                    <li class="item"><a href="javascript:;" title=""><i class="icon-weixin"></i>微信</a></li>
                    <li class="item"><a href="javascript:;" title=""><i class="icon-cooperate"></i>商务合作</a></li>
                </ul>
                <div class="post-wrap">
                    <a title="天亮教育-天亮教育培优平台" href="javascript:;" target="_blank">天亮教育-天亮教育培优平台订票</a>
                </div>
            </div>
        </div>
        <div class="header-nav">
            <ul class="nav-box">
                <li class="item item-course">天亮培优计划</li>
                <li class="item"><a class="home-item" href="<?php echo siteurl($siteid);?>">首页</a></li>
                <?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"get\" data=\"op=get&tag_md5=36fba9420af43a056a187e7b9c9f2dce&sql=select+%2A+from+phpcms_category+where+catid+in%2822%2C23%2C24%2C25%29&return=data\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">修改</a>";}pc_base::load_sys_class("get_model", "model", 0);$get_db = new get_model();$r = $get_db->sql_query("select * from phpcms_category where catid in(22,23,24,25) LIMIT 20");while(($s = $get_db->fetch_next()) != false) {$a[] = $s;}$data = $a;unset($a);?>
                    <?php $n=1; if(is_array($data)) foreach($data AS $k => $r) { ?>
                        <li class="item <?php if($catid == $r['catid']) { ?>current<?php } ?>">
                            <a class="booking-item" href="<?php echo $CATEGORYS[$r['catid']]['url'];?>"><?php echo $r['catname'];?></a>
                        </li>
                    <?php $n++;}unset($n); ?>
                <?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
                <?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"get\" data=\"op=get&tag_md5=52dc6eed59a41486e738bf3d7d45b554&sql=select+%2A+from+phpcms_category+where+catid+in%2813%29&return=data\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">修改</a>";}pc_base::load_sys_class("get_model", "model", 0);$get_db = new get_model();$r = $get_db->sql_query("select * from phpcms_category where catid in(13) LIMIT 20");while(($s = $get_db->fetch_next()) != false) {$a[] = $s;}$data = $a;unset($a);?>
                    <?php $n=1; if(is_array($data)) foreach($data AS $k => $r) { ?>    
                        <li class="item <?php if($catid==$r['catid']) { ?>current<?php } ?>">
                            <a class="booking-item" href="<?php echo $CATEGORYS[$r['catid']]['url'];?>"><?php echo $r['catname'];?></a>
                        </li>    
                    <?php $n++;}unset($n); ?>
                <?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
            </ul>
        </div>
    </div>
    <div id="page">