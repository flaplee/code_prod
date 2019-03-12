<?php defined('IN_PHPCMS') or exit('No permission resources.'); ?><!DOCTYPE html>
<html ng-app="yiqihao_nh" class="yiqihao_nh" id="yiqihao_nh">
<head>
    <meta charset="utf-8">
    <meta name="baidu-site-verification" content="s8lKq14hsa" />
    <title><?php if(isset($SEO['title']) && !empty($SEO['title'])) { ?><?php echo $SEO['title'];?><?php } ?><?php echo $SEO['site_title'];?></title>
    <meta name="keywords" content="<?php echo $SEO['keyword'];?>">
    <meta name="description" content="<?php echo $SEO['description'];?>">
    <link rel="stylesheet" href="<?php echo APP_PATH;?>dev/special/tianliang/css/style.css">
<body>
    <!-- header -->
    <div id="header">
        <div class="top">
            <div class="wrap">
                <div class="top-left">
                    <span class="icon icon-phone"></span>
                    <a href="/">天亮培优学校</a>
                </div>
                <div class="top-right">
                    <a href="<?php echo APP_PATH;?>html/special/special/">天亮专题</a>
                    |
                    <a href="<?php echo APP_PATH;?>html/about/us/">关于我们</a>
                    |
                    <a href="<?php echo APP_PATH;?>html/service/center/">客服中心</a>
                    |
                    <a href="<?php echo APP_PATH;?>community/">天亮社区</a>
                    |
                    <a href="javascript:;">资讯热线: 027-81771511</a>
                </div>
            </div>
        </div>

        <div class="header">
            <div id="logo">
                <a href="javascript:;"></a>
            </div>
        </div>
    </div>
    <!-- /. header -->