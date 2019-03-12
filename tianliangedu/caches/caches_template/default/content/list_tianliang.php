<?php defined('IN_PHPCMS') or exit('No permission resources.'); ?><?php include template("content","header"); ?>
<div id="course" style="display:block;">
    <style>
    .course-detail .course-list{
        width: 950px;
        margin:0 auto;
    }

    .course-detail .course-list>a {
        display: inline-block;
        width: 100%;
        height: 270px;
        margin-bottom: 20px;
        background: white
    }

    .course-detail .course-list>a:hover {
        color: #323232;
        box-shadow: 0px 0px 10px 0px #ddd;
        margin-top: -1px;
        margin-bottom: 21px
    }

    .course-detail .course-list>a:hover .join button {
        background: #22905e
    }

    .course-detail .course-inner {
        width: 705px;
        height: 270px;
        padding-left: 25px
    }

    .course-detail .course-inner ul {
        margin: 0 50px 0 25px;
        width: 200px;
        height: 160px
    }

    .course-detail .course-inner ul li {
        width: 190px;
        list-style-type: disc;
        line-height: 24px;
        padding-left: 10px
    }

    .course-detail .course-inner h3 {
        height: 66px;
        margin: 20px 0 15px
    }

    .course-detail .course-inner .speaker {
        width: 414px;
        height: 160px;
        overflow: hidden
    }

    .course-detail .course-inner .speaker>div img {
        display: block;
        width: 64px;
        height: 64px;
        border: 1px solid #979797;
        border-radius: 50%
    }

    .course-detail .course-inner .speaker .information {
        margin-left: 15px;
        width: 180px;
        line-height: 20px
    }

    .course-detail .course-inner .speaker .information .text {
        margin: 10px 0;
        overflow: hidden
    }

    .course-detail .course-inner .speaker .join {
        padding-left: 20px;
        border-left: 1px solid #e1e1e1
    }

    .course-detail .course-inner .speaker .join button {
        margin: 10px 0;
        padding: 6px 30px;
        color: white;
        background: #2AA26B
    }

    .img {
        background: #f3f3f3;
        width: 200px;
        height: 270px;
        overflow: hidden
    }

    .img img {
        height: 270px;
    }

    .img_inside {
        position: relative;
        float: left;
        left: 50%;
        background: #f3f3f3
    }

    .img_inside img {
        width: auto;
         position:relative; 
        float: left;
        left: -50%;
    }
    </style>
    <div class="course-box clearfix">
        <div class="course-nav">
            <ul class="course-inner">
                <li class="item"><h4>理科辅导</h4><span>小学数学</span><span>初中理科</span><span>高中理科</span></li>
                <li class="item"><h4>文科辅导</h4><span>小学语文</span><span>高中文科</span><span>初中文科</span></li>
                <li class="item"><h4>兴趣爱好</h4><span>科技艺术</span><span>艺术体育</span><span>托管班</span><span>夏冬令营</span></li>
            </ul>
            <div class="course-relate">
                <p class="title">天亮咨询热线</p>
                <div class="info">
                    <i class="iconfont">&#xe629;</i>
                    <div class="text">027-81771511</div>
                </div>
                <div class="line"></div>
                <a class="inner" href="javascript:;">
                    <p>不知道该如何选择？</p>
                    <p><span>让咨询顾问主动联系你吧！</span></p>
                </a>
            </div>
        </div>
        <div class="course-cont">
            <div class="course-crumb">
                当前位置：<a href="<?php echo siteurl($siteid);?>">首页</a>&gt;<?php echo catpos($catid);?>&nbsp;&nbsp;<span class="sup-title">课程列表</span>
            </div>
            <div class="course-detail">
                <div class="course-list">
                    <?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"content\" data=\"op=content&tag_md5=ee055673aed1d815ebdacd032764917d&action=lists&catid=%24catid&num=25&order=id+DESC&page=%24page&moreinfo=1\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">编辑</a>";}$content_tag = pc_base::load_app_class("content_tag", "content");if (method_exists($content_tag, 'lists')) {$pagesize = 25;$page = intval($page) ? intval($page) : 1;if($page<=0){$page=1;}$offset = ($page - 1) * $pagesize;$content_total = $content_tag->count(array('catid'=>$catid,'order'=>'id DESC','moreinfo'=>'1','limit'=>$offset.",".$pagesize,'action'=>'lists',));$pages = pages($content_total, $page, $pagesize, $urlrule);$data = $content_tag->lists(array('catid'=>$catid,'order'=>'id DESC','moreinfo'=>'1','limit'=>$offset.",".$pagesize,'action'=>'lists',));}?>
                        <?php $n=1;if(is_array($data)) foreach($data AS $r) { ?>
                            <a href="<?php echo $r['url'];?>" target="_blank">
                                <div class="img fl">
                                    <div class="img_inside">
                                        <img src="<?php echo $r['courseimg'];?>" title="<?php echo $r['title'];?>" alt="<?php echo $r['title'];?>">
                                    </div>
                                </div>
                                <div class="fl course-inner">
                                    <h3 class="font_size20"><?php echo $r['title'];?></h3>
                                    <ul class="font_size14 fl">
                                        <li><?php echo str_cut($r[features], 80, '...');?></li>
                                        <li><?php echo str_cut($r[featuress], 80, '...');?></li>
                                        <li><?php echo str_cut($r[featuresss], 80, '...');?></li>
                                    </ul>
                                    <div class="speaker fl">
                                        <div class="fl">
                                            <img src="<?php echo $r['thumb'];?>" title="<?php echo $r['course'];?>" alt="<?php echo $r['course'];?>">
                                        </div>
                                        <div class="information font_size14 fl">
                                            <?php if($r[subject] == '') { ?>
                                                <p>课程概况：</p>
                                                <p><?php echo $r['abstract'];?></p>
                                            <?php } else { ?>
                                                <p>适合对象：</p>
                                                <p><?php echo $r['subject'];?></p>
                                            <?php } ?>
                                            <p class="text font_size12 font_color_gray"><?php echo $r['description'];?></p>
                                            <p class="font_color_black">课程地点：<?php echo $r['address'];?></p>
                                        </div>
                                        <div class="join font_size12 font_color_gray fr">
                                            <p class="font_size14 font_color_black">课程内容：</p>
                                            <p><em class="font_size24 font_color_black"><?php echo str_cut($r[course], 16, '...');?></em></p>
                                            <button>了解详情</button>
                                            <p>免费咨询</p>
                                            <p>027-81771511</p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        <?php $n++;}unset($n); ?>
                    <?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
                </div>
                <div id="pages" class="text-c"><?php echo $pages;?></div>
            </div>
        </div>
    </div>
</div>
<script src="<?php echo APP_PATH;?>framework/src/require.js" data-main="<?php echo APP_PATH;?>dev/page/course/course.js"></script>
<?php include template("content","footer"); ?>